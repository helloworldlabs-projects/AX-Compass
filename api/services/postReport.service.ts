import type { CompanyReport } from '@/lib/admin/report';
import type {
  PublishedReport,
  PublishReportRequestDto,
  ReportDto,
  ReportRecord,
  ReportSummaryDto,
} from '@/types/postReport';
import { apiFetch } from '../client';

const mapReportRecord = (dto: ReportSummaryDto): ReportRecord => ({
  linkId: dto.linkId,
  institutionId: dto.institutionId,
  generatedAt: dto.generatedAt.slice(0, 16),
  issuedOn: dto.generatedAt.slice(0, 10).replace(/-/g, '.'),
  generatedBy: dto.generatedBy,
  revision: dto.revision,
  preRespondents: dto.preRespondents,
  postRespondents: dto.postRespondents,
});

/**
 * 저장해 둔 보고서 전문을 꺼낸다.
 *
 * 객체로 오면 그대로 쓰고, JSON 문자열로 오면 풀어서 쓴다. 한쪽만 받으면
 * 다른 쪽이 왔을 때 **조용히 실패한다** — 화면은 지금 수치로 다시 계산해서
 * 그리므로 멀쩡해 보이지만, 그것은 기업에 건넨 문서가 아니다.
 *
 * 깨져 있으면 null 을 돌려준다. 화면을 막지는 않는다 — 지금 수치로라도
 * 보이는 편이 낫다.
 */
const parseSnapshot = (payload: ReportDto['payload']): CompanyReport | null => {
  if (!payload) return null;
  if (typeof payload !== 'string') return payload;
  try {
    return JSON.parse(payload) as CompanyReport;
  } catch {
    return null;
  }
};

const TOKEN = { tokenKey: 'axcompass:opsToken' } as const;

export const postReportService = {
  // P1 — linkId → 발행 기록
  fetchReportRecords: async (): Promise<Map<number, ReportRecord>> =>
    new Map(
      (await apiFetch<ReportSummaryDto[]>('/ops/reports', TOKEN)).map((dto) => [
        dto.linkId,
        mapReportRecord(dto),
      ]),
    ),

  // P2 — 아직 발행하지 않았으면 404 OPS_102
  fetchReport: async (linkId: number): Promise<PublishedReport> => {
    const dto = await apiFetch<ReportDto>(`/ops/links/${linkId}/report`, TOKEN);
    return { record: mapReportRecord(dto.summary), snapshot: parseSnapshot(dto.payload) };
  },

  // P3 — 처음이면 revision 1, 다시 발행하면 덮어쓰고 revision 을 올린다
  publishReport: async (linkId: number, body: PublishReportRequestDto): Promise<ReportRecord> =>
    mapReportRecord(
      await apiFetch<ReportSummaryDto>(`/ops/links/${linkId}/report`, {
        ...TOKEN,
        method: 'POST',
        body: JSON.stringify(body),
      }),
    ),
};
