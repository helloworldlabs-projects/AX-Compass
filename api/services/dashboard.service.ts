import {
  DashboardOverview,
  DashboardOverviewDto,
  Institution,
  InstitutionDto,
  InstitutionsResponseDto,
} from '@/types/dashboard';
import { apiFetch } from '../client';

const mapInstitution = (dto: InstitutionDto): Institution => ({
  institutionId: dto.institutionId,
  institutionName: dto.institutionName,
  logoUrl: dto.logoUrl,
});

const mapDashboardOverview = (dto: DashboardOverviewDto): DashboardOverview => ({
  participatingInstitutionCount: dto.participatingInstitutionCount,
  totalExamCount: dto.totalExamCount,
  totalExamMinutes: dto.totalExamMinutes,
  totalCostSupport: dto.totalCostSupport,
});

export const dashboardService = {
  fetchInstitutions: async (): Promise<Institution[]> => {
    const response = await apiFetch<InstitutionsResponseDto>('/dashboard/institutions');
    return response.institutions.map(mapInstitution);
  },

  fetchOverview: async (): Promise<DashboardOverview> => {
    const dto = await apiFetch<DashboardOverviewDto>('/dashboard/overview');
    return mapDashboardOverview(dto);
  },
};
