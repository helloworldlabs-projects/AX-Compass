import type { CompanyReport } from '@/lib/admin/report';
import { levelOf, rating, score } from '@/lib/admin/metrics';
import type { Recommendation } from '@/lib/admin/recommend';
import { with_ } from '@/lib/admin/josa';

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
        ? `이 차이는 우연으로 보기 어렵고, 크기도 ${welch.effect} 편입니다(d = ${welch.d}).`
        : `다만 이 정도 차이는 우연으로 보기 어려울 만큼은 아닙니다(d = ${welch.d}).`
      : '응답이 모자라 통계적으로 따져 보지는 못했습니다.',
  );

  // 둘째 문단 — 그런데 이걸 그대로 믿어도 되나.
  const second = para(
    small &&
      `다만 사전 ${welch.n1}명, 사후 ${welch.n2}명으로 어느 한쪽이 10명에 못 미칩니다. 이 변화가 기업 전체의 것인지, 응답한 사람들이 원래 그런 층이었는지는 이 수만으로 갈라내기 어렵습니다.`,
    paired.usable
      ? para(
          `이름이 이어진 ${paired.n}명만 따로 보면 ${score(paired.meanBefore)}점에서 ${score(paired.meanAfter)}점으로,`,
          paired.down === 0
            ? `${paired.n}명 모두 올랐습니다.`
            : paired.up === 0
              ? `${paired.n}명 모두 내렸습니다.`
              : `${paired.up}명이 오르고 ${paired.down}명이 내렸습니다.`,
          welch.significant === paired.significant
            ? '전체 비교와 같은 방향이라, 결과를 그대로 읽어도 무리가 없습니다.'
            : '전체 비교와 결론이 갈립니다. 응답한 사람들이 한쪽으로 쏠렸을 가능성을 먼저 확인해야 합니다.',
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
      ? `세 영역이 모두 올랐습니다. 그중 ${with_(top.label, '이')} ${fmt(top.diff)}점으로 가장 크게, ${with_(bottom.label, '이')} ${fmt(bottom.diff)}점으로 가장 작게 움직였습니다.`
      : allDown
        ? `세 영역이 모두 내렸습니다. ${with_(bottom.label, '이')} ${fmt(bottom.diff)}점으로 가장 크게 빠졌고, ${with_(top.label, '이')} ${fmt(top.diff)}점으로 그나마 덜 빠졌습니다.`
        : `${with_(top.label, '이')} ${fmt(top.diff)}점으로 오른 반면 ${with_(bottom.label, '은')} ${fmt(bottom.diff)}점으로 내렸습니다.`,
    sorted.filter((s) => s.welch.usable && s.welch.significant).length > 0
      ? `${list(
          sorted.filter((s) => s.welch.usable && s.welch.significant).map((s) => s.label),
        )}에서는 우연으로 보기 어려운 차이가 나타납니다.`
      : '다만 어느 영역에서도 우연으로 보기 어려울 만큼의 차이는 확인되지 않았습니다.',
  );

  // 둘째 문단 — 격차가 말하는 것. 이 장의 알맹이다.
  const { sr, sb } = r.gaps;
  const pieces: string[] = [];

  if (sr.post !== null) {
    if (sr.post > 5) {
      pieces.push(
        `자기평가가 상황판단보다 ${abs(sr.post)}점 높습니다. 스스로 매긴 점수만큼 실제 판단이 따라오지 못한다는 뜻으로, 결과를 따져 보는 훈련이 먼저 필요합니다.`,
      );
    } else if (sr.post < -5) {
      pieces.push(
        `자기평가가 상황판단보다 ${abs(sr.post)}점 낮습니다. 실제 판단력에 비해 스스로를 낮게 보고 있어, 역량 자체보다 자신감을 붙이는 쪽이 급합니다.`,
      );
    } else {
      pieces.push('자기 인식과 실제 판단력이 거의 맞물려 있습니다.');
    }
  }

  if (sb.post !== null) {
    if (sb.post > 5) {
      pieces.push(
        `반면 상황판단이 행동빈도보다 ${abs(sb.post)}점 높아, 무엇을 해야 하는지는 알지만 실제로는 덜 하고 있습니다. 개념 교육을 반복하기보다 직접 수행하는 실습 중심 과정이 효과적입니다.`,
      );
    } else if (sb.post < -5) {
      pieces.push(
        `행동빈도가 상황판단보다 ${abs(sb.post)}점 높습니다. 이미 쓰고는 있는데 판단 기준이 덜 잡혀 있어, 무엇을 어떻게 검토할지를 세우는 과정이 맞습니다.`,
      );
    } else {
      pieces.push('아는 것과 하는 것도 비슷한 수준으로 맞물려 있습니다.');
    }
  }

  if (sr.diff !== null && sb.diff !== null) {
    const closed = Math.abs(sr.post ?? 0) < Math.abs(sr.pre ?? 0);
    pieces.push(
      closed
        ? '교육 전보다 인식과 판단의 거리가 좁혀졌습니다.'
        : '교육 전과 견주어 이 거리가 좁혀지지는 않았습니다.',
    );
  }

  /*
    두 격차 검정의 뜻을 적는다.

    표에는 p 값만 찍히는데, 격차는 점수와 달리 **줄어드는 것이 좋은** 수라
    "유의하다" 가 좋은 소식인지 나쁜 소식인지 그 자리에서 갈리지 않는다.
    유의하지 않을 때도 마찬가지로, 거리가 그대로였다는 뜻인지 근거가
    모자란다는 뜻인지 적어 주어야 한다.
  */
  const gapReading = (
    label: string,
    test: { usable: boolean; significant: boolean | null },
    diff: number | null,
  ): string | null => {
    if (!test.usable || diff === null) return null;
    if (test.significant) {
      return Math.abs(diff) < 0.001
        ? null
        : `${label}는 통계적으로도 달라졌습니다. 같은 사람 안에서 움직인 것이라 응답자 구성이 바뀌어 생긴 차이로 보기 어렵습니다.`;
    }
    return `${label}는 통계적으로 뚜렷하게 달라지지 않았습니다. 거리가 그대로라는 증명은 아니고, 지금 인원으로는 변화를 가려낼 근거가 모자란다는 뜻입니다.`;
  };

  // 같은 사람끼리 짝지은 검정을 읽는다. 아래 표에 실리는 것도 그쪽이다.
  const srReading = gapReading('자기평가와 상황판단의 거리', sr.paired, sr.diff);
  const sbReading = gapReading('상황판단과 행동빈도의 거리', sb.paired, sb.diff);
  if (srReading) pieces.push(srReading);
  if (sbReading) pieces.push(sbReading);

  const second = para(...pieces);

  const third =
    r.gaps.spread.diff === null
      ? null
      : r.gaps.spread.diff < 0
        ? `역량 간 편차는 ${abs(r.gaps.spread.diff)}점 줄었습니다. 특정 역량만 끌어올린 것이 아니라 고르게 올라왔다는 뜻으로, 다음 교육은 전사 공통 과정으로 이어 가도 좋습니다.`
        : `역량 간 편차가 ${fmt(r.gaps.spread.diff)}점 늘었습니다. 움직인 역량과 그대로인 역량의 거리가 벌어졌으므로, 다음 교육은 뒤처진 역량을 겨냥해 좁혀 잡는 편이 낫습니다.`;

  return { paragraphs: [first, second, third].filter(Boolean) as string[] };
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

  const highest = [...r.competencies]
    .filter((c) => c.post !== null)
    .sort((a, b) => b.post! - a.post!)[0];
  const lowest = [...r.competencies]
    .filter((c) => c.post !== null)
    .sort((a, b) => a.post! - b.post!)[0];

  // 첫 문단 — 무엇이 나왔는가. 예시의 "분석 결과, …" 자리.
  const first = para(
    allUp
      ? '분석 결과, 모든 역량 영역에서 사후검사 평균 점수가 사전검사 평균 점수보다 높게 나타났습니다. 이는 본 교육 이후 응시자들의 AX 역량 수준이 전반적으로 향상되었음을 의미합니다.'
      : allDown
        ? '분석 결과, 모든 역량 영역에서 사후검사 평균 점수가 사전검사 평균 점수보다 낮게 나타났습니다. 다만 두 시점의 응답자가 같은 사람들이 아니므로, 이 결과를 역량이 떨어졌다고 곧바로 읽기보다 사후에 응답한 집단의 특성을 함께 살펴야 합니다.'
        : `분석 결과, ${list(up.map((c) => c.short))} 영역에서는 사후검사 평균이 높게, ${list(
            down.map((c) => c.short),
          )} 영역에서는 낮게 나타났습니다. 교육 효과가 영역별로 고르지 않게 나타났습니다.`,
    (() => {
      const sig = withDiff.filter((c) => c.welch.usable && c.welch.significant);
      return sig.length === withDiff.length
        ? '네 영역 모두 통계적으로 유의한 차이가 확인되었습니다.'
        : sig.length > 0
          ? `이 가운데 ${list(sig.map((c) => c.short))} 영역의 차이가 통계적으로 유의한 것으로 나타났습니다.`
          : '다만 어느 영역에서도 통계적으로 유의한 차이는 확인되지 않았습니다.';
    })(),
  );

  // 둘째 문단 — 특히 두드러진 것.
  const top = allDown ? sorted[sorted.length - 1] : sorted[0];
  const second = para(
    `특히 ${top.short} 역량의 변화 폭이 두드러집니다. 사전 평균 ${top.welch.mean1.toFixed(2)}점에서 사후 평균 ${top.welch.mean2.toFixed(2)}점으로 ${abs(top.diff!)}점 ${top.diff! >= 0 ? '상승하여' : '하락하여'} 네 영역 중 가장 큰 변화를 보였습니다.`,
    sorted.length > 1 &&
      `${sorted[allDown ? sorted.length - 2 : 1].short} 역량 역시 사전 평균 ${sorted[allDown ? sorted.length - 2 : 1].welch.mean1.toFixed(2)}점에서 사후 평균 ${sorted[allDown ? sorted.length - 2 : 1].welch.mean2.toFixed(2)}점으로 ${sorted[allDown ? sorted.length - 2 : 1].diff! >= 0 ? '상승' : '하락'}하였습니다.`,
    allUp
      ? '이는 교육 이후 응시자들이 AI를 단순히 사용하는 수준을 넘어, 업무 목적에 맞게 활용하고 결과물을 검토·수정하는 역량을 강화하였음을 보여줍니다.'
      : null,
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
      `하위 역량 열두 가지 가운데 ${with_(list(strongTags.map((t) => t.name)), '이')} 상대적으로 높게 나타났습니다.`,
    weakTags.length === 3 &&
      `반면 ${with_(list(weakTags.map((t) => t.name)), '은')} 보완이 필요합니다.`,
    lowest &&
      weakTags[0] &&
      `후속 교육은 ${lowest.short} 역량, 그중에서도 ${with_(weakTags[0].name, '을')} 중심으로 구성하는 것이 적절합니다.`,
  );

  // 넷째 문단 — 종합. 예시의 "종합하면, …" 자리.
  const split = r.competencies.filter(
    (c) => c.welch.usable && c.paired.usable && c.welch.significant !== c.paired.significant,
  );
  const fourth = para(
    allUp
      ? '종합하면, 본 교육은 응시자들의 AX 역량을 전반적으로 향상시키는 데 긍정적인 영향을 준 것으로 판단됩니다. 특히 AI 활용 경험의 확대에 그치지 않고 업무 적용, 결과 검증, 품질 개선, 책임 있는 활용까지 이어지는 실무 중심의 역량 향상 효과가 나타난 것으로 볼 수 있습니다.'
      : `종합하면, 지금 가장 높은 역량은 ${highest.short}(${score(highest.post)}점, ${levelOf(highest.post)}), 가장 낮은 역량은 ${lowest.short}(${score(lowest.post)}점, ${levelOf(lowest.post)})입니다. 다음 교육의 목표를 ${lowest.short} 역량에 두고, 이미 확보된 ${highest.short} 역량을 가진 인원을 사내 조력자로 세우는 편이 효율적입니다.`,
    split.length > 0 &&
      `다만 ${list(split.map((c) => c.short))} 역량에서는 전체 비교와 대응표본 비교의 결론이 갈립니다. 이 영역의 수치를 인용하기 전에 응답자 구성을 확인해 주세요.`,
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
  const preLow = share(l.pre, l.preN, ['입문', '초급']);
  const postHigh = share(l.post, l.postN, ['중급', '고급']);
  const preHigh = share(l.pre, l.preN, ['중급', '고급']);

  const moved =
    l.preMode && l.postMode && l.preMode !== l.postMode
      ? rank(l.postMode) > rank(l.preMode)
        ? `대표 등급이 ${l.preMode}에서 ${l.postMode}으로 올라갔습니다.`
        : `대표 등급이 ${l.preMode}에서 ${l.postMode}으로 내려갔습니다.`
      : `대표 등급은 ${l.postMode ?? '—'}으로 그대로입니다.`;

  const body =
    postLow >= 80
      ? `구성원 ${postLow}%가 입문·초급에 몰려 있어, 아직 기초 단계를 벗어나지 못한 상태입니다. 수준을 나누기보다 공통 과정으로 바닥을 함께 올리는 편이 효율적입니다.`
      : postHigh >= 50
        ? `중급 이상이 ${postHigh}%로 절반을 넘습니다. 공통 교육보다 직무별·주제별 심화로 나누어 운영할 수 있는 단계입니다.`
        : `입문·초급이 ${postLow}%, 중급 이상이 ${postHigh}%로 갈려 있습니다. 한 과정으로 묶으면 한쪽이 지루하거나 따라오지 못하므로, 수준을 나눠 여는 편이 낫습니다.`;

  const shift =
    postHigh > preHigh
      ? `사전의 중급 이상 ${preHigh}%에서 ${postHigh}%로 위쪽 등급이 두터워졌습니다.`
      : postHigh < preHigh
        ? `사전의 중급 이상 ${preHigh}%에서 ${postHigh}%로 위쪽 등급이 얇아졌습니다. 사후에 응답한 사람들이 사전과 다른 층일 가능성을 함께 봐야 합니다.`
        : `위아래 구성은 사전(입문·초급 ${preLow}%)과 크게 다르지 않습니다.`;

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

  const second = para(
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
      '역량별 대표 등급은 네 가지 모두 사전과 동일합니다. 평균 점수는 변화하였으나 등급 구간을 넘어서는 수준에는 이르지 못한 것으로 해석됩니다.',
  );

  return { paragraphs: [first, second].filter(Boolean) };
}

/* ── 07 소속별 차이 ──────────────────────────────────────── */

export function departmentInsight(r: CompanyReport): ChapterInsight {
  const m = r.department.manovaPost;
  const significantVars = m.perVariable.filter((v) => v.anova.usable && v.anova.significant);

  /*
    "뚜렷하지 않다" 를 "차이가 없다" 로 읽으면 안 된다.

    유의하지 않다는 것은 차이가 없다는 증명이 아니라, 모인 응답만으로는
    차이를 말할 근거가 모자란다는 뜻이다. 부서당 인원이 적으면 실제로
    차이가 있어도 검정이 잡아내지 못한다. 그 사정을 함께 적지 않으면
    읽는 사람이 "우리 회사는 부서 간 편차가 없다" 는 결론으로 건너뛴다.
  */
  const thin = r.department.rows.filter((d) => d.postN > 0 && d.postN < 5).length;

  const first = m.usable
    ? para(
        m.significant
          ? `소속에 따라 역량 구성이 다릅니다(Wilks' Λ = ${m.wilks}, p = ${m.p}). 같은 교육을 받아도 부서마다 남은 것이 달랐다는 뜻입니다.`
          : `소속에 따른 역량 구성의 차이는 뚜렷하지 않습니다(Wilks' Λ = ${m.wilks}, p = ${m.p}).`,
        !m.significant
          ? `이는 부서 간 차이가 없다는 증명이 아니라, 모인 응답만으로는 차이를 말할 근거가 모자란다는 뜻입니다.${
              thin > 0
                ? ` 특히 응답이 5명에 못 미치는 소속이 ${thin}곳이라, 실제로 차이가 있어도 검정이 잡아내기 어려운 상태입니다.`
                : ''
            }`
          : null,
        significantVars.length > 0
          ? `역량별로 따로 보면 ${list(significantVars.map((v) => v.name))}에서 차이가 두드러집니다.`
          : m.significant
            ? '다만 역량별로 하나씩 보면 어느 것도 단독으로는 뚜렷하지 않아, 차이는 특정 역량보다 전체 구성에서 옵니다.'
            : '역량별로 개별 분석하여도 소속에 따라 차이가 나타나는 역량은 없었습니다. 부서별로 다른 교육 방향을 설정할 근거가 확인되지 않으므로, 후속 과정은 소속이 아니라 역량 수준 또는 프로필 유형을 기준으로 편성하는 것이 적절합니다.',
      )
    : para(
        '소속별 다변량 분석은 하지 못했습니다.',
        m.note,
        '아래 역량별 결과와 소속별 평균을 대신 읽어 주세요.',
      );

  const withBoth = r.department.rows.filter((d) => d.diff !== null);
  const second =
    withBoth.length >= 2
      ? (() => {
          const sorted = [...withBoth].sort((a, b) => b.diff! - a.diff!);
          const best = sorted[0];
          const worst = sorted[sorted.length - 1];
          const spread = Math.abs(best.diff! - worst.diff!);
          return para(
            `소속별로는 ${with_(best.name, '이')} ${fmt(best.diff)}점, ${with_(worst.name, '이')} ${fmt(worst.diff)}점으로 ${abs(spread)}점 벌어져 있습니다.`,
            spread > 10
              ? '동일한 교육을 이수하였음에도 부서 간 결과 차이가 크게 나타났습니다. 다음 회차에서는 부서별로 목표와 과제를 구분하여 설정하는 것이 적절합니다.'
              : '부서 간 차이가 크지 않아 공통 과제로 통합하여 운영할 수 있습니다.',
            !r.department.changeAnova.usable
              ? null
              : r.department.changeAnova.significant
                ? '통계적으로도 소속에 따라 변화량이 다른 것으로 나타납니다. 부서별로 다른 목표를 잡을 근거가 있습니다.'
                : '다만 통계적으로는 소속에 따라 변화량이 다르다고 말하기 어렵습니다. 위의 부서별 차이는 부서당 인원이 적어 한두 사람의 점수로도 생길 수 있는 폭이므로, 부서 이름을 근거로 삼기보다 사람 수가 쌓인 뒤에 다시 보는 편이 안전합니다.',
          );
        })()
      : null;

  const small = r.department.rows.filter((d) => d.preN > 0 && d.preN < 5);
  const third =
    small.length > 0
      ? `다만 ${small.length}개 소속은 인원이 5명 미만이라 평균이 곧 개인의 점수입니다. 기업에 전달할 때는 이 소속들을 묶거나 이름을 가려 주세요.`
      : null;

  return { paragraphs: [first, second, third].filter(Boolean) as string[] };
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

  const first = para(
    `사후 기준으로 ${with_(topPost.name, '이')} ${topPost.postShare}%로 가장 많습니다.`,
    grew.length > 0 &&
      `${list(grew.slice(0, 2).map((p) => `${p.name}(${fmt(p.diff)}%p)`))} 비중이 늘었고,`,
    shrank.length > 0 &&
      `${list(shrank.slice(0, 2).map((p) => `${p.name}(${fmt(p.diff)}%p)`))} 비중은 줄었습니다.`,
  );

  const chi = r.profile.chi2;
  const second = para(
    chi.usable
      ? chi.significant
        ? `분포가 달라진 정도는 우연으로 보기 어렵습니다(χ² = ${chi.chi2}, Cramér's V = ${chi.v}). 사람들이 실제로 다른 유형으로 옮겨 갔다는 뜻입니다.`
        : `다만 분포가 달라진 정도는 우연으로 보기 어려울 만큼은 아닙니다(χ² = ${chi.chi2}). 유형 구성이 그대로라는 뜻은 아니며, 여섯 유형으로 나누면 칸마다 인원이 적어져 웬만한 변화로는 뚜렷하게 잡히지 않습니다. 아래의 개인별 이동을 함께 보아 주세요.`
      : '분포 변화를 통계적으로 따지기에는 응답이 모자랍니다.',
    chi.note,
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
              `${x.name}(${x.goal.want === 'down' ? '감소' : '증가'} 기대, 실제 ${fmt(x.diff)}%p)`,
          ),
        )} 유형은 기대와 반대로 이동하였습니다. ${with_(bad[0].name, '은')} ${bad[0].goal.reason}`
      : null,
    balanced === undefined
      ? null
      : balanced.diff > 0
        ? `교육이 최종적으로 지향하는 균형형은 ${fmt(balanced.diff)}%p 증가하여 ${balanced.postShare}%로 나타났습니다. 판단과 실행이 함께 안정된 인원이 늘어난 것으로, 후속 과정에서 사내 확산 담당자로 우선 고려할 수 있는 집단입니다.`
        : `다만 교육이 최종적으로 지향하는 균형형은 ${fmt(balanced.diff)}%p로 증가하지 않았습니다(${balanced.postShare}%). 판단과 실행 중 한쪽은 향상되었으나 두 가지가 함께 안정되는 단계에는 이르지 못한 것으로, 후속 과정에서는 상대적으로 부족한 영역을 중심으로 설계하는 것이 적절합니다.`,
  );

  // 유형이 말하는 처방. 이 장이 실제로 쓸모 있으려면 여기까지 가야 한다.
  const advice =
    topPost.id === 'OVERCONFIDENT'
      ? '과신형의 비중이 높다는 것은 산출물을 검증 없이 수용하는 인원이 많다는 의미입니다. 검증 절차와 품질 판단 기준을 다루는 과정을 우선 편성하는 것이 적절합니다.'
      : topPost.id === 'CAUTIOUS'
        ? '조심형의 비중이 높다는 것은 활용 방법은 인지하고 있으나 실제 사용에 이르지 못한 인원이 많다는 의미입니다. 소규모 과제를 직접 수행하는 실습형 과정이 적합합니다.'
        : topPost.id === 'LEARNER'
          ? '이해형의 비중이 높다는 것은 개념 이해는 갖추었으나 업무 적용으로 이어지지 않았다는 의미입니다. 담당 업무를 직접 과제로 다루는 적용형 과정이 후속 과정으로 적합합니다.'
          : topPost.id === 'DOER'
            ? '실행형의 비중이 높다는 것은 이미 업무에 활용하고 있다는 의미입니다. 검증 기준과 운영 규칙을 수립하는 과정으로 연계하는 것이 적절합니다.'
            : topPost.id === 'ANALYST'
              ? '판단형의 비중이 높다는 것은 검토 역량은 갖추었으나 실제 실행 빈도가 낮다는 의미입니다. 실제 도구를 사용해 보는 실습 중심 과정이 후속 과정으로 적합합니다.'
              : '균형형의 비중이 가장 높습니다. 특정 역량을 보완하기보다 난이도를 한 단계 높인 과정으로 연계할 수 있습니다.';

  return { paragraphs: [first, second, direction, advice].filter(Boolean) };
}

/* ── 09 교육 만족도 ──────────────────────────────────────── */

export function satisfactionInsight(r: CompanyReport): ChapterInsight {
  const { metrics, overall, respondents, cohorts } = r.satisfaction;
  if (metrics.length === 0) {
    return { paragraphs: ['수집된 만족도 응답이 없습니다.'] };
  }

  const sorted = metrics.filter((m) => m.mean !== null).sort((a, b) => b.mean! - a.mean!);
  if (sorted.length === 0) {
    return { paragraphs: ['수집된 만족도 응답이 없습니다.'] };
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
  const grew = paired.usable && paired.significant === true && (r.overall.diff ?? 0) > 0;

  const third = para(
    '만족도는 교육을 어떻게 받아들였는지에 대한 응답이고, 뒤에서 다루는 역량 변화는 실제로 무엇이 달라졌는지에 대한 측정입니다. 두 가지는 함께 움직이기도 하고 어긋나기도 하므로, 만족도가 높다는 사실만으로 역량이 향상되었다고 판단하지 않습니다.',
    !paired.usable
      ? '이번 회차는 같은 인원을 대상으로 한 전후 비교가 성립하지 않아, 만족도와 역량 변화를 맞대어 보기 어렵습니다.'
      : high && grew
        ? `이번 회차는 만족도가 ${overall}점으로 높고, 같은 인원의 종합 역량도 ${fmt(r.overall.diff)}점 향상되어 통계적으로도 확인되었습니다. 교육에 대한 평가와 실제 역량 변화가 같은 방향으로 나타난 경우로, 후속 과정을 연계하기에 적합한 상태입니다.`
        : high && !grew
          ? `이번 회차는 만족도가 ${overall}점으로 높은 반면, 같은 인원의 종합 역량 변화는 통계적으로 뚜렷하지 않습니다. 교육에 대한 평가가 곧 역량 향상을 의미하지는 않으므로, 후속 과정은 만족도보다 아래의 역량별 결과를 근거로 설계하는 것이 적절합니다.`
          : !high && grew
            ? `이번 회차는 만족도가 ${overall}점으로 높지 않으나, 같은 인원의 종합 역량은 ${fmt(r.overall.diff)}점 향상되었습니다. 난도나 진행 방식에 대한 부담은 있었으나 학습 자체는 이루어진 것으로 볼 수 있으므로, 내용보다 운영 방식을 보완하는 편이 적절합니다.`
            : '이번 회차는 만족도와 역량 변화 모두 뚜렷하게 나타나지 않았습니다. 과정 내용과 운영 방식을 함께 점검할 필요가 있습니다.',
  );

  return { paragraphs: [first, second, third].filter(Boolean) };
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
    .sort((a, b) => a.post! - b.post!)[0];
  const highest = [...r.competencies]
    .filter((c) => c.post !== null)
    .sort((a, b) => b.post! - a.post!)[0];

  const headline = para(
    diff === null
      ? '사전과 사후를 견줄 점수가 모자라 변화를 단정할 수 없습니다.'
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
      `${best.short} 역량이 ${fmt(best.diff)}점으로 가장 크게 올랐습니다. 이번 교육의 효과가 가장 크게 나타난 영역으로, 동일한 운영 방식을 다른 역량으로 확대 적용할 수 있습니다.`,
    );
  }
  if (highest) {
    strengths.push(
      `가장 높은 역량은 ${highest.short}(${score(highest.post)}점, ${levelOf(highest.post)})입니다. 이 역량을 갖춘 인원을 다음 과정의 사내 조력자로 세우면 확산 속도가 빨라집니다.`,
    );
  }
  if (r.satisfaction.overall !== null && r.satisfaction.overall >= 4.5) {
    strengths.push(
      `교육 만족도가 ${r.satisfaction.overall}점으로 높습니다. 구성원의 거부감이 낮은 지금이 후속 과정을 붙이기 좋은 시점입니다.`,
    );
  }
  if (r.profile.moved > 0) {
    strengths.push(
      `이름이 이어진 사람 중 ${r.profile.moved}명의 프로필 유형이 바뀌었습니다. 점수만이 아니라 AI를 대하는 방식 자체가 움직였다는 신호입니다.`,
    );
  }

  if (down.length > 0) {
    gaps.push(
      `${list(down.map((c) => c.short))} 역량은 사전보다 낮습니다. 교육 효과가 미치지 않았거나, 사후 응답자 구성이 사전과 달랐을 가능성이 있습니다. 두 가지 모두 가능하므로 다음 회차에서 확인이 필요합니다.`,
    );
  }
  if (lowest) {
    gaps.push(
      `가장 낮은 역량은 ${lowest.short}(${score(lowest.post)}점)입니다. 다음 교육의 첫 번째 목표로 두는 것이 맞습니다.`,
    );
  }
  if (r.coverage.rate !== null && r.coverage.rate < 70) {
    gaps.push(
      `사후 응답률이 ${r.coverage.rate}%입니다. 다음 회차에는 응답 기간을 늘리거나 부서장을 통해 독려해, 기업 전체의 변화로 말할 수 있는 수준까지 모으는 것이 좋겠습니다.`,
    );
  }
  if (r.coverage.postN - r.coverage.matchedN > 0) {
    gaps.push(
      `사전검사와 이어지지 않은 응답이 ${r.coverage.postN - r.coverage.matchedN}건 있습니다. 응시 안내에 "사전검사 때와 같은 이름"을 굵게 적으면 상당수가 줄어듭니다.`,
    );
  }

  if (picks.length > 0) {
    actions.push(
      `${with_(`${picks[0].course.shortTitle}(${picks[0].course.hours}시간)`, '을')} 다음 과정으로 권합니다. ${picks[0].effect}`,
    );
  }
  if (picks.length > 1) {
    actions.push(
      `이어서 ${with_(
        list(picks.slice(1).map((p) => `${p.course.shortTitle}(${p.course.hours}시간)`)),
        '을',
      )} 검토해 보실 수 있습니다.`,
    );
  }
  if (r.department.manovaPost.usable && r.department.manovaPost.significant) {
    actions.push(
      '소속에 따라 역량 구성이 다르므로, 전사 공통 과정과 직무별 과정을 나눠 운영하는 편이 효율적입니다.',
    );
  }
  const overallLevel = r.levels.find((l) => l.name === '종합');
  if (overallLevel && overallLevel.postN > 0) {
    const low =
      Math.round(
        ((overallLevel.post['입문'] + overallLevel.post['초급']) / overallLevel.postN) * 100,
      ) >= 80;
    actions.push(
      low
        ? '구성원 대다수가 입문·초급에 분포하고 있어, 수준별로 구분하기보다 공통 과정으로 전반적인 기초 역량을 함께 높이는 방식이 적절합니다.'
        : '등급이 여러 구간에 분포하고 있으므로, 단일 과정으로 통합하기보다 수준별로 구분하여 운영하는 것이 적절합니다.',
    );
  }

  return { headline, strengths, gaps, actions };
}
