/**
 * 사전검사(axcompass.ts)·만족도(safarion.ts)에서 가져온 순수 헬퍼와 상수.
 * 데이터 조회는 api/services/reference.service.ts 가 맡는다.
 */
import type { Cohort, PreOrg } from '@/types/reference';

/** 팀 단위로 단독 표기하는 최소 인원. 이보다 적으면 개인이 드러난다. */
export const MIN_GROUP_SIZE = 5;

/* ── 구성원 역량 ─────────────────────────────────────────── */

export const MEMBER_COMPETENCIES = [
  { code: 'UNDERSTAND', short: '이해' },
  { code: 'USE_AND_APPLY', short: '활용' },
  { code: 'EVALUATE', short: '평가' },
  { code: 'RESPONSIBLE', short: '책임' },
] as const;

export type MemberCompetency = (typeof MEMBER_COMPETENCIES)[number]['code'];

/** 성숙도 단계. 설계 시트 "성숙도 개요" stage 표가 원본이다. */
export const MATURITY_STAGE: Record<string, string> = {
  INITIATION: '도입',
  UTILIZATION: '활용',
  INTEGRATION: '통합',
  INNOVATION: '혁신',
};

/** 사전검사 레벨 코드 → 이름. */
export const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: '입문',
  ELEMENTARY: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

/** 100점 만점 점수는 소수 한 자리로 통일한다. 만족도는 rating() 을 쓴다. */
export function score(v: number | null): string {
  return v === null ? '—' : v.toFixed(1);
}

/**
 * 만족도 점수 표기. 5점 만점이라 소수 **둘째** 자리로 맞춘다.
 *
 * 포맷 없이 찍으면 값이 딱 떨어질 때 자리가 사라져 `3` 과 `4.17` 이 한 표에
 * 섞인다. tabular-nums 를 걸어 둔 자리라 자릿수가 어긋나면 표가 틀어져 보인다.
 * 100점 만점인 score() 와 만점이 달라 함수를 따로 둔다.
 */
export function rating(v: number | null | undefined): string {
  return v === null || v === undefined ? '—' : v.toFixed(2);
}

/** 50 / 70 / 90 구간. 평균에 구간을 적용한 값이지 개인 분포가 아니다. */
function band<T extends string>(v: number | null, labels: [T, T, T, T]): T | null {
  if (v === null) return null;
  if (v < 50) return labels[0];
  if (v < 70) return labels[1];
  if (v < 90) return labels[2];
  return labels[3];
}

/** 구성원 역량 수준. */
export function levelOf(v: number | null): string | null {
  return band(v, ['입문', '초급', '중급', '고급']);
}

/** 기업 AX 성숙도 수준. */
export function stageOf(v: number | null): string | null {
  return band(v, ['도입', '활용', '통합', '혁신']);
}

export function orgLabel(org: PreOrg): string {
  return org.name ?? `기관 ${org.institutionId}`;
}

/* ── 만족도 지표 ─────────────────────────────────────────── */

export const METRICS = [
  { code: 'CONTENT', label: '콘텐츠' },
  { code: 'LECTURE', label: '강사' },
  { code: 'OPERATION', label: '운영' },
  { code: 'PRACTICE', label: '실습' },
  { code: 'PRACTICAL_APPLICATION', label: '현업 적용' },
  { code: 'LEARNING_EXPERIENCE', label: '학습 경험' },
] as const;

export type MetricCode = (typeof METRICS)[number]['code'];

export const SCALE_MAX = 5;

/** 지표 평균의 평균. 수집된 지표만 센다. */
export function overallScore(c: Cohort): number | null {
  const values = METRICS.map((m) => c.scores[m.code]).filter(
    (v): v is number => typeof v === 'number' && v > 0,
  );
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

/** 가장 낮은 지표. 전부 만점이거나 전부 같으면 없다(고를 근거가 없다). */
export function weakestMetric(c: Cohort) {
  const scored = METRICS.filter((m) => (c.scores[m.code] ?? 0) > 0);
  if (scored.length === 0) return null;

  const values = scored.map((m) => c.scores[m.code] ?? 0);
  const lowest = Math.min(...values);
  if (lowest >= SCALE_MAX) return null;
  if (lowest === Math.max(...values)) return null;

  return scored.reduce((lo, m) => ((c.scores[m.code] ?? 0) < (c.scores[lo.code] ?? 0) ? m : lo));
}

/** 응답률. 등록 인원이 0 이면 계산하지 않는다. */
export function responseRate(c: Cohort): number | null {
  if (c.enrolled === 0) return null;
  return Math.round((c.respondents / c.enrolled) * 100);
}

/** 차수 번호가 없는 회차는 단건 운영이다. */
export function cohortLabel(c: Cohort): string {
  return c.cohortNumber ? `${c.cohortNumber}기` : '단건 운영';
}

export function hasSatisfaction(c: Cohort): boolean {
  return Object.keys(c.scores).length > 0;
}

const EDUCATION_TYPE_NAMES: Record<string, string> = {
  OFFLINE: '집합 교육',
  ONLINE: '온라인 교육',
  BLENDED: '집합 · 온라인 병행',
};

export function educationTypeName(t: string | null): string {
  return t === null ? '—' : (EDUCATION_TYPE_NAMES[t] ?? t);
}

/* ── 날짜 ────────────────────────────────────────────────── */

/** 오늘 날짜(한국시간) — `YYYY-MM-DD`. 마감일 비교의 기준이다. */
export function todayKST(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
