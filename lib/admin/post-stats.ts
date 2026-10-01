/**
 * 사후검사 결과 계산.
 *
 * 응답 한 줄 한 줄은 DB 에서 읽어 온다(post-results.ts). 이 파일은 그 줄들을
 * 받아 **기업 단위로 무엇이 달라졌는지**를 낸다 — 영역별·역량별·부서별 변화와
 * 프로필 유형의 이동.
 *
 * 비교는 언제나 **전체 대 전체**다. 사전은 그 기업에서 사전검사를 치른 사람
 * 전부, 사후는 응답한 사람 전부. 같은 사람끼리 짝지어 보면 모수가 작아지고,
 * 매칭되지 않은 사람이 통계에서 통째로 빠진다.
 */

import { PROFILE_NAMES, type ProfileId } from '@/lib/admin/ax-scoring';

export type MatchState = '매칭' | '사전없음';

/** 영역 점수. 자기평가 / 상황판단 / 행동빈도. */
export interface SectionScores {
  A: number;
  B: number;
  C: number;
}

/** 역량 점수. */
export interface CompetencyScores {
  UNDERSTAND: number;
  USE_AND_APPLY: number;
  EVALUATE: number;
  RESPONSIBLE: number;
}

export interface Scores {
  total: number;
  sections: SectionScores;
  competencies: CompetencyScores;
}

export interface PostResponse {
  id: string;
  /** 응답은 링크가 아니라 기업에 매달린다. 링크를 닫아도 남는다. */
  institutionId: number;
  /**
   * 응시자가 입력한 이름.
   *
   * 운영 화면에서 누가 응답했는지 확인하려면 이름이 필요하다. 다만 이 값이
   * 저장되는 순간 우리 DB 가 개인정보를 담게 되므로, 보관 기간과 파기 시점을
   * 정해 두어야 한다. 기업에 전달하는 보고서에는 올라가지 않는다.
   */
  name: string;
  /** 사전검사에서 따라온 부서. 매칭에 실패하면 알 수 없다. */
  department: string | null;
  submittedAt: string;
  match: MatchState;
  post: Scores;
  /** 사전 점수. 매칭된 건에만 있다. */
  pre: Scores | null;
  /** 사후 프로필 유형. */
  postProfile: ProfileId;
  /** 사전 프로필 유형. 매칭된 건에만 있다. */
  preProfile: ProfileId | null;
}

export const SECTION_LABEL: Record<keyof SectionScores, string> = {
  A: '자기평가',
  B: '상황판단',
  C: '행동빈도',
};

export const COMPETENCY_LABEL: Record<keyof CompetencyScores, string> = {
  UNDERSTAND: '이해(Understand)',
  USE_AND_APPLY: '활용(Use & Apply)',
  EVALUATE: '평가·개선(Evaluate & Improve)',
  RESPONSIBLE: '책임·거버넌스(Responsible Use)',
};

/** 사전과 사후가 모두 있는 사람. 모든 비교는 이 사람들로만 한다. */
export function matchedOf(rows: PostResponse[]): PostResponse[] {
  return rows.filter((r) => r.match === '매칭' && r.pre !== null);
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

/**
 * 향상도.
 *
 * 반드시 **대응표본**으로 낸다. 사후 평균에서 사전 평균을 빼면 안 된다 —
 * 매칭되지 않은 사람이 한쪽에만 들어가 없는 변화가 생긴다.
 * 같은 사람의 사전·사후 차이를 먼저 구하고 그것을 평균한다.
 */
export function improvement(rows: PostResponse[]): number | null {
  const paired = matchedOf(rows);
  return mean(paired.map((r) => r.post.total - (r.pre as Scores).total));
}

export interface Change {
  key: string;
  label: string;
  /** 사전 기록이 있는 사람의 사전 평균. */
  pre: number | null;
  /** 같은 사람들의 사후 평균. 변화는 이 짝에서만 나온다. */
  post: number | null;
  delta: number | null;
  /**
   * 응답한 사람 전부의 사후 평균.
   *
   * 사전이 없다고 빼면 이 기업의 지금 수준이 아니게 된다. 변화를 낼 때는
   * 쓸 수 없지만, 지금 어디에 서 있는지는 이 값이 말해 준다.
   */
  postAll: number | null;
}

function change(
  key: string,
  label: string,
  pres: number[],
  posts: number[],
  postsAll: number[] = posts,
): Change {
  const pre = mean(pres);
  const post = mean(posts);
  return {
    key,
    label,
    pre,
    post,
    delta: pre === null || post === null ? null : Math.round((post - pre) * 10) / 10,
    postAll: mean(postsAll),
  };
}

/** 영역별 사전 → 사후. 매칭된 사람만 쓴다. */
export function sectionChanges(rows: PostResponse[]): Change[] {
  const paired = matchedOf(rows);
  return (Object.keys(SECTION_LABEL) as (keyof SectionScores)[]).map((k) =>
    change(
      k,
      SECTION_LABEL[k],
      paired.map((r) => (r.pre as Scores).sections[k]),
      paired.map((r) => r.post.sections[k]),
      rows.map((r) => r.post.sections[k]),
    ),
  );
}

/** 역량별 사전 → 사후. */
export function competencyChanges(rows: PostResponse[]): Change[] {
  const paired = matchedOf(rows);
  return (Object.keys(COMPETENCY_LABEL) as (keyof CompetencyScores)[]).map((k) =>
    change(
      k,
      COMPETENCY_LABEL[k],
      paired.map((r) => (r.pre as Scores).competencies[k]),
      paired.map((r) => r.post.competencies[k]),
      rows.map((r) => r.post.competencies[k]),
    ),
  );
}

/** 부서별 사전 → 사후. 매칭되지 않은 사람은 부서를 모르므로 빠진다. */
export function departmentChanges(rows: PostResponse[]): (Change & { n: number })[] {
  const paired = matchedOf(rows);
  const names = [...new Set(paired.map((r) => r.department ?? '미기재'))];
  return names.map((name) => {
    const mine = paired.filter((r) => (r.department ?? '미기재') === name);
    return {
      ...change(
        name,
        name,
        mine.map((r) => (r.pre as Scores).total),
        mine.map((r) => r.post.total),
      ),
      n: mine.length,
    };
  });
}

/** 프로필 유형이 어떻게 옮겨 갔는가. */
export interface ProfileShift {
  code: ProfileId;
  label: string;
  preN: number;
  prePct: number | null;
  postN: number;
  postPct: number;
  /** 비중 차이(%p). 사전 분포가 없으면 낼 수 없다. */
  delta: number | null;
}

/**
 * 프로필 유형 변화.
 *
 * 사전은 기록이 있는 사람만, 사후는 응답한 사람 전부로 낸다. 모수가 달라
 * 인원을 그대로 빼면 안 되고, 비중으로 봐야 한다.
 */
export function profileShifts(
  rows: PostResponse[],
  /** 사전검사 전체에만 있는 유형도 줄에서 빠지지 않게 함께 받는다. */
  extraCodes: ProfileId[] = [],
): ProfileShift[] {
  const paired = matchedOf(rows);
  const codes = [
    ...new Set([
      ...paired.map((r) => r.preProfile as ProfileId),
      ...rows.map((r) => r.postProfile),
      ...extraCodes,
    ]),
  ];

  const pct = (n: number, total: number) =>
    total === 0 ? null : Math.round((n / total) * 1000) / 10;

  return codes
    .map((code) => {
      const preN = paired.filter((r) => r.preProfile === code).length;
      const postN = rows.filter((r) => r.postProfile === code).length;
      const prePct = pct(preN, paired.length);
      const postPct = pct(postN, rows.length) ?? 0;
      return {
        code,
        label: PROFILE_NAMES[code],
        preN,
        prePct,
        postN,
        postPct,
        delta: prePct === null ? null : Math.round((postPct - prePct) * 10) / 10,
      };
    })
    .sort((a, b) => b.postPct - a.postPct || b.preN - a.preN);
}
