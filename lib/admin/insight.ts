import { rankByPost, type CompanyReport } from '@/lib/admin/report';
import { levelOf, MIN_GROUP_SIZE, rating, score } from '@/lib/admin/metrics';
import { effectPhrase, pText } from '@/lib/admin/stats';
import type { Recommendation } from '@/lib/admin/recommend';
import { josa, with_ } from '@/lib/admin/josa';

/**
 * 해설 문단.
 *
 * 숫자만 늘어놓으면 기업 담당자가 "그래서 뭐가 좋아진 건가"를 스스로 읽어내야
 * 한다. 기존 리포트가 장마다 「인사이트 요약」을 두는 이유다.
 *
 * **낱개 사실을 나열하지 않는다.** 기존 리포트의 해설은 언제나
 * [무엇이 그렇다] → [그러나/다만 이런 면이 있다] → [따라서 이렇게 하자]
 * 의 세 걸음으로 이어진다. 여기서도 그 모양을 따라 **문단**으로 낸다.
 * 항목을 점으로 찍어 두면 읽는 사람이 다시 엮어야 한다.
 *
 * **지어내지 않는다.** 모든 문장은 보고서 안의 수치에서 곧장 나온다. 조건에
 * 걸릴 때만 그 문장이 나오고, 걸리지 않으면 아예 쓰지 않는다 — "전반적으로
 * 향상되었습니다" 같은, 어떤 자료에도 붙는 말은 넣지 않는다.
 *
 * 표본이 작으면 단정하지 않는다. 보고서는 기업에 나가는 문서다.
 */

const fmt = (v: number | null): string => {
  if (v === null) return '—';
  const r = Math.round(v * 10) / 10;
  return r > 0 ? `+${r}` : `${r}`;
};

const abs = (v: number): string => String(Math.abs(Math.round(v * 10) / 10));

/** 문장 조각을 이어 한 문단으로. 빈 조각은 버린다. */
const para = (...parts: (string | null | undefined | false)[]): string =>
  parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

/** 여러 이름을 "가, 나, 다" 로. */
const list = (names: string[]): string => names.join(', ');

/**
 * 개수를 한글로 센다 — "네 가지", "열두 가지".
 *
 * 문장에 아라비아 숫자를 그대로 넣으면 "4가지 역량이" 처럼 읽힌다.
 * 스무 개가 넘어가면 한글로 세는 것이 오히려 읽기 어려우므로 숫자로 둔다.
 */
const COUNT_ONES = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
const count = (n: number): string => {
  if (n < 1 || n > 20) return `${n}`;
  if (n < 10) return COUNT_ONES[n];
  return n === 10 ? '열' : `열${COUNT_ONES[n - 10]}`;
};

export interface ChapterInsight {
  /** 이어 읽는 문단들. 보통 둘, 많아야 셋. */
  paragraphs: string[];
  /** 기존 리포트처럼 강점·보완을 따로 뽑아 둘 때 쓴다. */
  strength?: string;
  gap?: string;
}

/* ── 교육 개요 ───────────────────────────────────────────── */

/**
 * 회차가 둘 이상인가.
 *
 * 대부분의 기업이 한 회차만 연결한다. 그런데 문구는 여러 회차를 전제하고
 * 쓰여 있어, 회차가 하나일 때 "각 회차가 서로 다른 과정이므로"처럼 사실과
 * 반대인 문장이 나온다. 교육 개요 장의 본문과 해설이 같은 기준으로 갈리도록
 * 그 판단을 여기 모아 둔다.
 *
 * "하나인가"가 아니라 "둘 이상인가"로 묻는다. 회차가 아예 없을 때도
 * "이 과정들"이라고 말하지 않아야 한다.
 *
 * 만족도 장은 이것을 쓰지 않는다. 그쪽은 집계에 들어간 회차 수
 * (`satisfaction.cohorts`)로 가른다 — 만족도를 걷지 않은 회차는 평균에
 * 섞이지 않으므로 세는 대상이 다르다.
 */
export function manyCourses(r: CompanyReport): boolean {
  return r.satisfaction.courses.length > 1;
}

export function courseInsight(r: CompanyReport): ChapterInsight {
  const list_ = r.satisfaction.courses;
  if (list_.length === 0) {
    return { paragraphs: ['연결된 교육 회차가 없습니다.'] };
  }

  const enrolled = list_.reduce((a, c) => a + c.enrolled, 0);
  const answered = list_.reduce((a, c) => a + c.respondents, 0);
  const withDate = list_.filter((c) => c.startDate);
  const first = [...withDate].sort((a, b) => a.startDate!.localeCompare(b.startDate!))[0];
  const last = [...withDate].sort((a, b) => b.startDate!.localeCompare(a.startDate!))[0];

  const p1 = para(
    list_.length === 1
      ? `이 교육에 ${enrolled}명이 수강했습니다.`
      : `모두 ${list_.length}개 회차에 ${enrolled}명이 수강했습니다.`,
    first &&
      last &&
      (first.offeringId === last.offeringId
        ? `교육 기간은 ${first.startDate} ~ ${first.endDate ?? first.startDate}입니다.`
        : `첫 회차는 ${first.startDate}에, 마지막 회차는 ${last.startDate}에 시작했습니다.`),
    answered > 0 && `이 가운데 ${answered}명이 교육 만족도 설문에 응답했습니다.`,
  );

  // 같은 과정이 여러 회차로 열렸는지를 짚는다. 반복 운영은 그 자체로 정보다.
  // 앞머리 "[1기] " 같은 꼬리표를 떼고 견준다 — 떼지 않으면 차수마다 다른 과정이 된다.
  const byTitle = new Map<string, number>();
  for (const c of list_) {
    const key = c.title.replace(/^\[[^\]]*\]\s*/, '').trim();
    byTitle.set(key, (byTitle.get(key) ?? 0) + 1);
  }
  const repeated = [...byTitle].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);

  const p2 = para(
    repeated.length > 0
      ? `${repeated[0][0]} 과정은 ${repeated[0][1]}개 회차로 반복 운영되었습니다. 여러 차수에 걸쳐 같은 내용을 다룬 만큼, 아래의 역량 변화는 특정 회차가 아니라 이 과정 전반의 결과로 읽는 것이 맞습니다.`
      : list_.length > 1 &&
          '각 회차가 서로 다른 과정이므로, 아래의 역량 변화는 특정 과정 하나의 효과가 아니라 이 기간에 받은 교육 전체의 결과입니다.',
  );

  return { paragraphs: [p1, p2].filter(Boolean) };
}

/* ── 03 종합 역량 변화 ───────────────────────────────────── */

export function overallInsight(r: CompanyReport): ChapterInsight {
  const { pre, post, diff, welch, paired } = r.overall;
  if (pre === null || post === null || diff === null) {
    return { paragraphs: ['사전 또는 사후 점수가 없어 변화를 말할 수 없습니다.'] };
  }

  const rose = diff >= 0;
  const preLevel = levelOf(pre);
  const postLevel = levelOf(post);
  const small = welch.n1 < 10 || welch.n2 < 10;

  // 첫 문단 — 무슨 일이 있었나.
  const first = para(
    `종합 역량은 ${score(pre)}점에서 ${score(post)}점으로 ${abs(diff)}점 ${rose ? '올랐습니다' : '내렸습니다'}.`,
    preLevel === postLevel
      ? `등급은 ${postLevel}으로 그대로입니다.`
      : `등급도 ${preLevel}에서 ${postLevel}으로 한 단계 ${rose ? '올라섰습니다' : '낮아졌습니다'}.`,
    welch.usable
      ? welch.significant
        ? `이 차이는 우연으로 보기 어렵고, 차이의 크기도 ${effectPhrase(welch.d ?? 0)}(d = ${welch.d}).`
        : `다만 이 정도 차이는 우연으로 보기 어려울 만큼은 아닙니다(d = ${welch.d}).`
      : '응답이 모자라 통계적으로 검정하지는 못했습니다.',
  );

  // 둘째 문단 — 그런데 이걸 그대로 믿어도 되나.
  const second = para(
    small &&
      `다만 사전 ${welch.n1}명, 사후 ${welch.n2}명으로 어느 한쪽이 10명에 못 미칩니다. 이 변화가 기업 전체의 것인지, 응답한 사람들이 원래 그런 층이었는지는 이 인원만으로는 구분하기 어렵습니다.`,
    paired.usable
      ? para(
          `이름이 이어진 ${paired.n}명만 따로 보면 ${score(paired.meanBefore)}점에서 ${score(paired.meanAfter)}점으로,`,
          paired.down === 0
            ? `${paired.n}명 모두 올랐습니다.`
            : paired.up === 0
              ? `${paired.n}명 모두 내렸습니다.`
              : `${paired.up}명이 오르고 ${paired.down}명이 내렸습니다.`,
          /*
            같은 방향이라도 인원이 적으면 "그대로 읽어도 된다" 고 맺지 않는다.
            핵심 요약과 위 문장에서 이미 "기업 전체로 보기 어렵다" 고 해 놓고
            여기서 뒤집으면, 한 보고서 안에서 말이 엇갈린다.
          */
          welch.significant !== paired.significant
            ? '전체 비교와 결론이 다릅니다. 응답한 사람들이 한쪽으로 쏠렸을 가능성을 먼저 확인해야 합니다.'
            : paired.n < 10
              ? `전체 비교와 같은 방향입니다. 다만 ${paired.n}명뿐이라 방향을 뒷받침하는 정도로만 읽어 주세요.`
              : small || (r.coverage.rate !== null && r.coverage.rate < 50)
                ? '전체 비교와 같은 방향입니다. 다만 응답한 사람이 적어, 기업 전체로 넓혀 읽기는 어렵습니다.'
                : '전체 비교와 같은 방향이라, 결과를 그대로 읽어도 무리가 없습니다.',
        )
      : `이름이 이어진 사람이 ${r.coverage.matchedN}명뿐이라 같은 사람끼리의 비교로는 뒷받침하지 못했습니다.`,
  );

  return { paragraphs: [first, second].filter(Boolean) };
}

/* ── 04 영역별 변화와 격차 ───────────────────────────────── */

export function sectionInsight(r: CompanyReport): ChapterInsight {
  const withDiff = r.sections.filter((s) => s.diff !== null);
  if (withDiff.length === 0) {
    return { paragraphs: ['영역별로 비교할 자료가 없습니다.'] };
  }

  const sorted = [...withDiff].sort((a, b) => b.diff! - a.diff!);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const allDown = sorted.every((s) => s.diff! < 0);
  const allUp = sorted.every((s) => s.diff! > 0);

  const first = para(
    allUp
      ? `세 영역이 모두 올랐습니다. 그중 ${with_(top.label, '이')} ${fmt(top.diff)}점으로 가장 크게, ${with_(bottom.label, '이')} ${fmt(bottom.diff)}점으로 가장 적게 올랐습니다.`
      : allDown
        ? `세 영역이 모두 내렸습니다. ${with_(bottom.label, '이')} ${fmt(bottom.diff)}점으로 가장 크게, ${with_(top.label, '이')} ${fmt(top.diff)}점으로 가장 적게 내렸습니다.`
        : `${with_(top.label, '이')} ${fmt(top.diff)}점으로 오른 반면 ${with_(bottom.label, '은')} ${fmt(bottom.diff)}점으로 내렸습니다.`,
  );

  // 둘째 문단 — 격차가 말하는 것. 이 장의 알맹이다.
  const { sr, sb } = r.gaps;
  const pieces: string[] = [];

  if (sr.post !== null) {
    if (sr.post > 5) {
      pieces.push(
        `자기평가가 상황판단보다 ${abs(sr.post)}점 높습니다. 스스로 매긴 점수만큼 실제 판단이 따라오지 못한다는 뜻으로, 결과를 검토하는 훈련이 먼저 필요합니다.`,
      );
    } else if (sr.post < -5) {
      pieces.push(
        `자기평가가 상황판단보다 ${abs(sr.post)}점 낮습니다. 실제 판단력에 비해 스스로를 낮게 보고 있어, 역량 자체보다 자신감을 높이는 쪽이 급합니다.`,
      );
    } else {
      pieces.push('자기 인식과 실제 판단력이 거의 일치합니다.');
    }
  }

  if (sb.post !== null) {
    // 앞 문장이 "맞물려 있다" 였는지에 따라 이어 붙이는 말이 달라진다.
    // 두 격차는 서로 반대 관계가 아니라서 "반면" 으로 묶으면 어긋난다.
    const prevMatched = sr.post !== null && Math.abs(sr.post) <= 5;
    if (sb.post > 5) {
      pieces.push(
        `${prevMatched ? '다만 ' : ''}상황판단이 행동빈도보다 ${abs(sb.post)}점 높아, 무엇을 해야 하는지는 알지만 실제로는 덜 하고 있습니다. 개념 교육을 반복하기보다 직접 수행하는 실습 중심 과정이 효과적입니다.`,
      );
    } else if (sb.post < -5) {
      pieces.push(
        `${prevMatched ? '다만 ' : ''}행동빈도가 상황판단보다 ${abs(sb.post)}점 높습니다. 이미 사용하고 있으나 판단 기준이 덜 갖춰져 있어, 무엇을 어떻게 검토할지를 세우는 과정이 적절합니다.`,
      );
    } else {
      pieces.push(
        prevMatched
          ? '아는 것과 하는 것도 비슷한 수준입니다.'
          : '아는 것과 하는 것은 비슷한 수준입니다.',
      );
    }
  }

  return { paragraphs: [first, para(...pieces)].filter(Boolean) };
}

/**
 * 영역별 통계 검정 바로 아래의 해설.
 *
 * 표에는 "유의"·"유의하지 않음"과 효과 크기만 찍힌다. 그 뜻을 결과 바로 아래에
 * 적는다 — 앞 쪽 해설에서 미리 말하면 읽는 사람은 표를 보기 전에 결론부터 받고,
 * 표가 있는 쪽은 숫자로만 끝난다.
 */
export function sectionTestInsight(r: CompanyReport): ChapterInsight {
  const tested = r.sections.filter((s) => s.welch.usable);
  if (tested.length === 0) {
    return {
      paragraphs: [
        '응답이 모자라 영역별 검정을 하지 못했습니다. 위 점수는 방향을 보는 데만 참고해 주세요.',
      ],
    };
  }
  const names = (xs: typeof tested) => list(xs.map((s) => s.label));
  const sig = tested.filter((s) => s.welch.significant);
  const not = tested.filter((s) => !s.welch.significant);

  /*
    효과 크기를 함께 읽는다. 인원이 많으면 작은 차이도 유의해지므로, "우연이
    아니다" 와 "차이가 크다" 는 따로 말해야 한다.
  */
  const effects = sig.map((s) => s.welch.effect);
  const solid = effects.every((e) => e === '큼') || effects.every((e) => e === '중간');
  const small = effects.some((e) => e === '작음' || e === '미미');
  const effectLine =
    sig.length === 0
      ? null
      : solid
        ? `효과 크기(d)도 ${list(sig.map((s) => `${s.label} ${s.welch.d}`))}로 ${sig.length > 1 ? '모두 ' : ''}${effects[0] === '큼' ? '큰' : '중간'} 편이라, 변화의 폭 자체도 뚜렷합니다.`
        : `효과 크기(d)는 ${list(sig.map((s) => `${s.label} ${s.welch.d}(${s.welch.effect})`))}입니다.${
            small ? ' 효과 크기가 작은 영역은 유의하더라도 변화의 폭 자체는 크지 않습니다.' : ''
          }`;

  const first = para(
    sig.length === 0
      ? `${tested.length > 1 ? '어느 영역에서도' : `${names(tested)}에서`} 사전과 사후의 차이가 통계적으로 유의하지 않습니다. 점수가 달라 보여도 응시자 구성이나 우연으로 생길 수 있는 폭이라, 변화했다고 단정하기 어렵습니다.`
      : `${not.length === 0 && sig.length > 1 ? `${count(sig.length)} 영역 모두` : `${names(sig)}에서는`} 사전과 사후의 차이가 통계적으로 유의합니다. 우연으로 생긴 차이로 보기 어렵다는 뜻입니다.`,
    effectLine,
    sig.length > 0 && not.length > 0
      ? `${with_(names(not), '은')} 유의하지 않아, 달라 보여도 우연으로 생길 수 있는 폭입니다.`
      : null,
  );

  return {
    paragraphs: [
      first,
      // 사전·사후 응답자 전체를 비교했다는 것은 표 위 설명에 이미 있다.
      '같은 사람끼리 짝지어 본 변화는 다음 쪽의 격차 분석에서 따로 봅니다.',
    ],
  };
}

/**
 * 같은 사람끼리 짝지은 격차 검정 바로 아래의 해설.
 *
 * 거리가 좁혀졌는지는 같은 사람끼리 본다(report.ts 의 gaps 설명). 전체 평균으로
 * 말하면 바로 위 표의 "같은 사람" 숫자와 방향이 어긋날 수 있다 — 전체로는
 * -6.4 → -1.9 로 좁혀졌는데 같은 5명은 3.7 → 9.8 로 벌어진 보고서가 있었다.
 *
 * 격차는 점수와 달리 **줄어드는 것이 좋은** 수라, "유의하다" 가 좋은 소식인지
 * 나쁜 소식인지 그 자리에서 갈리지 않는다. 그래서 어느 쪽으로 움직였는지를
 * 먼저 적고, 검정은 그 움직임을 믿어도 되는지로 읽는다.
 */
export function gapTestInsight(r: CompanyReport): ChapterInsight {
  const { sr, sb } = r.gaps;
  const gaps = [
    { label: '자기평가와 상황판단의 거리', t: sr.paired },
    { label: '상황판단과 행동빈도의 거리', t: sb.paired },
  ].filter((g) => g.t.usable);

  /*
    편차는 있는 그대로만 적는다.

    여기서 "전사 공통 과정으로" 처럼 운영 방식을 권하면, 등급 분포(07장)와
    종합 제언(11장)이 "수준을 나눠 여는 편이 낫다" 고 하는 보고서에서 권고가
    서로 부딪힌다. 운영 방식은 등급 분포를 근거로 한 곳에서만 말한다.

    1점에 못 미치는 차이는 움직였다고 하지 않는다. 0.1점이 늘었다고 "거리가
    벌어졌으므로" 라고 쓴 보고서가 있었다.
  */
  const spread = r.gaps.spread.diff;
  const third =
    spread === null
      ? null
      : Math.abs(spread) < 1
        ? '네 역량 사이의 편차는 교육 전과 거의 같습니다.'
        : spread < 0
          ? `역량 간 편차는 ${abs(spread)}점 줄었습니다. 특정 역량만 오른 것이 아니라 네 역량이 고르게 올랐다는 뜻입니다.`
          : `역량 간 편차가 ${fmt(spread)}점 늘었습니다. 일부 역량이 다른 역량보다 크게 올라, 역량 사이의 차이가 벌어졌다는 뜻입니다.`;

  if (gaps.length === 0) {
    return {
      paragraphs: [
        '사전검사와 이름이 이어진 사람이 모자라 격차의 변화를 검정하지 못했습니다. 위 표의 사전·사후 값은 응답자 전체의 평균이라, 같은 사람 안에서 거리가 좁혀졌는지는 말하기 어렵습니다.',
        third,
      ].filter(Boolean) as string[],
    };
  }

  /*
    어느 쪽으로 움직였는가. 부호가 아니라 0 에서 얼마나 떨어졌는지(거리)로 본다.
    0 을 넘어 부호가 바뀐 경우는 거리만 말하면 "3점에서 4점으로 벌어졌다" 처럼
    읽혀 방향이 뒤집힌 것이 감춰진다. 그때는 부호를 그대로 적는다.
    유의한데 1점 미만이면 "거의 그대로" 라고 하지 않는다 — 바로 뒤 문장과 부딪힌다.
  */
  const moves = gaps.map((g, i) => {
    const { meanBefore: b, meanAfter: a } = g.t;
    const end = i < gaps.length - 1 ? '고,' : '습니다.';
    if (Math.abs(b) >= 1 && Math.abs(a) >= 1 && Math.sign(a) !== Math.sign(b)) {
      return `${with_(g.label, '은')} ${fmt(b)}점에서 ${fmt(a)}점으로 방향이 바뀌었${end}`;
    }
    const verb =
      Math.abs(Math.abs(a) - Math.abs(b)) < 1 && !g.t.significant
        ? '거의 그대로였'
        : Math.abs(a) < Math.abs(b)
          ? '좁혀졌'
          : '벌어졌';
    return `${with_(g.label, '은')} ${abs(b)}점에서 ${abs(a)}점으로 ${verb}${end}`;
  });
  const moved = `이름이 이어진 ${gaps[0].t.n}명만 보면 ${moves.join(' ')}`;

  /*
    두 거리가 같은 결론이면 한 문장으로 묶는다. 따로 쓰면 뒷부분 설명이
    글자 하나 다르지 않게 두 번 나온다.
  */
  const verdict = (g: (typeof gaps)[number]) =>
    g.t.significant
      ? `${with_(g.label, '은')} 통계적으로도 달라졌습니다. 같은 사람의 변화이므로 응답자 구성이 바뀌어 생긴 차이로 보기 어렵습니다.`
      : `${with_(g.label, '은')} 통계적으로 뚜렷하게 달라지지 않았습니다.`;
  const sameVerdict = gaps.every((g) => g.t.significant === gaps[0].t.significant);
  // 하나만 검정했으면 바로 앞 문장이 그 거리를 말했으므로 이름을 되풀이하지 않는다.
  const reading =
    gaps.length === 1
      ? gaps[0].t.significant
        ? '이 변화는 통계적으로도 확인됩니다. 같은 사람의 변화이므로 응답자 구성이 바뀌어 생긴 차이로 보기 어렵습니다.'
        : '이 변화는 통계적으로 뚜렷하지 않아, 교육으로 거리가 달라졌다고 말하기는 어렵습니다.'
      : sameVerdict
        ? gaps[0].t.significant
          ? '두 거리 모두 통계적으로도 달라졌습니다. 같은 사람의 변화이므로 응답자 구성이 바뀌어 생긴 차이로 보기 어렵습니다.'
          : '두 거리 모두 통계적으로 뚜렷하게 달라지지 않았습니다. 위의 움직임은 사람마다 다른 변화의 폭 안에 있어, 교육으로 거리가 좁혀졌거나 벌어졌다고 말하기는 어렵습니다.'
        : gaps.map(verdict).join(' ');

  return { paragraphs: [para(moved, reading), third].filter(Boolean) as string[] };
}

/* ── 05 역량별 변화 ──────────────────────────────────────── */

export function competencyInsight(r: CompanyReport): ChapterInsight {
  const withDiff = r.competencies.filter((c) => c.diff !== null);
  if (withDiff.length === 0) {
    return { paragraphs: ['역량별로 비교할 자료가 없습니다.'] };
  }

  const sorted = [...withDiff].sort((a, b) => b.diff! - a.diff!);
  const up = sorted.filter((c) => c.diff! > 0);
  const down = sorted.filter((c) => c.diff! < 0);
  const allUp = down.length === 0;
  const allDown = up.length === 0;

  // 반올림된 표시값으로 줄 세우면 동점이 생긴다. rankByPost 가 그것을 가른다.
  const highest = [...r.competencies]
    .filter((c) => c.post !== null)
    .sort((a, b) => rankByPost(b) - rankByPost(a))[0];
  const lowest = [...r.competencies]
    .filter((c) => c.post !== null)
    .sort((a, b) => rankByPost(a) - rankByPost(b))[0];

  // 첫 문단 — 무엇이 나왔는가.
  /*
    이 장은 **역량** 네 가지를 다룬다. 바로 앞 장의 "영역"(자기평가·상황판단·
    행동빈도)과 다른 것이므로 같은 낱말을 쓰지 않는다.

    개수도 글자로 박지 않는다 — 점수가 없는 역량은 걸러 내므로 넷이 아닐 수 있다.
  */
  const n = withDiff.length;
  const first = para(
    allUp
      ? `${count(n)} 가지 역량이 모두 올랐습니다.`
      : allDown
        ? `${count(n)} 가지 역량이 모두 내렸습니다. 다만 사전과 사후의 응답자가 같은 사람들이 아니므로, 역량이 떨어졌다고 곧바로 읽기보다 사후에 응답한 사람들이 어떤 층인지 함께 봐야 합니다.`
        : `${with_(list(up.map((c) => c.short)), '은')} 올랐고 ${with_(list(down.map((c) => c.short)), '은')} 내렸습니다. 교육 효과가 역량마다 고르지 않았다는 뜻입니다.`,
    (() => {
      const sig = withDiff.filter((c) => c.welch.usable && c.welch.significant);
      return sig.length === n
        ? `${count(n)} 가지 모두 우연으로 보기 어려운 차이입니다.`
        : sig.length > 0
          ? `이 가운데 ${with_(list(sig.map((c) => c.short)), '은')} 우연으로 보기 어려운 차이입니다.`
          : '다만 어느 역량에서도 우연으로 보기 어려울 만큼의 차이는 나오지 않았습니다.';
    })(),
  );

  // 둘째 문단 — 특히 두드러진 것.
  const top = allDown ? sorted[sorted.length - 1] : sorted[0];
  const runnerUp = sorted[allDown ? sorted.length - 2 : 1];
  const second = para(
    `가장 크게 변화한 것은 ${top.short} 역량입니다. ${score(top.pre)}점에서 ${score(top.post)}점으로 ${abs(top.diff!)}점 ${top.diff! >= 0 ? '올랐습니다' : '내렸습니다'}.`,
    sorted.length > 1 &&
      `${runnerUp.short} 역량도 ${score(runnerUp.pre)}점에서 ${score(runnerUp.post)}점으로 ${abs(runnerUp.diff!)}점 ${runnerUp.diff! >= 0 ? '올랐습니다' : '내렸습니다'}.`,
    // 무엇이 올랐든 같은 말이 붙던 문장이 있었다. 근거 없이 단정하므로 두지 않는다.
  );

  // 셋째 문단 — 하위 역량으로 좁혀서.
  const weakTags = r.tags
    .filter((t) => t.post !== null)
    .sort((a, b) => a.post! - b.post!)
    .slice(0, 3);
  const strongTags = r.tags
    .filter((t) => t.post !== null)
    .sort((a, b) => b.post! - a.post!)
    .slice(0, 3);

  const third = para(
    strongTags.length === 3 &&
      `하위 역량 ${count(r.tags.length)} 가지 가운데 ${with_(list(strongTags.map((t) => t.name)), '이')} 높은 편입니다.`,
    // 앞 문장이 빠지면 "반면" 으로 문단이 시작한다.
    weakTags.length === 3 &&
      `${strongTags.length === 3 ? '반면 ' : ''}${with_(list(weakTags.map((t) => t.name)), '은')} 보완이 필요합니다.`,
    lowest &&
      weakTags[0] &&
      `다음 교육은 ${lowest.short} 역량, 그중에서도 ${with_(weakTags[0].name, '을')} 중심으로 잡는 편이 낫습니다.`,
  );

  // 넷째 문단 — 종합. 예시의 "종합하면, …" 자리.
  const split = r.competencies.filter(
    (c) => c.welch.usable && c.paired.usable && c.welch.significant !== c.paired.significant,
  );
  /*
    모두 올랐을 때도 높은·낮은 역량을 적는다. 예전에는 이 경우 고정 문구가
    나가서, 잘된 회차일수록 다음에 무엇을 할지가 빠졌다.
  */
  const fourth = para(
    `지금 가장 높은 역량은 ${highest.short}(${score(highest.post)}점, ${levelOf(highest.post)}), 가장 낮은 역량은 ${lowest.short}(${score(lowest.post)}점, ${levelOf(lowest.post)})입니다.`,
    allUp
      ? `${lowest.short} 역량도 오르기는 했으므로, 다음 교육은 거기에 초점을 두되 지금 방식을 크게 바꾸지 않아도 됩니다.`
      : `다음 교육의 목표를 ${lowest.short} 역량에 두고, 이미 높아진 ${highest.short} 역량을 갖춘 인원을 사내 조력자로 세우는 편이 낫습니다.`,
    split.length > 0 &&
      `다만 ${with_(list(split.map((c) => c.short)), '은')} 전체 비교와 같은 사람끼리의 비교에서 결론이 다릅니다. 이 수치를 인용하기 전에 응답자 구성을 확인해 주세요.`,
  );

  return {
    paragraphs: [first, second, third, fourth].filter(Boolean) as string[],
    strength: highest
      ? `${highest.short} 역량 ${score(highest.post)}점(${levelOf(highest.post)})`
      : undefined,
    gap: lowest
      ? `${lowest.short} 역량 ${score(lowest.post)}점(${levelOf(lowest.post)})`
      : undefined,
  };
}

/* ── 06 등급 분포 ────────────────────────────────────────── */

const RANKS = ['입문', '초급', '중급', '고급'];
const rank = (level: string): number => RANKS.indexOf(level);

/**
 * 등급 하나에 대한 해설.
 *
 * 기존 리포트가 역량마다 한 문단씩 붙이는 그 자리다 — "이해 영역의 대표
 * 등급은 초급으로, 구성원 대다수가 기초적인 이해를 가지고 있으나…".
 */
export function levelRowInsight(l: CompanyReport['levels'][number]): string {
  if (l.postN === 0) return '사후 응답이 없어 분포를 낼 수 없습니다.';

  const share = (d: Record<string, number>, n: number, keys: string[]) =>
    n === 0 ? 0 : Math.round((keys.reduce((a, k) => a + d[k], 0) / n) * 100);

  const postLow = share(l.post, l.postN, ['입문', '초급']);
  const postHigh = share(l.post, l.postN, ['중급', '고급']);
  const preHigh = share(l.pre, l.preN, ['중급', '고급']);

  // "대표 등급" 은 가장 많은 사람이 속한 등급이다. 평균 점수로 정한 등급과 다를 수 있어 처음에 밝힌다.
  const moved =
    l.preMode && l.postMode && l.preMode !== l.postMode
      ? rank(l.postMode) > rank(l.preMode)
        ? `가장 많은 사람이 속한 등급(대표 등급)이 ${l.preMode}에서 ${l.postMode}으로 올라갔습니다.`
        : `가장 많은 사람이 속한 등급(대표 등급)이 ${l.preMode}에서 ${l.postMode}으로 내려갔습니다.`
      : `가장 많은 사람이 속한 등급(대표 등급)은 ${l.postMode ?? '—'}으로 그대로입니다.`;

  const body =
    postLow >= 80
      ? `구성원 ${postLow}%가 입문·초급에 몰려 있어, 아직 기초 단계를 벗어나지 못한 상태입니다. 수준을 나누기보다 공통 과정으로 기초를 함께 올리는 편이 낫습니다.`
      : postHigh >= 50
        ? `중급 이상이 ${postHigh}%로 절반을 넘습니다. 공통 교육보다 직무별·주제별 심화로 나누어 운영할 수 있는 단계입니다.`
        : `입문·초급이 ${postLow}%, 중급 이상이 ${postHigh}%로 나뉘어 있습니다. 한 과정으로 묶으면 한쪽이 지루하거나 따라오지 못하므로, 수준을 나눠 여는 편이 낫습니다.`;

  const shift =
    postHigh > preHigh
      ? `사전의 중급 이상 ${preHigh}%에서 ${postHigh}%로 위쪽 등급의 비중이 늘었습니다.`
      : postHigh < preHigh
        ? `사전의 중급 이상 ${preHigh}%에서 ${postHigh}%로 위쪽 등급의 비중이 줄었습니다. 사후에 응답한 사람들이 사전과 다른 층일 가능성을 함께 봐야 합니다.`
        : `중급 이상의 비중은 사전과 같은 ${postHigh}%입니다.`;

  return para(moved, body, shift);
}

export function levelInsight(r: CompanyReport): ChapterInsight {
  const overall = r.levels.find((l) => l.name === '종합');
  if (!overall || overall.postN === 0) {
    return { paragraphs: ['등급을 나눌 응답이 없습니다.'] };
  }

  const risen = r.levels
    .filter((l) => l.name !== '종합' && l.preMode && l.postMode)
    .filter((l) => rank(l.postMode!) > rank(l.preMode!));
  const fallen = r.levels
    .filter((l) => l.name !== '종합' && l.preMode && l.postMode)
    .filter((l) => rank(l.postMode!) < rank(l.preMode!));

  const first = levelRowInsight(overall);

  /*
    핵심 요약의 사후 등급은 평균 점수로 정하고, 여기의 대표 등급은 사람 수로
    센다. 둘이 다르면 "요약은 중급인데 여기는 고급" 으로 읽혀 어느 쪽이 맞는지
    묻게 된다 — 응답이 적은 기업에서 실제로 갈렸다.
  */
  const meanLevel = levelOf(r.overall.post);
  const modeNote =
    meanLevel && overall.postMode && meanLevel !== overall.postMode
      ? `핵심 요약의 사후 등급(${meanLevel})은 평균 점수로 정한 것이라, 사람 수로 센 대표 등급과 다릅니다.`
      : null;

  const second = para(
    modeNote,
    risen.length > 0 &&
      `역량별로는 ${list(
        risen.map((l) => `${l.name}(${l.preMode}→${l.postMode})`),
      )}에서 대표 등급이 올라갔습니다.`,
    fallen.length > 0 &&
      `${risen.length > 0 ? '반대로' : '역량별로는'} ${list(
        fallen.map((l) => `${l.name}(${l.preMode}→${l.postMode})`),
      )}에서 대표 등급이 내려갔습니다.`,
    risen.length === 0 &&
      fallen.length === 0 &&
      '역량별 대표 등급은 사전과 같습니다. 평균 점수는 변했지만 등급이 나뉘는 기준선을 넘지는 못했습니다.',
  );

  return { paragraphs: [first, second].filter(Boolean) };
}

/* ── 07 소속별 차이 ──────────────────────────────────────── */

/*
  소속 차이 장의 해설은 결과가 나온 지면마다 그 바로 아래에 붙는다.
  MANOVA(첫 쪽) → 역량별 분산분석·변화량 검정(둘째 쪽) → 소속별 평균(셋째 쪽).
  한곳에 모아 두면 결과만 있고 설명이 없는 쪽이 생긴다.

  "뚜렷하지 않다" 를 "차이가 없다" 로 읽으면 안 된다. 유의하지 않다는 것은
  차이가 없다는 증명이 아니라, 모인 응답만으로는 차이를 말할 근거가 모자란다는
  뜻이다. 부서당 인원이 적으면 실제로 차이가 있어도 검정이 잡아내지 못한다.

  그러면서도 모든 소속이 함께 올랐다면 그것은 그대로 말한다. 차이가 없다는
  결과와 함께 읽으면 "효과가 몇몇 부서에 치우치지 않았다" 는 뜻이 된다.
*/

/** 사전·사후 점수가 모두 있는 소속. */
const deptWithBoth = (r: CompanyReport) => r.department.rows.filter((d) => d.diff !== null);

/** 사전·사후 점수가 모두 있는 소속이 둘 이상이고 빠짐없이 올랐는가. */
const allDeptsRose = (r: CompanyReport): boolean => {
  const both = deptWithBoth(r);
  return both.length >= 2 && both.every((d) => d.diff! > 0);
};

/** "p = .074" · "p < .001". pText 는 표 칸에 쓰는 것이라 "p = < .001" 이 되지 않게 한다. */
const pIs = (p: number | null): string =>
  p !== null && p < 0.001 ? 'p < .001' : `p = ${pText(p)}`;

/** 사후 응답이 MIN_GROUP_SIZE 명에 못 미치는 소속 수. */
const thinDepts = (r: CompanyReport): number =>
  r.department.rows.filter((d) => d.postN > 0 && d.postN < MIN_GROUP_SIZE).length;

/** 소속 차이 장 첫 쪽 — 다변량 분석 결과 바로 아래. */
export function manovaInsight(r: CompanyReport): ChapterInsight {
  const m = r.department.manovaPost;
  if (!m.usable) {
    return {
      paragraphs: [
        `소속 차이 다변량 분석은 실시하지 못했습니다. ${m.note ?? ''}`.trim(),
        r.department.rows.length > 1
          ? '소속별 평균은 뒤 쪽 표에서 볼 수 있습니다. 다만 통계적인 비교 없이 평균만 나란히 둔 것이라, 소속 간 차이의 근거로 쓰기는 어렵습니다.'
          : '사후 응답이 한 소속에서만 들어와 소속끼리 비교할 수 없습니다.',
      ],
    };
  }

  const thin = thinDepts(r);
  return {
    paragraphs: [
      `네 역량을 한꺼번에 놓고 소속에 따라 차이가 있는지 본 결과입니다. Wilks' Λ = ${m.wilks}, F = ${m.f}, ${pIs(m.p)}.`,
      m.significant
        ? '소속에 따라 역량 구성이 다르다고 볼 만합니다. 같은 교육을 받아도 소속마다 결과가 달랐다는 뜻입니다. 어느 역량에서 차이가 나는지는 다음 쪽에서 하나씩 봅니다.'
        : para(
            '교육을 마친 뒤 소속에 따른 역량 수준의 차이는 통계적으로 뚜렷하지 않습니다. 특정 소속이 두드러지게 앞서거나 뒤처졌다고 볼 근거가 없어, 소속과 관계없이 대체로 비슷한 수준이라고 읽을 수 있습니다.',
            thin > 0 &&
              `다만 응답이 ${MIN_GROUP_SIZE}명에 못 미치는 소속이 ${thin}곳이라, 작은 차이까지 없다고 단정할 수는 없습니다.`,
            '역량별 결과는 다음 쪽에서 봅니다.',
          ),
    ],
  };
}

/** 소속 차이 장 둘째 쪽 — 역량별 분산분석과 변화량 검정 바로 아래. */
export function departmentTestInsight(r: CompanyReport): ChapterInsight {
  const m = r.department.manovaPost;
  const change = r.department.changeAnova;
  const tested = m.perVariable.filter((v) => v.anova.usable);
  const sigVars = tested.filter((v) => v.anova.significant);
  // η² 0.14 이상은 "큼" 이다. 유의하지 않은데 큰 것은 인원이 모자라 못 잡은 쪽에 가깝다.
  const bigEta = tested.filter((v) => !v.anova.significant && (v.anova.eta2 ?? 0) >= 0.14);
  const thin = thinDepts(r);

  const first =
    tested.length === 0
      ? '역량을 하나씩 나누어 볼 만큼 응답이 모이지 않았습니다.'
      : para(
          sigVars.length > 0
            ? `역량을 하나씩 보면 ${list(sigVars.map((v) => `${v.name}(η² ${v.anova.eta2})`))}에서 소속에 따른 차이가 통계적으로 유의합니다.${
                m.usable && !m.significant
                  ? ' 네 역량을 묶어서는 뚜렷하지 않았지만, 이 역량에서는 소속 사이의 차이가 드러난다는 뜻입니다.'
                  : ''
              }`
            : `역량을 하나씩 나누어 봐도 소속에 따라 통계적으로 유의한 차이가 나는 역량은 없습니다.${
                m.usable && m.significant
                  ? ' 차이는 특정 역량보다 네 역량의 전체 구성에서 옵니다.'
                  : ''
              }`,
          sigVars.length === 0 &&
            bigEta.length > 0 &&
            thin > 0 &&
            `다만 ${list(bigEta.map((v) => `${v.name}(${v.anova.eta2})`))}${josa(bigEta[bigEta.length - 1].name, '은')} η² 가 0.14 를 넘어, 소속으로 설명되는 몫이 작지 않습니다. 소속마다 인원이 적어 검정이 이를 확인하지 못한 것일 수 있습니다.`,
        );

  const allRose = allDeptsRose(r);
  const noBasis = !(m.usable && m.significant) && sigVars.length === 0;
  // 내린 소속이 있으면 "오른 폭" 이라고 하지 않는다.
  const moved = allRose ? '오른 폭' : '달라진 폭';
  const second = !change.usable
    ? `사전에서 사후로 ${with_(moved, '을')} 소속끼리 비교하기에는 같은 사람으로 이어진 응답이 모자랍니다.`
    : change.significant
      ? `사전에서 사후로 ${with_(moved, '은')} 소속에 따라 다릅니다(${pIs(change.p)}). 소속마다 얼마나 달라졌는지는 다음 쪽 표에서 봅니다.`
      : para(
          `사전에서 사후로 ${moved}도 소속에 따라 다르다고 볼 근거가 없습니다(${pIs(change.p)}).`,
          allRose
            ? `사전·사후 점수가 모두 있는 소속 ${deptWithBoth(r).length}곳이 빠짐없이 올랐으므로, 교육의 효과가 몇몇 소속에 치우치지 않고 조직 전반에 고르게 나타났다고 볼 수 있습니다.`
            : null,
          noBasis &&
            '소속별로 교육을 다르게 설계할 근거는 아직 없으므로, 후속 과정은 소속보다 역량 수준이나 프로필 유형으로 나누는 편이 낫습니다.',
        );

  return { paragraphs: [first, second] };
}

/** 소속 차이 장 셋째 쪽 — 소속별 평균 표 바로 아래. */
export function departmentInsight(r: CompanyReport): ChapterInsight {
  const both = deptWithBoth(r);
  const allRose = allDeptsRose(r);
  const change = r.department.changeAnova;

  /*
    가장 많이 오른 곳과 가장 적게 오른 곳은 응답이 MIN_GROUP_SIZE 명 이상인
    소속끼리만 견준다. 한 사람뿐인 소속이 맨 끝에 오면 그 사람의 점수가 곧
    "부서 차이" 가 된다 — 실제로 1명 소속을 들어 "12점 벌어졌다" 고 쓴 보고서가
    있었다.
  */
  const solid = both.filter((d) => d.postN >= MIN_GROUP_SIZE);
  const sorted = [...solid].sort((a, b) => b.diff! - a.diff!);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const spread = solid.length >= 2 ? Math.abs(best.diff! - worst.diff!) : null;

  const diffs = both.map((d) => d.diff!);
  const lead = allRose
    ? `사전과 사후 점수가 모두 있는 ${both.length}곳은 ${fmt(Math.min(...diffs))}~${fmt(Math.max(...diffs))}점으로 모두 올랐습니다.`
    : null;

  const compare =
    spread !== null
      ? `응답이 ${MIN_GROUP_SIZE}명 이상인 소속만 비교하면 ${with_(best.name, '이')} ${fmt(best.diff)}점, ${with_(worst.name, '이')} ${fmt(worst.diff)}점으로 ${abs(spread)}점 차이가 납니다.`
      : both.length >= 2
        ? `응답이 ${MIN_GROUP_SIZE}명 이상인 소속이 ${solid.length === 0 ? '없어' : '한 곳뿐이라'} 소속끼리 변화를 비교하기는 어렵습니다. 표의 변화는 몇 사람의 점수에 크게 흔들리는 값입니다.`
        : null;

  const verdict =
    spread === null || !change.usable
      ? null
      : change.significant
        ? spread > 10
          ? '통계적으로도 소속에 따라 변화의 폭이 달라, 다음 회차에는 소속마다 목표와 과제를 따로 잡는 편이 낫습니다.'
          : '통계적으로도 소속에 따라 변화의 폭이 다릅니다.'
        : allRose
          ? '이 차이는 앞 쪽 검정에서 통계적으로 확인되지 않았으므로, 소속 사이의 우열보다 모든 소속이 함께 올랐다는 점에 무게를 두어 읽는 편이 좋습니다.'
          : '다만 이 차이는 앞 쪽 검정에서 통계적으로 확인되지 않았으므로, 이를 근거로 소속별 과정을 따로 설계하기보다 사람 수가 쌓인 뒤에 다시 보는 편이 안전합니다.';

  const text = para(lead, compare, verdict);
  return { paragraphs: text ? [text] : [] };
}

/* ── 프로필 이동의 방향 ──────────────────────────────────── */

/**
 * 유형마다 늘어야 하는 쪽인가, 줄어야 하는 쪽인가.
 *
 * 프로필 유형 정의 문서의 「프로필 유형별 우선 교육 권장 방향」을 그대로
 * 옮긴 것이다. 비중이 오르내린 것만 적으면 그것이 잘된 일인지 아닌지를
 * 읽는 사람이 판단해야 한다. AX 전환 교육이 바라는 자리는 **균형형**이고,
 * 과신형과 조심형은 줄어야 하는 쪽이다.
 *
 * 이해형은 한쪽으로 몰아 말하지 않는다. 개념은 잡혔으나 아직 실행으로
 * 넘어가지 못한 중간 단계라, 늘어도 줄어도 그 자체로 좋고 나쁨이 갈리지
 * 않는다.
 */
const PROFILE_GOAL: Record<string, { want: 'up' | 'down' | 'hold'; reason: string }> = {
  BALANCED: {
    want: 'up',
    reason: '판단과 실행이 함께 안정되어 교육이 최종적으로 지향하는 유형입니다.',
  },
  DOER: {
    want: 'up',
    reason: '업무 적용 전환이 빨라 조직 내 선도 사례를 형성할 수 있는 유형입니다.',
  },
  ANALYST: {
    want: 'up',
    reason: '판단 기준과 위험 인식을 갖추어 운영 원칙 수립에 적합한 유형입니다.',
  },
  LEARNER: {
    want: 'hold',
    reason: '개념 이해는 갖추었으나 업무 적용으로 이어지지 않은 중간 단계입니다.',
  },
  OVERCONFIDENT: {
    want: 'down',
    reason: '검증보다 확신이 앞서 잘못된 활용이 조직 내로 확산될 위험이 있는 유형입니다.',
  },
  CAUTIOUS: {
    want: 'down',
    reason: '활용 자체의 진입 장벽이 높아 실제 사용으로 이어지지 않는 유형입니다.',
  },
};

/* ── 08 프로필 유형 변화 ─────────────────────────────────── */

export function profileInsight(r: CompanyReport): ChapterInsight {
  const rows = r.profile.rows;
  if (rows.length === 0) return { paragraphs: ['프로필 유형을 낼 응답이 없습니다.'] };

  const grew = rows.filter((p) => p.diff > 0).sort((a, b) => b.diff - a.diff);
  const shrank = rows.filter((p) => p.diff < 0).sort((a, b) => a.diff - b.diff);
  const topPost = [...rows].sort((a, b) => b.postShare - a.postShare)[0];

  // 한쪽만 있으면 "늘었고," 로 문단이 끊긴다. 있는 쪽만으로 문장을 맺는다.
  const grewText = list(grew.slice(0, 2).map((p) => `${p.name}(${fmt(p.diff)}%p)`));
  const shrankText = list(shrank.slice(0, 2).map((p) => `${p.name}(${fmt(p.diff)}%p)`));
  const first = para(
    `사후 기준으로 ${with_(topPost.name, '이')} ${topPost.postShare}%로 가장 많습니다.`,
    grew.length > 0 && shrank.length > 0
      ? `${grewText} 비중이 늘었고, ${shrankText} 비중은 줄었습니다.`
      : grew.length > 0
        ? `${grewText} 비중이 늘었습니다.`
        : shrank.length > 0
          ? `${shrankText} 비중이 줄었습니다.`
          : null,
  );

  const chi = r.profile.chi2;
  const second = para(
    chi.usable
      ? chi.significant
        ? `분포가 달라진 정도는 우연으로 보기 어렵습니다(χ² = ${chi.chi2}, Cramér's V = ${chi.v}). 사람들이 실제로 다른 유형으로 옮겨 갔다는 뜻입니다.`
        : `다만 분포가 달라진 정도는 우연으로 보기 어려울 만큼은 아닙니다(χ² = ${chi.chi2}). 유형 구성이 그대로라는 뜻은 아니며, 여섯 유형으로 나누면 칸마다 인원이 적어져 웬만한 변화로는 뚜렷하게 잡히지 않습니다. 아래의 개인별 이동을 함께 보아 주세요.`
      : '분포 변화를 통계적으로 검정하기에는 응답이 모자랍니다.',
    // chi.note 는 검정 결과 상자 아래에 따로 찍힌다. 여기서 또 붙이면 같은 말이
    // 한 지면에 두 번 나오고, 위 문장이 이미 같은 사정을 풀어 쓰고 있다.
    r.profile.moved + r.profile.stayed > 0
      ? `이름이 이어진 ${r.profile.moved + r.profile.stayed}명 중 ${r.profile.moved}명의 유형이 바뀌었습니다.`
      : null,
  );

  /*
    바라던 방향으로 움직였는가.

    비중이 오르내린 것만 적으면 그것이 잘된 일인지 아닌지를 읽는 사람이
    판단해야 한다. 교육이 향하는 자리가 정해져 있으므로, 어느 쪽으로
    움직였어야 했는지를 함께 적는다.
  */
  const moved = rows
    .filter((x) => Math.abs(x.diff) >= 1)
    .map((x) => {
      const goal = PROFILE_GOAL[x.id];
      if (!goal || goal.want === 'hold') return null;
      // 균형형은 문단 끝에서 따로 짚는다.
      if (x.id === 'BALANCED') return null;
      const good = goal.want === 'up' ? x.diff > 0 : x.diff < 0;
      return { ...x, goal, good };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const good = moved.filter((x) => x.good);
  const bad = moved.filter((x) => !x.good);

  const balanced = rows.find((x) => x.id === 'BALANCED');

  const direction = para(
    good.length > 0
      ? `교육이 의도한 방향으로 이동한 유형은 ${list(
          good.map((x) => `${x.name} ${fmt(x.diff)}%p`),
        )}입니다. ${with_(good[0].name, '은')} ${good[0].goal.reason}`
      : '교육이 의도한 방향으로 뚜렷하게 이동한 유형은 확인되지 않았습니다.',
    bad.length > 0
      ? `반면 ${list(
          bad.map(
            (x) =>
              `${x.name}(${x.goal.want === 'down' ? '줄어야' : '늘어야'} 하는데 ${fmt(x.diff)}%p)`,
          ),
        )} 유형은 바라던 것과 반대로 이동했습니다. ${with_(bad[0].name, '은')} ${bad[0].goal.reason}`
      : null,
    balanced === undefined
      ? null
      : balanced.diff > 0
        ? `교육이 최종적으로 지향하는 균형형은 ${fmt(balanced.diff)}%p 늘어 ${balanced.postShare}%가 되었습니다. 판단과 실행이 함께 안정된 사람이 늘었다는 뜻이라, 다음 과정에서 사내 확산을 맡길 후보로 먼저 볼 수 있습니다.`
        : `다만 교육이 최종적으로 지향하는 균형형은 늘지 않았습니다(${fmt(balanced.diff)}%p, 지금 ${balanced.postShare}%). 판단과 실행 중 한쪽만 올라온 것이므로, 다음 과정은 덜 오른 쪽을 중심으로 짜는 편이 낫습니다.`,
  );

  // 유형이 말하는 처방. 이 장이 실제로 쓸모 있으려면 여기까지 가야 한다.
  const advice =
    topPost.id === 'OVERCONFIDENT'
      ? '과신형이 많다는 것은 결과물을 검증하지 않고 받아들이는 사람이 많다는 뜻입니다. 검증 절차와 품질 기준을 다루는 과정을 먼저 넣는 편이 낫습니다.'
      : topPost.id === 'CAUTIOUS'
        ? '조심형이 많다는 것은 쓰는 방법은 알지만 실제로 사용하지 못한 사람이 많다는 뜻입니다. 작은 과제를 직접 해 보는 실습형 과정이 적절합니다.'
        : topPost.id === 'LEARNER'
          ? '이해형이 많다는 것은 개념은 잡혔지만 업무로 넘어가지 못했다는 뜻입니다. 담당 업무를 그대로 과제로 다루는 적용형 과정이 적절합니다.'
          : topPost.id === 'DOER'
            ? '실행형이 많다는 것은 이미 업무에 쓰고 있다는 뜻입니다. 검증 기준과 운영 규칙을 세우는 과정으로 이어 가면 됩니다.'
            : topPost.id === 'ANALYST'
              ? '판단형이 많다는 것은 판단하는 힘은 있으나 실제로 쓰는 일이 적다는 뜻입니다. 도구를 직접 써 보는 실습 중심 과정이 적절합니다.'
              : `${with_(topPost.name, '이')} 가장 많습니다. 특정 역량을 보완하기보다 한 단계 어려운 과정으로 이어 갈 수 있습니다.`;

  return { paragraphs: [first, second, direction, advice].filter(Boolean) };
}

/* ── 09 교육 만족도 ──────────────────────────────────────── */

/**
 * 만족도 해설 가운데 **지표 수치만으로 쓰는** 부분.
 *
 * 합계와 회차별이 같은 규칙을 쓰게 한다. 전체 만족도, 가장 높은·낮은 지표,
 * 먼저 손볼 곳, 후속 과정을 붙일 만한지까지다.
 */
export function satisfactionMetricsInsight({
  metrics,
  overall,
  respondents,
  cohorts,
}: {
  metrics: CompanyReport['satisfaction']['metrics'];
  overall: number | null;
  respondents: number;
  /** 몇 개 회차를 합친 것인가. 1 이면 회차 수를 적지 않는다. */
  cohorts: number;
}): string[] {
  if (metrics.length === 0) {
    return ['수집된 만족도 응답이 없습니다.'];
  }

  const sorted = metrics.filter((m) => m.mean !== null).sort((a, b) => b.mean! - a.mean!);
  if (sorted.length === 0) {
    return ['수집된 만족도 응답이 없습니다.'];
  }

  const best = sorted[0];
  const lowest = sorted[sorted.length - 1];

  /*
    먼저 손볼 지표.

    모든 지표가 같은 값이면 없다고 본다. 5·5·5·5·5·5 인데 그중 하나를
    "보완할 자리"로 짚으면, 흠잡을 데 없는 회차에 억지로 흠을 만드는 셈이다.
    기업에 나가는 문서라 더 그렇다.
  */
  const worst = lowest.mean === best.mean ? null : lowest;

  const first = para(
    overall !== null &&
      (cohorts === 1
        ? `응답한 ${respondents}명의 전체 만족도는 ${rating(overall)}점입니다.`
        : `${cohorts}개 회차 ${respondents}명의 전체 만족도는 ${rating(overall)}점입니다.`),
    worst !== null
      ? `지표 중에서는 ${with_(best.label, '이')} ${rating(best.mean)}점으로 가장 높고 ${with_(worst.label, '이')} ${rating(worst.mean)}점으로 가장 낮아, 둘 사이가 ${rating(Math.abs(best.mean! - worst.mean!))}점 벌어져 있습니다.`
      : `여섯 개 지표가 모두 ${rating(best.mean)}점으로 같아, 특별히 낮은 지표가 없습니다.`,
  );

  const second = para(
    worst === null
      ? '별도로 보완이 필요한 지표가 확인되지 않은 회차입니다. 현재의 운영 방식을 유지한 상태로 후속 과정을 연계할 수 있습니다.'
      : worst.label.includes('현업')
        ? '교육 자체에 대한 평가에 비해 현업 적용 항목이 낮게 나타났습니다. 강의 내용의 문제라기보다 학습한 내용을 담당 업무로 연결하는 과정이 부족했던 것으로 해석되므로, 후속 과정은 담당 업무를 직접 과제로 다루는 실습형이 적절합니다.'
        : worst.label.includes('실습')
          ? '실습에 대한 평가가 상대적으로 낮습니다. 다음 회차에는 실습 시간을 늘리거나 예제를 현업 자료로 바꾸는 것을 검토해 주세요.'
          : `${with_(worst.label, '은')} 다음 회차에서 우선 보완이 필요한 항목입니다.`,
    overall !== null && overall >= 4.5
      ? '전반적인 만족도가 높아 후속 과정을 연계하기에 적합한 상태입니다.'
      : overall !== null && overall < 4
        ? '전반적인 만족도가 높지 않아, 후속 과정을 편성하기에 앞서 이번 회차의 보완 사항을 먼저 확인할 필요가 있습니다.'
        : null,
  );

  return [first, second].filter(Boolean) as string[];
}

export function satisfactionInsight(r: CompanyReport): ChapterInsight {
  const base = satisfactionMetricsInsight(r.satisfaction);
  if (base.length === 1 && base[0] === '수집된 만족도 응답이 없습니다.') {
    return { paragraphs: base };
  }
  const overall = r.satisfaction.overall;
  /*
    만족도와 역량 변화는 다른 것을 잰다.

    만족도는 교육을 어떻게 받아들였는지에 대한 응답이고, 역량 변화는 실제로
    무엇이 달라졌는지에 대한 측정이다. 둘은 함께 움직이기도 하고 어긋나기도
    한다. 만족도만 높은 회차를 성공으로 읽으면 다음 과정을 잘못 고르게 되고,
    반대로 만족도가 낮다고 해서 배운 것이 없다고 볼 수도 없다.

    그래서 이 보고서는 둘을 따로 재어 나란히 싣는다. 여기서는 이번 회차에서
    둘이 어떻게 나왔는지를 이어 붙여 준다.
  */
  const paired = r.overall.paired;
  const high = overall !== null && overall >= 4.5;
  /*
    만족도 응답자, 사후 응답자, 이름이 이어진 사람은 서로 다른 무리다. 그래서
    여기서 말하는 변화는 두 검사에 모두 응한 사람의 것으로 적고, 숫자도 그
    사람들의 평균 변화를 쓴다(전체 대 전체 차이가 아니다). "올랐다" 고 말할지도
    같은 숫자로 고른다 — 다른 숫자로 고르면 "−3점 올랐습니다" 가 나올 수 있다.
  */
  const pairedDiff = Math.round((paired.meanAfter - paired.meanBefore) * 10) / 10;
  const grew = paired.usable && paired.significant === true && pairedDiff > 0;

  const third = para(
    '만족도는 교육을 어떻게 받아들였는지에 대한 응답이고, 뒤에서 다루는 역량 변화는 실제로 무엇이 달라졌는지에 대한 측정입니다. 두 가지는 같은 방향으로 나타나기도 하고 어긋나기도 하므로, 만족도가 높다는 사실만으로 역량이 향상되었다고 판단하지 않습니다.',
    !paired.usable
      ? '이번 회차는 사전·사후검사에 모두 응한 사람이 적어 전후 비교가 성립하지 않아, 만족도와 역량 변화를 비교하기 어렵습니다.'
      : high && grew
        ? `이번 회차는 만족도가 ${overall}점으로 높고, 두 검사에 모두 응한 ${paired.n}명의 종합 역량도 ${fmt(pairedDiff)}점 올랐습니다. ${
            paired.n < 10
              ? '다만 인원이 적어 방향을 확인하는 정도로 읽어 주세요. '
              : '이 변화는 통계적으로도 확인됩니다. '
          }교육에 대한 평가와 실제 역량 변화가 같은 방향으로 나타난 경우로, 후속 과정을 연계하기에 적합한 상태입니다.`
        : high && !grew
          ? `이번 회차는 만족도가 ${overall}점으로 높은 반면, 두 검사에 모두 응한 사람들의 종합 역량 변화는 통계적으로 뚜렷하지 않습니다. 교육에 대한 평가가 곧 역량 향상을 의미하지는 않으므로, 후속 과정은 만족도보다 아래의 역량별 결과를 근거로 설계하는 것이 적절합니다.`
          : !high && grew
            ? `이번 회차는 만족도가 ${rating(overall)}점으로 높지 않은데, 두 검사에 모두 응한 사람들의 종합 역량은 ${fmt(pairedDiff)}점 올랐습니다. 난도나 진행 방식에는 부담이 있었으나 배움 자체는 일어난 것이므로, 내용보다 운영 방식을 보완하는 편이 낫습니다.`
            : '이번 회차는 만족도와 역량 변화 모두 뚜렷하게 나타나지 않았습니다. 과정 내용과 운영 방식을 함께 점검할 필요가 있습니다.',
  );

  return { paragraphs: [...base, third].filter(Boolean) as string[] };
}

/* ── 종합 제언 ───────────────────────────────────────────── */

export interface Conclusion {
  /** 맨 앞에 두는 한 문단. 이 보고서를 한 문단으로 줄이면 이것이다. */
  headline: string;
  strengths: string[];
  gaps: string[];
  actions: string[];
}

export function conclusion(r: CompanyReport, picks: Recommendation[]): Conclusion {
  const { diff } = r.overall;
  const up = r.competencies.filter((c) => c.diff !== null && c.diff > 0);
  const down = r.competencies.filter((c) => c.diff !== null && c.diff < 0);
  const lowest = [...r.competencies]
    .filter((c) => c.post !== null)
    .sort((a, b) => rankByPost(a) - rankByPost(b))[0];
  const highest = [...r.competencies]
    .filter((c) => c.post !== null)
    .sort((a, b) => rankByPost(b) - rankByPost(a))[0];

  const headline = para(
    diff === null
      ? '사전과 사후를 비교할 점수가 모자라 변화를 단정할 수 없습니다.'
      : diff >= 0
        ? `이번 교육 뒤 구성원의 종합 역량은 ${abs(diff)}점 올라 ${score(r.overall.post)}점(${levelOf(r.overall.post)})이 되었습니다.`
        : `이번 교육 뒤 구성원의 종합 역량은 ${score(r.overall.post)}점(${levelOf(r.overall.post)})으로, 사전보다 ${abs(diff)}점 낮습니다.`,
    up.length > 0 && down.length > 0
      ? `역량별로는 ${with_(list(up.map((c) => c.short)), '이')} 오르고 ${with_(list(down.map((c) => c.short)), '이')} 내려, 교육 효과가 역량별로 고르지 않게 나타났습니다.`
      : null,
    r.coverage.rate !== null && r.coverage.rate < 70
      ? `다만 사후 응답률이 ${r.coverage.rate}%에 머물러, 이 수치를 기업 전체의 변화라고 말하려면 근거가 더 필요합니다.`
      : `사후 응답률이 ${r.coverage.rate}%로 충분해, 이 수치를 기업 전체의 상태로 읽어도 무리가 없습니다.`,
    picks.length > 0 &&
      `다음 단계로는 ${with_(picks[0].course.shortTitle, '을')} 우선 검토하시기를 권합니다.`,
  );

  const strengths: string[] = [];
  const gaps: string[] = [];
  const actions: string[] = [];

  if (up.length > 0) {
    const best = [...up].sort((a, b) => b.diff! - a.diff!)[0];
    strengths.push(
      `${best.short} 역량이 ${fmt(best.diff)}점으로 가장 크게 올랐습니다. 이번 교육의 효과가 가장 크게 나타난 역량이므로, 같은 방식을 다른 역량으로 넓혀 볼 수 있습니다.`,
    );
  }
  if (highest) {
    strengths.push(
      `가장 높은 역량은 ${highest.short}(${score(highest.post)}점, ${levelOf(highest.post)})입니다. 이 역량을 갖춘 인원을 다음 과정의 사내 조력자로 세우면 확산 속도가 빨라집니다.`,
    );
  }
  if (r.satisfaction.overall !== null && r.satisfaction.overall >= 4.5) {
    strengths.push(
      `교육 만족도가 ${r.satisfaction.overall}점으로 높습니다. 구성원의 거부감이 낮은 지금이 후속 과정을 이어 가기 좋은 시점입니다.`,
    );
  }
  if (r.profile.moved > 0) {
    strengths.push(
      `이름이 이어진 사람 중 ${r.profile.moved}명의 프로필 유형이 바뀌었습니다. 점수만이 아니라 AI를 대하는 방식 자체가 달라졌다는 신호입니다.`,
    );
  }

  if (down.length > 0) {
    gaps.push(
      `${list(down.map((c) => c.short))} 역량은 사전보다 낮습니다. 교육 효과가 미치지 않았거나, 사후 응답자 구성이 사전과 달랐을 가능성이 있습니다. 두 가지 모두 가능하므로 다음 회차에서 확인이 필요합니다.`,
    );
  }
  if (lowest) {
    gaps.push(
      `가장 낮은 역량은 ${lowest.short}(${score(lowest.post)}점)입니다. 다음 교육의 첫 번째 목표로 두는 것이 적절합니다.`,
    );
  }
  if (r.coverage.rate !== null && r.coverage.rate < 70) {
    gaps.push(
      `사후 응답률이 ${r.coverage.rate}%입니다. 다음 회차에는 응답 기간을 늘리거나 부서장을 통해 독려해, 기업 전체의 변화로 말할 수 있는 수준까지 모으는 것이 좋겠습니다.`,
    );
  }
  /*
    "사전검사와 이어지지 않은 응답" 을 고치는 일(응시 안내 문구)은 우리 몫이라
    기업에 건네는 종합 제언에 싣지 않는다.
  */

  if (picks.length > 0) {
    actions.push(
      `${picks[0].course.shortTitle}(${picks[0].course.hours}시간)${josa(picks[0].course.shortTitle, '을')} 다음 과정으로 권합니다. ${picks[0].effect}`,
    );
  }
  if (picks.length > 1) {
    actions.push(
      // 조사는 마지막 과정 이름에 맞춘다 — 괄호 속 "시간" 이 아니다.
      `이어서 ${list(picks.slice(1).map((p) => `${p.course.shortTitle}(${p.course.hours}시간)`))}${josa(
        picks[picks.length - 1].course.shortTitle,
        '을',
      )} 검토해 보실 수 있습니다.`,
    );
  }
  if (r.department.manovaPost.usable && r.department.manovaPost.significant) {
    actions.push(
      '소속에 따라 역량 구성이 다르므로, 전사 공통 과정과 직무별 과정을 나눠 운영하는 편이 효율적입니다.',
    );
  }
  /*
    운영 방식 권고는 07장(등급 분포)과 같은 기준으로 고른다. 결론만 같고 이유가
    다르면 — 중급 이상이 75% 인데 "등급이 여러 구간에 퍼져 있으므로" — 두 장이
    서로 다른 근거를 대는 것처럼 읽힌다.
  */
  const overallLevel = r.levels.find((l) => l.name === '종합');
  if (overallLevel && overallLevel.postN > 0) {
    const pct = (keys: ('입문' | '초급' | '중급' | '고급')[]) =>
      Math.round((keys.reduce((a, k) => a + overallLevel.post[k], 0) / overallLevel.postN) * 100);
    const low = pct(['입문', '초급']) >= 80;
    const high = pct(['중급', '고급']) >= 50;
    actions.push(
      low
        ? '구성원 대부분이 입문·초급에 몰려 있어, 수준을 나누기보다 공통 과정으로 기초를 함께 올리는 편이 낫습니다.'
        : high
          ? '구성원 절반 이상이 중급 이상이므로, 공통 교육보다 직무별·주제별 심화 과정으로 나누어 여는 편이 낫습니다.'
          : '등급이 여러 구간에 퍼져 있으므로, 한 과정으로 묶기보다 수준을 나눠 여는 편이 낫습니다.',
    );
  }

  return { headline, strengths, gaps, actions };
}
