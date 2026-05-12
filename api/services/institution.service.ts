import { apiFetch, apiFetchPaginated } from '../client';
import type {
  BulkRegisterMember,
  BulkRegisterResponse,
  ExecutiveListDTO,
  ExecutiveListParams,
  InstitutionStats,
  InstitutionStatsDTO,
  MemberListDTO,
  MemberListParams,
  MemberPageInfo,
} from '@/types/institution';

function mapInstitutionStats(dto: InstitutionStatsDTO): InstitutionStats {
  return dto;
}

export const institutionService = {
  getStats: async (departments?: string[]): Promise<InstitutionStats> => {
    const query = new URLSearchParams();
    departments?.forEach((d) => query.append('departments', d));
    const qs = query.toString();
    const dto = await apiFetch<InstitutionStatsDTO>(`/institutions/stats${qs ? `?${qs}` : ''}`, {
      tokenKey: 'axcompass:adminToken',
    });
    return mapInstitutionStats(dto);
  },

  getMembers: async (params: MemberListParams): Promise<MemberListDTO> => {
    const query = new URLSearchParams();
    if (params.keyword) query.set('keyword', params.keyword);
    if (params.examCompleted !== undefined)
      query.set('examCompleted', String(params.examCompleted));
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));

    const qs = query.toString();
    const { data, pagination } = await apiFetchPaginated<Omit<MemberListDTO, 'pagination'>, MemberPageInfo>(
      `/members${qs ? `?${qs}` : ''}`,
      { tokenKey: 'axcompass:adminToken' },
    );
    return { ...data, pagination };
  },

  deleteMember: async (memberId: number): Promise<void> => {
    return apiFetch<void>(`/members/${memberId}`, {
      tokenKey: 'axcompass:adminToken',
      method: 'DELETE',
    });
  },

  getExecutives: async (params: ExecutiveListParams): Promise<ExecutiveListDTO> => {
    const query = new URLSearchParams();
    if (params.keyword) query.set('keyword', params.keyword);
    if (params.examCompleted !== undefined)
      query.set('examCompleted', String(params.examCompleted));
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));

    const qs = query.toString();
    const { data, pagination } = await apiFetchPaginated<Omit<ExecutiveListDTO, 'pagination'>, MemberPageInfo>(
      `/executives${qs ? `?${qs}` : ''}`,
      { tokenKey: 'axcompass:adminToken' },
    );
    return { ...data, pagination };
  },

  deleteExecutive: async (executiveId: number): Promise<void> => {
    return apiFetch<void>(`/executives/${executiveId}`, {
      tokenKey: 'axcompass:adminToken',
      method: 'DELETE',
    });
  },

  bulkRegisterMembers: async (members: BulkRegisterMember[]): Promise<BulkRegisterResponse> => {
    return apiFetch<BulkRegisterResponse>('/members/bulk', {
      tokenKey: 'axcompass:adminToken',
      method: 'POST',
      body: JSON.stringify({ members }),
    });
  },

  bulkRegisterExecutives: async (members: BulkRegisterMember[]): Promise<BulkRegisterResponse> => {
    return apiFetch<BulkRegisterResponse>('/executives/bulk', {
      tokenKey: 'axcompass:adminToken',
      method: 'POST',
      body: JSON.stringify({ executives: members }),
    });
  },
};
