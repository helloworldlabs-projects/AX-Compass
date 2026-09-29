/**
 * AX Compass 채점 엔진.
 *
 * 설계 문서(점수 배점 로직 개요 / 프로필 유형 정의)와 역량 개요 시트를
 * 그대로 옮긴 것이다. 숫자와 조건식을 여기서 임의로 바꾸지 말 것.
 * 기준이 바뀌면 문서를 먼저 고치고, 그 다음 이 파일을 고친다.
 *
 * 흐름
 *   응답 → 0~100 정규화 → 구성요소(SE/SJ/BH) 평균 → 역량 점수(U/P/E/R)
 *        → 종합 점수 → 수준 판정(+상한 제한) → 프로필 유형 → 학습 그룹
 */

export type Section = 'A' | 'B' | 'C';
export type CompetencyId = 'U' | 'P' | 'E' | 'R';
export type Tag = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l';
export type Level = '입문' | '초급' | '중급' | '고급';
export type ProfileId = 'BALANCED' | 'OVERCONFIDENT' | 'DOER' | 'ANALYST' | 'CAUTIOUS' | 'LEARNER';
export type GroupId = 'EXPAND' | 'VERIFY' | 'ACTIVATE';

export interface Item {
  id: string;
  section: Section;
  tag: Tag;
  type: 'LIKERT' | 'LIKERT_FREQ' | 'SJT';
  /** SJT 문항의 선택지별 점수. 예: { A: 0, B: 100, C: 60, D: 20 } */
  optionScores?: Record<string, number>;
}

/** 응답값. Likert 는 1~5 숫자, SJT 는 선택지 코드("A"~"D"). 미응답은 생략. */
export type Answers = Record<string, number | string>;

// ── 고정 상수 (설계 문서 기준) ──────────────────────────

/** 세부 역량 태그 → 4대 핵심 역량 */
export const TAG_TO_COMPETENCY: Record<Tag, CompetencyId> = {
  a: 'U',
  b: 'U',
  c: 'U',
  d: 'P',
  e: 'P',
  f: 'P',
  g: 'E',
  h: 'E',
  i: 'E',
  j: 'R',
  k: 'R',
  l: 'R',
};

export const COMPETENCY_NAMES: Record<CompetencyId, string> = {
  U: '이해',
  P: '활용',
  E: '평가·개선',
  R: '책임·거버넌스',
};

/** 구성요소 가중치 — 자기인식보다 실제 판단을 크게 본다. */
export const SECTION_WEIGHT: Record<Section, number> = { A: 0.3, B: 0.5, C: 0.2 };

/** 역량군 가중치 — 실무 적용(P)과 검증·개선(E)을 크게 본다. */
export const COMPETENCY_WEIGHT: Record<CompetencyId, number> = {
  U: 0.2,
  P: 0.3,
  E: 0.3,
  R: 0.2,
};

/** Likert 1~5 → 0~100 */
export const LIKERT_SCORE: Record<number, number> = {
  1: 0,
  2: 25,
  3: 50,
  4: 75,
  5: 100,
};

const LEVEL_BANDS: { level: Level; min: number; max: number }[] = [
  { level: '입문', min: 0, max: 49 },
  { level: '초급', min: 50, max: 69 },
  { level: '중급', min: 70, max: 89 },
  { level: '고급', min: 90, max: 100 },
];

const LEVEL_ORDER: Level[] = ['입문', '초급', '중급', '고급'];

export const PROFILE_GROUP: Record<ProfileId, GroupId> = {
  BALANCED: 'EXPAND',
  LEARNER: 'EXPAND',
  OVERCONFIDENT: 'VERIFY',
  DOER: 'VERIFY',
  ANALYST: 'ACTIVATE',
  CAUTIOUS: 'ACTIVATE',
};

export const PROFILE_NAMES: Record<ProfileId, string> = {
  BALANCED: '균형형',
  OVERCONFIDENT: '과신형',
  DOER: '실행형',
  ANALYST: '판단형',
  CAUTIOUS: '조심형',
  LEARNER: '이해형',
};

export const GROUP_NAMES: Record<GroupId, string> = {
  EXPAND: '이해·확장형',
  VERIFY: '검증·점검형',
  ACTIVATE: '실행 유도형',
};

// ── 결과 타입 ───────────────────────────────────────────

export interface CompetencyScore {
  id: CompetencyId;
  name: string;
  /** 구성요소별 평균. 해당 구성요소에 응답이 없으면 null. */
  se: number | null;
  sj: number | null;
  bh: number | null;
  score: number;
  answeredItems: number;
}

export interface ScoreResult {
  /** 전체 구성요소 평균 — 프로필 판정의 입력값 */
  se: number;
  sj: number;
  bh: number;
  gapSR: number;
  gapSB: number;

  competencies: Record<CompetencyId, CompetencyScore>;
  overall: number;

  /** 상한 제한을 적용하기 전 등급 */
  baseLevel: Level;
  /** 최종 등급 */
  level: Level;
  /** 상한이 걸렸다면 그 사유. 안 걸렸으면 null. */
  capReason: string | null;

  /**
   * 구성요소 중 응답이 하나도 없는 것. 비어 있지 않으면 프로필을 내지 않는다.
   * SE/SJ/BH 중 하나가 0으로 깔리면 Gap 이 극단값이 되어 엉뚱한 유형이 나온다.
   */
  missingSections: Section[];
  profile: ProfileId | null;
  profileName: string | null;
  group: GroupId | null;
  groupName: string | null;

  answeredItems: number;
  totalItems: number;
}

// ── 정규화 ──────────────────────────────────────────────

/** 문항 하나의 응답을 0~100 으로 바꾼다. 응답이 없거나 해석 불가면 null. */
export function normalizeAnswer(item: Item, answer: number | string | undefined): number | null {
  if (answer === undefined || answer === null || answer === '') return null;

  if (item.type === 'SJT') {
    const code = String(answer).trim().toUpperCase();
    const score = item.optionScores?.[code];
    return typeof score === 'number' ? score : null;
  }

  const n = typeof answer === 'number' ? answer : Number(answer);
  if (!Number.isFinite(n)) return null;
  const score = LIKERT_SCORE[n];
  return typeof score === 'number' ? score : null;
}

const mean = (xs: number[]): number | null =>
  xs.length === 0 ? null : xs.reduce((a, b) => a + b, 0) / xs.length;

/**
 * 구성요소 가중 결합. 응답이 없는 구성요소는 빼고 남은 가중치로 다시 나눈다.
 * (예: 상황판단을 통째로 건너뛴 응답자도 나머지로 점수가 나오게)
 */
function combineSections(parts: { section: Section; value: number | null }[]): number {
  const present = parts.filter((p) => p.value !== null);
  if (present.length === 0) return 0;
  const totalWeight = present.reduce((s, p) => s + SECTION_WEIGHT[p.section], 0);
  const sum = present.reduce((s, p) => s + p.value! * SECTION_WEIGHT[p.section], 0);
  return sum / totalWeight;
}

// ── 채점 ────────────────────────────────────────────────

export function score(items: Item[], answers: Answers): ScoreResult {
  const scored = items.map((item) => ({
    item,
    value: normalizeAnswer(item, answers[item.id]),
  }));

  const answered = scored.filter((s) => s.value !== null);

  // 전체 구성요소 평균 (프로필 판정용)
  const bySection = (s: Section) =>
    mean(answered.filter((x) => x.item.section === s).map((x) => x.value!)) ?? 0;

  const se = bySection('A');
  const sj = bySection('B');
  const bh = bySection('C');

  // 역량별 점수
  const competencies = {} as Record<CompetencyId, CompetencyScore>;
  for (const id of ['U', 'P', 'E', 'R'] as CompetencyId[]) {
    const mine = answered.filter((x) => TAG_TO_COMPETENCY[x.item.tag] === id);
    const avg = (s: Section) => mean(mine.filter((x) => x.item.section === s).map((x) => x.value!));

    const cSe = avg('A');
    const cSj = avg('B');
    const cBh = avg('C');

    competencies[id] = {
      id,
      name: COMPETENCY_NAMES[id],
      se: cSe,
      sj: cSj,
      bh: cBh,
      score: round(
        combineSections([
          { section: 'A', value: cSe },
          { section: 'B', value: cSj },
          { section: 'C', value: cBh },
        ]),
      ),
      answeredItems: mine.length,
    };
  }

  const overall = round(
    (['U', 'P', 'E', 'R'] as CompetencyId[]).reduce(
      (sum, id) => sum + competencies[id].score * COMPETENCY_WEIGHT[id],
      0,
    ),
  );

  const baseLevel = levelOf(overall);
  const { level, capReason } = applyCap(baseLevel, competencies.E.score, competencies.R.score);

  const gapSR = round(se - sj);
  const gapSB = round(sj - bh);

  const missingSections = (['A', 'B', 'C'] as Section[]).filter(
    (s) => answered.filter((x) => x.item.section === s).length === 0,
  );
  const profile = missingSections.length === 0 ? decideProfile({ se, sj, bh, gapSR, gapSB }) : null;

  return {
    se: round(se),
    sj: round(sj),
    bh: round(bh),
    gapSR,
    gapSB,
    competencies,
    overall,
    baseLevel,
    level,
    capReason,
    missingSections,
    profile,
    profileName: profile ? PROFILE_NAMES[profile] : null,
    group: profile ? PROFILE_GROUP[profile] : null,
    groupName: profile ? GROUP_NAMES[PROFILE_GROUP[profile]] : null,
    answeredItems: answered.length,
    totalItems: items.length,
  };
}

export function levelOf(overall: number): Level {
  const band = LEVEL_BANDS.find((b) => overall >= b.min && overall <= b.max);
  return band?.level ?? '입문';
}

/**
 * 상한 제한.
 * 결과를 빨리 만들어내더라도 검증(E)이나 안전(R) 역량이 약하면 상위 등급을
 * 주지 않는다. 종합 점수가 아무리 높아도 이 규칙이 우선한다.
 */
export function applyCap(
  baseLevel: Level,
  e: number,
  r: number,
): { level: Level; capReason: string | null } {
  let cap: Level | null = null;
  let reason: string | null = null;

  if (e < 50 || r < 50) {
    cap = '초급';
    reason = `${e < 50 ? '평가·개선' : '책임·거버넌스'} 점수가 50 미만이라 초급으로 제한`;
  } else if (e < 70 || r < 70) {
    cap = '중급';
    reason = `${e < 70 ? '평가·개선' : '책임·거버넌스'} 점수가 70 미만이라 중급으로 제한`;
  }

  if (cap === null) return { level: baseLevel, capReason: null };

  const capped = LEVEL_ORDER.indexOf(baseLevel) > LEVEL_ORDER.indexOf(cap) ? cap : baseLevel;

  // 원래 등급이 상한보다 낮으면 실제로 깎인 게 없으므로 사유를 남기지 않는다.
  return { level: capped, capReason: capped === baseLevel ? null : reason };
}

/**
 * 프로필 판정. **반드시 이 순서대로** 평가하고, 먼저 맞는 것으로 확정한다.
 * 순서를 바꾸면 결과가 달라진다.
 */
export function decideProfile(m: {
  se: number;
  sj: number;
  bh: number;
  gapSR: number;
  gapSB: number;
}): ProfileId {
  const { se, sj, bh, gapSR, gapSB } = m;

  if (sj >= 70 && bh >= 70 && Math.abs(gapSR) < 12 && Math.abs(gapSB) < 12) {
    return 'BALANCED';
  }
  if (gapSR >= 15 && (sj < 70 || bh < 70)) return 'OVERCONFIDENT';
  if (bh >= 75 && (sj < 65 || bh - sj >= 15)) return 'DOER';
  if (sj >= 75 && (bh < 60 || sj - bh >= 15)) return 'ANALYST';
  if (se < 55 && bh < 55 && sj < 65) return 'CAUTIOUS';
  return 'LEARNER';
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
