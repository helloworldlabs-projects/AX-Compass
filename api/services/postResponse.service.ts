import type {
  CheckNameResponseDto,
  PostResponseDto,
  RematchResponseDto,
  RematchResult,
  ResponseCountDto,
  StoredPostResponse,
  SubmitPostResponseRequestDto,
  SubmitPostResponseResponseDto,
  TagAverageDto,
} from '@/types/postResponse';
import type { ProfileId } from '@/lib/admin/ax-scoring';
import { apiFetch } from '../client';

// 역량 기호(U/P/E/R)를 사전검사 쪽 이름에 맞춘다. 빈 점수는 0 (원본 responsesOf 와 같다).
const mapStoredPostResponse = (dto: PostResponseDto): StoredPostResponse => ({
  id: String(dto.responseId),
  name: dto.name,
  department: dto.department,
  preUserId: dto.preUserId,
  submittedAt: dto.submittedAt.slice(0, 16),
  post: {
    total: dto.overall,
    sections: { A: dto.sections.A ?? 0, B: dto.sections.B ?? 0, C: dto.sections.C ?? 0 },
    competencies: {
      UNDERSTAND: dto.competencies.U ?? 0,
      USE_AND_APPLY: dto.competencies.P ?? 0,
      EVALUATE: dto.competencies.E ?? 0,
      RESPONSIBLE: dto.competencies.R ?? 0,
    },
  },
  profile: dto.profile as ProfileId | null,
});

const round1 = (v: number) => Math.round(v * 10) / 10;

const slugPath = (slug: string) => `/public/links/${encodeURIComponent(slug)}`;
const TOKEN = { tokenKey: 'axcompass:opsToken' } as const;

export const postResponseService = {
  // R2 — 공개. 404 없는 slug · 409 마감(OPS_202)/같은 이름(OPS_203) · 400 빈 이름·중복 문항
  createPostResponse: async (slug: string, body: SubmitPostResponseRequestDto): Promise<number> => {
    const dto = await apiFetch<SubmitPostResponseResponseDto>(`${slugPath(slug)}/responses`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return dto.responseId;
  },

  // R1 — 공개. 이 이름으로 이미 냈는가
  checkPostResponseName: async (slug: string, name: string): Promise<boolean> => {
    const dto = await apiFetch<CheckNameResponseDto>(`${slugPath(slug)}/check-name`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return dto.taken;
  },

  // R3 — 제출 순. 점수 포함
  fetchPostResponses: async (linkId: number): Promise<StoredPostResponse[]> =>
    (await apiFetch<PostResponseDto[]>(`/ops/links/${linkId}/responses`, TOKEN)).map(
      mapStoredPostResponse,
    ),

  // R4 — 보고서 발행 당시 인원과 견주어 "새 응답" 경고
  fetchPostResponseCount: async (linkId: number): Promise<number> =>
    (await apiFetch<ResponseCountDto>(`/ops/links/${linkId}/responses/count`, TOKEN)).count,

  // R5 — linkId → 응답 수
  fetchPostResponseCounts: async (): Promise<Map<number, number>> =>
    new Map(
      (await apiFetch<ResponseCountDto[]>('/ops/responses/counts', TOKEN)).map((c) => [
        c.linkId,
        c.count,
      ]),
    ),

  // R6 — 하위 역량(a~l)별 평균. 서버는 소수 둘째 자리, 원본 보고서는 첫째 자리라 다시 반올림한다.
  // ponytail: 두 번 반올림이라 x.x5 경계에서 0.1 어긋날 수 있다. 문제 되면 R3 의 tags 로 직접 평균.
  fetchTagAverages: async (linkId: number): Promise<Record<string, number>> =>
    Object.fromEntries(
      (await apiFetch<TagAverageDto[]>(`/ops/links/${linkId}/tag-averages`, TOKEN)).map((t) => [
        t.code,
        round1(t.average),
      ]),
    ),

  // P4 — 링크의 응답 전부를 지금의 사전검사 명단으로 다시 맞춘다
  rematchPostResponses: async (linkId: number): Promise<RematchResult> =>
    apiFetch<RematchResponseDto>(`/ops/links/${linkId}/responses/rematch`, {
      ...TOKEN,
      method: 'POST',
    }),
};
