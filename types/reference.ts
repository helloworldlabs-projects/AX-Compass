/**
 * 참조 데이터(SafariOn 교육 운영·만족도 + AX Compass 사전검사) 16개 엔드포인트.
 * 원본 명세: AX_Compass_after/docs/API-SPEC.md
 *
 * 명세의 응답 모양이 곧 화면이 쓰는 모양이라 Domain Model 은 DTO 와 1:1 이다.
 */
import type { MemberCompetency, MetricCode } from '@/lib/admin/metrics';

// ─── DTO — 백엔드 raw ───────────────────────────────────────────────────────

export interface InstitutionDto {
  id: number;
  code: string | null;
  name: string;
  /** 영문명. 사후검사 주소(/after/{영문명})에 쓴다. */
  englishName: string | null;
}

export type InstitutionRole = '운영 기관' | '학습 기업';

export interface InstitutionSatisfactionDto {
  institutionId: number;
  cohorts: number;
  respondents: number;
  mean: number | null;
  roles: InstitutionRole[];
}

export interface MetricAverageDto {
  code: MetricCode;
  label: string;
  mean: number | null;
  answers: number;
}

export interface InstitutionCohortDto {
  offeringId: string;
  title: string;
  cohortNumber: number | null;
  startDate: string | null;
  endDate: string | null;
  enrolled: number;
  respondents: number;
  role: InstitutionRole;
  mean: number | null;
}

export interface CohortDto {
  offeringId: string;
  programTitle: string;
  cohortNumber: number | null;
  category: string | null;
  startDate: string | null;
  endDate: string | null;
  operationStatus: 'PREPARING' | 'IN_OPERATION' | 'COMPLETED' | null;
  surveyEnabled: boolean;
  operator: string | null;
  orgs: string[];
  enrolled: number;
  respondents: number;
  lastSubmittedAt: string | null;
  scores: Partial<Record<MetricCode, number>>;
}

export interface OfferingForIssueDto {
  offeringId: string;
  title: string;
  cohortNumber: number | null;
  startDate: string | null;
  endDate: string | null;
  enrolled: number;
  respondents: number;
  mean: number | null;
  operatorId: number;
  operatorName: string;
  learningCompanyIds: number[];
}

export interface QuestionResultDto {
  questionId: string;
  content: string;
  metric: MetricCode | null;
  order: number;
  mean: number;
  answers: number;
  /** 1~5 별점별 응답 수 */
  distribution: [number, number, number, number, number];
}

export interface FreeTextQuestionDto {
  questionId: string;
  content: string;
  metric: string | null;
  order: number;
  answers: { text: string; submittedAt: string | null; valid: boolean | null }[];
}

export interface QuestionBundleDto {
  stars: QuestionResultDto[];
  freeText: FreeTextQuestionDto[];
}

export interface CourseOverviewDto {
  offeringId: string;
  title: string;
  description: string | null;
  goal: string | null;
  categoryName: string | null;
  educationType: 'OFFLINE' | 'ONLINE' | 'BLENDED' | null;
  trainingDays: number | null;
  trainingHours: number | null;
  startDate: string | null;
  endDate: string | null;
  lessons: { date: string; start: string | null; end: string | null }[];
  modules: string[];
}

export interface ChoiceQuestionDto {
  questionId: string;
  content: string;
  metric: string | null;
  order: number;
  respondents: number;
  options: { order: number; text: string; count: number; share: number }[];
}

export interface PreOrgDto {
  institutionId: number;
  code: string | null;
  name: string | null;
  respondents: number;
  departments: number;
  avgScore: number | null;
  byCompetency: Record<MemberCompetency, number | null>;
  /** YYYY-MM-DD */
  lastAt: string | null;
  executives: number;
  maturityCurrent: number | null;
  maturityTarget: number | null;
}

export interface PreOrgDetailDto {
  org: PreOrgDto;
  sections: { name: string; component: string; weight: number | null; avg: number | null }[];
  competencies: {
    code: string;
    name: string;
    weight: number | null;
    avg: number | null;
    tags: { code: string; name: string; avg: number | null }[];
  }[];
  levels: { level: string; n: number }[];
  profiles: { type: string; group: string; n: number }[];
  departments: {
    name: string;
    n: number;
    avg: number | null;
    small: boolean;
    byCompetency: Record<MemberCompetency, number | null>;
    maturity: { n: number; current: number | null; target: number | null } | null;
  }[];
  suppressed: { departments: number; respondents: number };
  maturity: {
    competencies: { code: string; name: string; current: number | null; target: number | null }[];
  };
}

export interface PreMemberDto {
  userId: number;
  name: string;
  /** 공백 제거 + 소문자. 사후 응답과 맞대는 열쇠 */
  nameKey: string;
  department: string | null;
  total: number | null;
  level: string | null;
  profile: string | null;
  group: string | null;
  sections: Record<'A' | 'B' | 'C', number | null>;
  competencies: Record<MemberCompetency, number | null>;
}

export interface NameHitDto {
  institutionId: number;
  code: string | null;
  org: string | null;
  department: string | null;
  exact: boolean;
}

// POST /offerings/* 공통 요청 본문
export interface OfferingIdsRequestDto {
  offeringIds: string[];
}

export interface PreMatchRequestDto {
  name: string;
}

// ─── Domain Model — UI 소비용 (명세 = 도메인, 1:1) ──────────────────────────

export type Institution = InstitutionDto;
export type InstitutionSatisfaction = InstitutionSatisfactionDto;
export type MetricAverage = MetricAverageDto;
export type InstitutionCohort = InstitutionCohortDto;
export type Cohort = CohortDto;
export type OfferingForIssue = OfferingForIssueDto;
export type QuestionResult = QuestionResultDto;
export type FreeTextQuestion = FreeTextQuestionDto;
export type QuestionBundle = QuestionBundleDto;
export type CourseOverview = CourseOverviewDto;
export type ChoiceQuestion = ChoiceQuestionDto;
export type PreOrg = PreOrgDto;
export type PreOrgDetail = PreOrgDetailDto;
export type PreMember = PreMemberDto;
export type NameHit = NameHitDto;
