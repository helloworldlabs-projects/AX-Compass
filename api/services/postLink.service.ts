import type {
  ExamLink,
  ExamLinkDto,
  ExtendLinkRequestDto,
  IssueLinkRequestDto,
  PublicLink,
  PublicLinkDto,
} from '@/types/postLink';
import { todayKST } from '@/lib/admin/metrics';
import { apiFetch } from '../client';

export const mapExamLink = (dto: ExamLinkDto): ExamLink => {
  // 닫힌 링크뿐 아니라 마감일이 지난 링크도 응시할 수 없다.
  const closed = dto.status === 'closed' || dto.dueOn < todayKST();
  return {
    id: dto.linkId,
    institutionId: dto.institutionId,
    code: dto.safarionCode,
    org: dto.orgName,
    slug: dto.slug,
    course: dto.courseTitle,
    dueOn: dto.dueOn,
    issuedAt: dto.issuedAt.slice(0, 10),
    status: closed ? '마감' : '진행중',
    closed,
    // 마감일이 지난 것과 운영자가 거둔 것을 가른다. 화면에서 버튼이 달라진다.
    withdrawn: dto.status === 'closed',
    closedOn: dto.closedAt?.slice(0, 10) ?? null,
    closedBy: dto.closedBy,
    offerings: dto.offerings,
  };
};

const mapPublicLink = (dto: PublicLinkDto): PublicLink => ({
  slug: dto.slug,
  org: dto.orgName,
  course: dto.courseTitle,
  dueOn: dto.dueOn,
  // 닫혔거나 마감일이 지났으면 받지 않는다.
  closed: !dto.accepting,
});

const TOKEN = { tokenKey: 'axcompass:opsToken' } as const;

export const postLinkService = {
  // L1 — 발급 최신순
  fetchPostLinks: async (): Promise<ExamLink[]> =>
    (await apiFetch<ExamLinkDto[]>('/ops/links', TOKEN)).map(mapExamLink),

  // L2 — 없으면 404 OPS_101
  fetchPostLink: async (linkId: number): Promise<ExamLink> =>
    mapExamLink(await apiFetch<ExamLinkDto>(`/ops/links/${linkId}`, TOKEN)),

  // L6 — 공개, 토큰 없음. 없는 slug 는 404
  fetchPublicLink: async (slug: string): Promise<PublicLink> =>
    mapPublicLink(await apiFetch<PublicLinkDto>(`/public/links/${encodeURIComponent(slug)}`)),

  // L4 — slug 를 비우면 서버가 만든다. 400 OPS_003·007 · 409 OPS_201
  createPostLink: async (body: IssueLinkRequestDto): Promise<ExamLink> =>
    mapExamLink(
      await apiFetch<ExamLinkDto>('/ops/links', {
        ...TOKEN,
        method: 'POST',
        body: JSON.stringify(body),
      }),
    ),

  // L5 — 행을 지우지 않고 status=closed. 이미 마감이면 그대로
  closePostLink: async (linkId: number): Promise<ExamLink> =>
    mapExamLink(
      await apiFetch<ExamLinkDto>(`/ops/links/${linkId}/close`, { ...TOKEN, method: 'POST' }),
    ),

  /*
    L6 — 마감일 연장·재개. 아직 백엔드에 없다. 화면은
    lib/admin/pending-api.ts 의 LINK_EXTEND_READY 로 잠가 두었다.

    경로가 POST /ops/links/{linkId}/extend 로 정해지면 여기만 고치면 된다.
    요청서: docs/local/RESPONSE-LINK-EDIT-REQUEST.md
  */
  extendPostLink: async (linkId: number, body: ExtendLinkRequestDto): Promise<ExamLink> =>
    mapExamLink(
      await apiFetch<ExamLinkDto>(`/ops/links/${linkId}`, {
        ...TOKEN,
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    ),
};
