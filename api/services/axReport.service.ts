import { apiFetch } from '../client';
import type { AxReportDetail } from '@/types/axReport';

export const axReportService = {
  getReport: (): Promise<AxReportDetail> =>
    apiFetch<AxReportDetail>(`/ax-reports/current`, {
      tokenKey: 'axcompass:adminToken',
    }),
};
