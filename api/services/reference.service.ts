import { ApiError } from '@/types/common';
import type {
  ChoiceQuestion,
  ChoiceQuestionDto,
  Cohort,
  CohortDto,
  CourseOverview,
  CourseOverviewDto,
  Institution,
  InstitutionCohort,
  InstitutionCohortDto,
  InstitutionDto,
  InstitutionSatisfaction,
  InstitutionSatisfactionDto,
  MetricAverage,
  MetricAverageDto,
  NameHit,
  NameHitDto,
  OfferingForIssue,
  OfferingForIssueDto,
  OfferingIdsRequestDto,
  PreMatchRequestDto,
  PreMember,
  PreMemberDto,
  PreOrg,
  PreOrgDetail,
  PreOrgDetailDto,
  PreOrgDto,
  QuestionBundle,
  QuestionBundleDto,
} from '@/types/reference';
import { METRICS } from '@/lib/admin/metrics';
import { apiFetch } from '../client';

// 참조 데이터 16개 — 경로·필드는 백엔드 Swagger '06. 사후 평가' 와 일치.
// 명세 = 도메인이라 매핑은 1:1 이다.
const mapInstitution = (dto: InstitutionDto): Institution => dto;
const mapInstitutionSatisfaction = (dto: InstitutionSatisfactionDto): InstitutionSatisfaction =>
  dto;
const mapMetricAverage = (dto: MetricAverageDto): MetricAverage => dto;
const mapInstitutionCohort = (dto: InstitutionCohortDto): InstitutionCohort => dto;
const mapCohort = (dto: CohortDto): Cohort => dto;
const mapOfferingForIssue = (dto: OfferingForIssueDto): OfferingForIssue => dto;
const mapQuestionBundle = (dto: QuestionBundleDto): QuestionBundle => dto;
const mapCourseOverview = (dto: CourseOverviewDto): CourseOverview => dto;
const mapChoiceQuestion = (dto: ChoiceQuestionDto): ChoiceQuestion => dto;
const mapPreOrg = (dto: PreOrgDto): PreOrg => dto;
const mapPreOrgDetail = (dto: PreOrgDetailDto): PreOrgDetail => dto;
const mapPreMember = (dto: PreMemberDto): PreMember => dto;
const mapNameHit = (dto: NameHitDto): NameHit => dto;

const TOKEN = { tokenKey: 'axcompass:opsToken' } as const;

const get = <T>(path: string) => apiFetch<T>(path, TOKEN);
const post = <T>(path: string, body: OfferingIdsRequestDto | PreMatchRequestDto) =>
  apiFetch<T>(path, { ...TOKEN, method: 'POST', body: JSON.stringify(body) });

const EMPTY_METRICS: MetricAverage[] = METRICS.map((m) => ({
  code: m.code,
  label: m.label,
  mean: null,
  answers: 0,
}));

export const referenceService = {
  // 1
  fetchInstitutions: async (): Promise<Institution[]> =>
    (await get<InstitutionDto[]>('/institutions')).map(mapInstitution),

  // 2
  fetchInstitutionSatisfactions: async (): Promise<InstitutionSatisfaction[]> =>
    (await get<InstitutionSatisfactionDto[]>('/institutions/satisfaction')).map(
      mapInstitutionSatisfaction,
    ),

  // 3 — 학습 기업 이름
  fetchLearningCompanies: (institutionId: number): Promise<string[]> =>
    get<string[]>(`/institutions/${institutionId}/companies`),

  // 4
  fetchInstitutionMetrics: async (institutionId: number): Promise<MetricAverage[]> =>
    (await get<MetricAverageDto[]>(`/institutions/${institutionId}/satisfaction`)).map(
      mapMetricAverage,
    ),

  // 5
  fetchInstitutionCohorts: async (institutionId: number): Promise<InstitutionCohort[]> =>
    (await get<InstitutionCohortDto[]>(`/institutions/${institutionId}/cohorts`)).map(
      mapInstitutionCohort,
    ),

  // 6
  fetchCohorts: async (): Promise<Cohort[]> => (await get<CohortDto[]>('/cohorts')).map(mapCohort),

  // 7
  fetchOfferingsForIssue: async (): Promise<OfferingForIssue[]> =>
    (await get<OfferingForIssueDto[]>('/offerings/for-issue')).map(mapOfferingForIssue),

  // 8
  fetchOfferingQuestions: async (offeringId: string): Promise<QuestionBundle> =>
    mapQuestionBundle(await get<QuestionBundleDto>(`/offerings/${offeringId}/questions`)),

  // 9~12 — 회차가 없으면 부르지 않고 빈 값 (명세 3.9)
  fetchOfferingsMetrics: async (offeringIds: string[]): Promise<MetricAverage[]> => {
    if (offeringIds.length === 0) return EMPTY_METRICS;
    return (await post<MetricAverageDto[]>('/offerings/satisfaction', { offeringIds })).map(
      mapMetricAverage,
    );
  },

  fetchCourseOverviews: async (offeringIds: string[]): Promise<CourseOverview[]> => {
    if (offeringIds.length === 0) return [];
    return (await post<CourseOverviewDto[]>('/offerings/curriculum', { offeringIds })).map(
      mapCourseOverview,
    );
  },

  fetchOfferingsQuestions: async (offeringIds: string[]): Promise<QuestionBundle> => {
    if (offeringIds.length === 0) return { stars: [], freeText: [] };
    return mapQuestionBundle(
      await post<QuestionBundleDto>('/offerings/questions', { offeringIds }),
    );
  },

  fetchOfferingsChoices: async (offeringIds: string[]): Promise<ChoiceQuestion[]> => {
    if (offeringIds.length === 0) return [];
    return (await post<ChoiceQuestionDto[]>('/offerings/choices', { offeringIds })).map(
      mapChoiceQuestion,
    );
  },

  // 13
  fetchPreOrgs: async (): Promise<PreOrg[]> => (await get<PreOrgDto[]>('/pre/orgs')).map(mapPreOrg),

  // 14 — 없는 기관(404)만 null. 나머지 오류는 그대로 올린다.
  fetchPreOrg: async (institutionId: number): Promise<PreOrgDetail | null> => {
    try {
      return mapPreOrgDetail(await get<PreOrgDetailDto>(`/pre/orgs/${institutionId}`));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  },

  // 15 — 개인 이름 포함
  fetchPreMembers: async (institutionId: number): Promise<PreMember[]> =>
    (await get<PreMemberDto[]>(`/pre/orgs/${institutionId}/members`)).map(mapPreMember),

  // 16 — 이름이 접근 로그에 남지 않게 POST
  fetchPreNameHits: async (name: string): Promise<NameHit[]> => {
    if (name.replace(/\s+/g, '').length === 0) return [];
    return (await post<NameHitDto[]>('/pre/match', { name })).map(mapNameHit);
  },
};
