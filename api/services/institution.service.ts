import { apiFetch } from '../client';
import type { InstitutionStats, InstitutionStatsDTO } from '@/types/institution';

function mapInstitutionStats(dto: InstitutionStatsDTO): InstitutionStats {
  return dto;
}

export const institutionService = {
  getStats: async (): Promise<InstitutionStats> => {
    const dto = await apiFetch<InstitutionStatsDTO>('/institutions/stats', {
      tokenKey: 'axcompass:adminToken',
    });
    return mapInstitutionStats(dto);
  },
};
