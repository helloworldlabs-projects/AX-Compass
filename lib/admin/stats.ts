/**
 * 통계 계산.
 *
 * 사전과 사후의 차이가 **교육 때문인지, 사람이 달라서인지**를 가리는 데 쓴다.
 * 평균이 5점 올랐다는 말만으로는 그 둘을 구분할 수 없다.
 *
 * 외부 라이브러리를 쓰지 않는다. 필요한 것은 분포 네 개(t, F, χ², 정규)의
 * 꼬리 확률뿐이고, 그건 불완전 감마·베타 함수로 다 나온다. 통계 패키지를
 * 통째로 들이면 번들만 무거워진다.
 *
 * **작은 표본을 조심한다.** 우리 화면은 응답이 5명뿐인 기업도 다룬다.
 * 그런 자료에 p 값을 붙이면 숫자는 나오지만 뜻은 없다. 그래서 모든 검정이
 * `usable` 과 `note` 를 함께 돌려준다 — 쓸 수 있는지, 왜 그런지.
 */

/* ── 기초 ────────────────────────────────────────────────── */

export function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** 표본분산(n-1). 모분산이 아니라 표본에서 모집단을 추정하는 값이다. */
export function variance(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1);
}

export function sd(xs: number[]): number {
  return Math.sqrt(variance(xs));
}

const round = (v: number, d = 3): number => {
  if (!Number.isFinite(v)) return 0;
  const f = 10 ** d;
  return Math.round(v * f) / f;
};

/* ── 분포 함수 ───────────────────────────────────────────── */

/** log Γ(x). Lanczos 근사. */
function lnGamma(x: number): number {
  const g = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
  }
  const z = x - 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < g.length; i++) a += g[i] / (z + i + 1);
  const t = z + g.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/** 정규화 불완전 베타 I_x(a,b). 연분수(Lentz)로 푼다. */
function betacf(a: number, b: number, x: number): number {
  const tiny = 1e-30;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= 200; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-12) break;
  }
  return h;
}

function incompleteBeta(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(
    lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x),
  );
  return x < (a + 1) / (a + b + 2)
    ? (front * betacf(a, b, x)) / a
    : 1 - (front * betacf(b, a, 1 - x)) / b;
}

/** 정규화 하부 불완전 감마 P(a,x). χ² 꼬리에 쓴다. */
function lowerGamma(a: number, x: number): number {
  if (x <= 0) return 0;
  if (x < a + 1) {
    // 급수 전개
    let sum = 1 / a;
    let term = sum;
    for (let n = 1; n < 500; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-14) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
  }
  // 연분수
  const tiny = 1e-30;
  let b = x + 1 - a;
  let c = 1 / tiny;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h;
}

/** 양측 p 값. t 분포. */
export function tTailTwoSided(t: number, df: number): number {
  if (!Number.isFinite(t) || df <= 0) return 1;
  return incompleteBeta(df / 2, 0.5, df / (df + t * t));
}

/** 상측 p 값. F 분포. */
export function fTailUpper(f: number, df1: number, df2: number): number {
  if (!Number.isFinite(f) || f <= 0 || df1 <= 0 || df2 <= 0) return 1;
  return 1 - incompleteBeta(df1 / 2, df2 / 2, (df1 * f) / (df1 * f + df2));
}

/** 상측 p 값. χ² 분포. */
export function chiTailUpper(x: number, df: number): number {
  if (!Number.isFinite(x) || x <= 0 || df <= 0) return 1;
  return 1 - lowerGamma(df / 2, x / 2);
}

/* ── 검정 결과의 공통 모양 ───────────────────────────────── */

export interface TestResult {
  /** 이 검정을 결과로 내보여도 되는가. 표본이 모자라면 false. */
  usable: boolean;
  /** 왜 쓸 수 없는지, 또는 읽을 때 조심할 점. */
  note: string | null;
  p: number | null;
  /** 0.05 기준. p 가 없으면 null. */
  significant: boolean | null;
}

/**
 * 유의 표시.
 *
 * 논문·보고서에서 쓰는 별표다. 표가 빽빽할 때 어디가 유의한지 눈으로
 * 바로 짚을 수 있다. 각주로 기준을 함께 적는다.
 */
export function stars(p: number | null): string {
  if (p === null) return '';
  if (p < 0.001) return '***';
  if (p < 0.01) return '**';
  if (p < 0.05) return '*';
  return '';
}

/** 보고서 표기법. 소수점 앞의 0 을 떼고 세 자리로 적는다(.018). */
export function pText(p: number | null): string {
  if (p === null) return '—';
  if (p < 0.001) return '< .001';
  return p.toFixed(3).replace(/^0/, '');
}

/** p 값을 사람이 읽는 말로. 숫자만 두면 0.03 과 0.3 을 같은 눈으로 본다. */
export function pLabel(p: number | null): string {
  if (p === null) return '—';
  if (p < 0.001) return 'p < .001';
  if (p < 0.01) return `p = ${p.toFixed(3)}`;
  return `p = ${p.toFixed(3)}`;
}

/**
 * 효과 크기 해석.
 *
 * 표본이 크면 작은 차이도 유의해지고, 작으면 큰 차이도 유의하지 않는다.
 * p 만 보면 "몇 명을 모았는가"를 "얼마나 달라졌는가"로 착각한다.
 */
/**
 * 문장에 넣는 형태.
 *
 * effectLabel() 이 돌려주는 `큼`·`작음` 은 표와 카드의 **라벨**이다.
 * 문장에 그대로 넣으면 "크기도 큼 편입니다" 가 된다.
 */
export function effectPhrase(d: number): string {
  const a = Math.abs(d);
  if (a < 0.2) return '거의 없습니다';
  if (a < 0.5) return '작은 편입니다';
  if (a < 0.8) return '중간쯤입니다';
  return '큰 편입니다';
}

export function effectLabel(d: number): string {
  const a = Math.abs(d);
  if (a < 0.2) return '미미';
  if (a < 0.5) return '작음';
  if (a < 0.8) return '중간';
  return '큼';
}

/* ── 1) 두 집단 평균 차이 (Welch t 검정) ─────────────────── */

export interface WelchResult extends TestResult {
  kind: 'welch';
  n1: number;
  n2: number;
  mean1: number;
  mean2: number;
  /** 표준편차. 보고서 표에 평균과 나란히 싣는다. */
  sd1: number;
  sd2: number;
  diff: number;
  t: number | null;
  df: number | null;
  /** Cohen's d. 두 집단의 표준편차를 합쳐 나눈 값. */
  d: number | null;
  effect: string | null;
}

/**
 * 독립 두 집단의 평균 차이.
 *
 * 사전 응시자 전체와 사후 응답자 전체는 **같은 사람들이 아니다.** 겹치는
 * 사람이 있어도 명단이 다르므로 독립 표본으로 본다. 분산이 같다고 가정하지
 * 않는 Welch 를 쓴다 — 두 집단의 인원과 흩어진 정도가 대개 다르다.
 */
export function welchTTest(a: number[], b: number[]): WelchResult {
  const n1 = a.length;
  const n2 = b.length;
  const m1 = mean(a);
  const m2 = mean(b);
  const base = {
    kind: 'welch' as const,
    n1,
    n2,
    mean1: round(m1, 2),
    mean2: round(m2, 2),
    sd1: round(sd(a), 3),
    sd2: round(sd(b), 3),
    diff: round(m2 - m1, 2),
  };

  if (n1 < 2 || n2 < 2) {
    return {
      ...base,
      usable: false,
      note: '각 집단이 2명 이상이어야 계산할 수 있습니다.',
      t: null,
      df: null,
      p: null,
      significant: null,
      d: null,
      effect: null,
    };
  }

  const v1 = variance(a);
  const v2 = variance(b);
  const se = Math.sqrt(v1 / n1 + v2 / n2);

  if (se === 0) {
    return {
      ...base,
      usable: false,
      note: '두 집단 모두 흩어짐이 없어 검정할 수 없습니다.',
      t: null,
      df: null,
      p: null,
      significant: null,
      d: null,
      effect: null,
    };
  }

  const t = (m2 - m1) / se;
  // Welch–Satterthwaite 자유도
  const df = (v1 / n1 + v2 / n2) ** 2 / ((v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1));
  const p = tTailTwoSided(t, df);

  const pooled = Math.sqrt(((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2));
  const d = pooled === 0 ? 0 : (m2 - m1) / pooled;

  const small = n1 < 10 || n2 < 10;
  return {
    ...base,
    usable: true,
    note: small ? '한쪽 집단이 10명 미만입니다. 방향만 참고하고 유의성은 단정하지 마세요.' : null,
    t: round(t, 3),
    df: round(df, 1),
    p: round(p, 4),
    significant: p < 0.05,
    d: round(d, 2),
    effect: effectLabel(d),
  };
}

/* ── 2) 같은 사람의 전후 차이 (대응 t 검정) ──────────────── */

export interface PairedResult extends TestResult {
  kind: 'paired';
  n: number;
  meanBefore: number;
  meanAfter: number;
  sdBefore: number;
  sdAfter: number;
  meanDiff: number;
  t: number | null;
  df: number | null;
  /** Cohen's dz. 차이값을 그 표준편차로 나눈다. */
  dz: number | null;
  effect: string | null;
  /** 오른 사람 수 / 내린 사람 수. 평균만으로는 몇 명이 움직였는지 모른다. */
  up: number;
  down: number;
  same: number;
}

/**
 * 같은 사람의 사전-사후 차이.
 *
 * 이름으로 이어진 사람만 쓴다. 사람마다의 원래 수준 차이가 상쇄되므로
 * 같은 크기의 변화라도 훨씬 또렷하게 잡힌다. 다만 모수가 작아진다 —
 * 그래서 전체 대 전체 비교와 **함께** 보여주고 어느 쪽인지 밝힌다.
 */
export function pairedTTest(pairs: { before: number; after: number }[]): PairedResult {
  const n = pairs.length;
  const before = pairs.map((p) => p.before);
  const after = pairs.map((p) => p.after);
  const diffs = pairs.map((p) => p.after - p.before);

  const base = {
    kind: 'paired' as const,
    n,
    meanBefore: round(mean(before), 2),
    meanAfter: round(mean(after), 2),
    sdBefore: round(sd(before), 3),
    sdAfter: round(sd(after), 3),
    meanDiff: round(mean(diffs), 2),
    up: diffs.filter((d) => d > 0).length,
    down: diffs.filter((d) => d < 0).length,
    same: diffs.filter((d) => d === 0).length,
  };

  if (n < 2) {
    return {
      ...base,
      usable: false,
      note: '짝지어진 사람이 2명 이상이어야 계산할 수 있습니다.',
      t: null,
      df: null,
      p: null,
      significant: null,
      dz: null,
      effect: null,
    };
  }

  const s = sd(diffs);
  if (s === 0) {
    return {
      ...base,
      usable: false,
      note: '모든 사람의 변화량이 같아 검정할 수 없습니다.',
      t: null,
      df: null,
      p: null,
      significant: null,
      dz: null,
      effect: null,
    };
  }

  const t = mean(diffs) / (s / Math.sqrt(n));
  const df = n - 1;
  const p = tTailTwoSided(t, df);
  const dz = mean(diffs) / s;

  return {
    ...base,
    usable: true,
    note:
      n < 10 ? '짝지어진 사람이 10명 미만입니다. 방향만 참고하고 유의성은 단정하지 마세요.' : null,
    t: round(t, 3),
    df,
    p: round(p, 4),
    significant: p < 0.05,
    dz: round(dz, 2),
    effect: effectLabel(dz),
  };
}

/* ── 3) 소속(부서)별 차이 — 일원 분산분석 ────────────────── */

export interface AnovaResult extends TestResult {
  kind: 'anova';
  groups: number;
  n: number;
  /** 집단 간 제곱합·평균제곱. 보고서 표에 그대로 싣는다. */
  ssBetween: number | null;
  msBetween: number | null;
  ssWithin: number | null;
  msWithin: number | null;
  f: number | null;
  df1: number | null;
  df2: number | null;
  /** η². 전체 흩어짐 중 소속으로 설명되는 몫. */
  eta2: number | null;
}

export function oneWayAnova(groups: number[][]): AnovaResult {
  const valid = groups.filter((g) => g.length >= 2);
  const k = valid.length;
  const n = valid.reduce((a, g) => a + g.length, 0);

  const base = {
    kind: 'anova' as const,
    groups: k,
    n,
    ssBetween: null as number | null,
    msBetween: null as number | null,
    ssWithin: null as number | null,
    msWithin: null as number | null,
  };
  if (k < 2 || n - k < 1) {
    return {
      ...base,
      usable: false,
      note: '2명 이상인 소속이 둘 이상이어야 비교할 수 있습니다.',
      f: null,
      df1: null,
      df2: null,
      p: null,
      significant: null,
      eta2: null,
    };
  }

  const all = valid.flat();
  const grand = mean(all);
  const ssBetween = valid.reduce((a, g) => a + g.length * (mean(g) - grand) ** 2, 0);
  const ssWithin = valid.reduce((a, g) => a + g.reduce((s, x) => s + (x - mean(g)) ** 2, 0), 0);
  const df1 = k - 1;
  const df2 = n - k;

  if (ssWithin === 0) {
    return {
      ...base,
      usable: false,
      note: '소속 안에서 흩어짐이 없어 검정할 수 없습니다.',
      f: null,
      df1,
      df2,
      p: null,
      significant: null,
      eta2: null,
    };
  }

  const msBetween = ssBetween / df1;
  const msWithin = ssWithin / df2;
  const f = msBetween / msWithin;
  const p = fTailUpper(f, df1, df2);

  return {
    ...base,
    ssBetween: round(ssBetween, 3),
    msBetween: round(msBetween, 3),
    ssWithin: round(ssWithin, 3),
    msWithin: round(msWithin, 3),
    usable: true,
    note: n < 20 ? '전체 인원이 20명 미만입니다. 참고용으로만 읽으세요.' : null,
    f: round(f, 3),
    df1,
    df2,
    p: round(p, 4),
    significant: p < 0.05,
    eta2: round(ssBetween / (ssBetween + ssWithin), 3),
  };
}

/* ── 4) 소속별 다변량 분석 (일원 MANOVA) ─────────────────── */

export interface ManovaResult extends TestResult {
  kind: 'manova';
  groups: number;
  n: number;
  /** 동시에 본 종속변수 수. 우리 경우 역량 네 가지. */
  variables: number;
  /** Wilks' Λ. 0 에 가까울수록 소속 간 차이가 크다. */
  wilks: number | null;
  /** Rao 근사 F. */
  f: number | null;
  df1: number | null;
  df2: number | null;
  /** 각 종속변수를 따로 본 결과. MANOVA 가 유의할 때 어디서 왔는지 본다. */
  perVariable: { name: string; anova: AnovaResult }[];
}

/**
 * 소속별 다변량 분석.
 *
 * 역량 네 가지를 **한꺼번에** 놓고 "소속에 따라 역량 구성이 다른가"를 본다.
 * 네 번 따로 검정하면 우연히 하나가 유의해질 확률이 네 배로 커지고, 역량끼리
 * 서로 얽혀 있다는 사실도 버리게 된다.
 *
 * 다만 **표본이 조금만 작아도 무너진다.** 종속변수가 넷이면 소속마다 최소
 * 다섯 명은 있어야 공분산행렬이 제대로 서고, 그렇지 않으면 행렬식이 0 에
 * 붙어 숫자가 튄다. 그래서 조건을 못 갖추면 계산하지 않고 그 사실을 적어
 * 돌려준다 — 엉뚱한 Λ 를 보여주는 것보다 낫다.
 */
export function manova(
  groups: { name: string; rows: number[][] }[],
  variableNames: string[],
): ManovaResult {
  const p = variableNames.length;
  const valid = groups.filter((g) => g.rows.length >= 2);
  const k = valid.length;
  const n = valid.reduce((a, g) => a + g.rows.length, 0);

  const perVariable = variableNames.map((name, j) => ({
    name,
    anova: oneWayAnova(valid.map((g) => g.rows.map((r) => r[j]))),
  }));

  const base = {
    kind: 'manova' as const,
    groups: k,
    n,
    variables: p,
    perVariable,
  };

  if (k < 2) {
    return {
      ...base,
      usable: false,
      note: '2명 이상인 소속이 둘 이상이어야 비교할 수 있습니다.',
      wilks: null,
      f: null,
      df1: null,
      df2: null,
      p: null,
      significant: null,
    };
  }
  // 오차 자유도가 변수 수보다 작으면 행렬을 세울 수 없다.
  if (n - k < p) {
    return {
      ...base,
      usable: false,
      note: `역량 ${p}가지를 함께 보려면 (전체 인원 − 소속 수)가 ${p} 이상이어야 합니다. 지금은 ${n - k}입니다. 아래 역량별 결과를 대신 보세요.`,
      wilks: null,
      f: null,
      df1: null,
      df2: null,
      p: null,
      significant: null,
    };
  }

  // 전체 평균 벡터
  const all = valid.flatMap((g) => g.rows);
  const grand = Array.from({ length: p }, (_, j) => mean(all.map((r) => r[j])));

  // 집단내(W)·집단간(B) 제곱합 교차곱 행렬
  const W = zeros(p);
  const B = zeros(p);
  for (const g of valid) {
    const gm = Array.from({ length: p }, (_, j) => mean(g.rows.map((r) => r[j])));
    for (const row of g.rows) {
      for (let a = 0; a < p; a++) {
        for (let b = 0; b < p; b++) {
          W[a][b] += (row[a] - gm[a]) * (row[b] - gm[b]);
        }
      }
    }
    for (let a = 0; a < p; a++) {
      for (let b = 0; b < p; b++) {
        B[a][b] += g.rows.length * (gm[a] - grand[a]) * (gm[b] - grand[b]);
      }
    }
  }

  const detW = determinant(W);
  const detT = determinant(add(W, B));

  if (!Number.isFinite(detW) || !Number.isFinite(detT) || detT === 0 || detW <= 0) {
    return {
      ...base,
      usable: false,
      note: '역량 점수가 서로 너무 비슷해 다변량 계산이 서지 않습니다. 아래 역량별 결과를 보세요.',
      wilks: null,
      f: null,
      df1: null,
      df2: null,
      p: null,
      significant: null,
    };
  }

  const lambda = detW / detT;
  const q = k - 1; // 집단 자유도

  /*
    Wilks' Λ 를 F 로 옮긴다 (Rao 근사).

    Λ 는 두 경우에 **근사가 아니라 정확한** F 분포를 따른다.
      · 변수가 하나면       자유도 (k−1, n−k)
      · 집단이 둘이면       자유도 (p,  n−p−1)
    근사식은 이 두 경우에 정확값으로 떨어져야 한다. 그러려면 전체 인원이 아니라
    **오차 자유도(n − k)** 에서 출발해야 한다.
  */
  const ve = n - k; // 오차 자유도
  const m = ve - (p - q + 1) / 2;
  const s = p * p + q * q - 5 > 0 ? Math.sqrt((p * p * q * q - 4) / (p * p + q * q - 5)) : 1;
  const df1 = p * q;
  const df2 = m * s - (p * q - 2) / 2;
  const root = Math.pow(lambda, 1 / s);
  const f = ((1 - root) / root) * (df2 / df1);
  const pValue = fTailUpper(f, df1, df2);

  return {
    ...base,
    usable: true,
    note:
      n < 30
        ? '전체 인원이 30명 미만입니다. 다변량 검정은 표본에 민감하니 참고용으로 읽으세요.'
        : null,
    wilks: round(lambda, 3),
    f: round(f, 2),
    df1: round(df1, 1),
    df2: round(df2, 1),
    p: round(pValue, 4),
    significant: pValue < 0.05,
  };
}

function zeros(n: number): number[][] {
  return Array.from({ length: n }, () => new Array(n).fill(0));
}

function add(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

/** 가우스 소거로 행렬식을 구한다. 우리 행렬은 4×4 라 이걸로 충분하다. */
function determinant(matrix: number[][]): number {
  const n = matrix.length;
  const a = matrix.map((r) => [...r]);
  let det = 1;

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(a[r][i]) > Math.abs(a[pivot][i])) pivot = r;
    }
    if (Math.abs(a[pivot][i]) < 1e-12) return 0;
    if (pivot !== i) {
      [a[i], a[pivot]] = [a[pivot], a[i]];
      det = -det;
    }
    det *= a[i][i];
    for (let r = i + 1; r < n; r++) {
      const factor = a[r][i] / a[i][i];
      for (let c = i; c < n; c++) a[r][c] -= factor * a[i][c];
    }
  }
  return det;
}

/* ── 5) 분포 변화 (χ² 독립성 검정) ───────────────────────── */

export interface ChiSquareResult extends TestResult {
  kind: 'chi2';
  chi2: number | null;
  df: number | null;
  /** Cramér's V. 0~1. 분포가 얼마나 달라졌는지의 크기. */
  v: number | null;
  effect: string | null;
  /** 기대빈도 5 미만 칸의 비율. 20% 를 넘으면 χ² 가정이 흔들린다. */
  smallCells: number;
}

/**
 * 두 분포가 다른가 — 프로필 유형 변화에 쓴다.
 *
 * 사전 6가지 유형의 인원과 사후 6가지 유형의 인원을 2×6 표로 놓고 본다.
 * 모수가 다르므로 인원이 아니라 **비중**이 달라졌는지를 묻는 셈이다.
 */
export function chiSquare(rows: number[][]): ChiSquareResult {
  const nRows = rows.length;
  const nCols = rows[0]?.length ?? 0;
  const total = rows.flat().reduce((a, b) => a + b, 0);

  const base = { kind: 'chi2' as const, smallCells: 0 };
  if (nRows < 2 || nCols < 2 || total === 0) {
    return {
      ...base,
      usable: false,
      note: '비교할 분포가 두 개 이상이어야 합니다.',
      chi2: null,
      df: null,
      p: null,
      significant: null,
      v: null,
      effect: null,
    };
  }

  const rowSums = rows.map((r) => r.reduce((a, b) => a + b, 0));
  const colSums = Array.from({ length: nCols }, (_, j) => rows.reduce((a, r) => a + r[j], 0));

  let chi2 = 0;
  let small = 0;
  let cells = 0;
  for (let i = 0; i < nRows; i++) {
    for (let j = 0; j < nCols; j++) {
      const expected = (rowSums[i] * colSums[j]) / total;
      cells += 1;
      if (expected < 5) small += 1;
      if (expected > 0) chi2 += (rows[i][j] - expected) ** 2 / expected;
    }
  }

  const df = (nRows - 1) * (nCols - 1);
  const p = chiTailUpper(chi2, df);
  const v = Math.sqrt(chi2 / (total * Math.min(nRows - 1, nCols - 1)));
  const smallRatio = small / cells;

  return {
    kind: 'chi2',
    usable: true,
    note:
      smallRatio > 0.2
        ? `기대빈도가 5 미만인 칸이 ${Math.round(smallRatio * 100)}%입니다. 인원이 적어 p 값을 그대로 믿기 어렵습니다.`
        : null,
    chi2: round(chi2, 2),
    df,
    p: round(p, 4),
    significant: p < 0.05,
    v: round(v, 3),
    effect: effectLabel(v * 2),
    smallCells: round(smallRatio, 2),
  };
}
