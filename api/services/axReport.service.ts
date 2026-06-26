import { apiFetch } from '../client';
import type { AxReportDetail } from '@/types/axReport';

export const axReportService = {
  getReport: (reportId: string): Promise<AxReportDetail> =>
    apiFetch<AxReportDetail>(`/ax-reports/${reportId}`, {
      tokenKey: 'axcompass:adminToken',
    }),
};
