import { apiFetch } from '../client';
import type { AxReportDetail, AxReportStatusResponse } from '@/types/axReport';

export const axReportService = {
  getReport: (): Promise<AxReportDetail> =>
    apiFetch<AxReportDetail>(`/ax-reports/current`, {
      tokenKey: 'axcompass:adminToken',
    }),

  getReportStatus: (): Promise<AxReportStatusResponse> =>
    apiFetch<AxReportStatusResponse>(`/ax-reports/status`, {
      tokenKey: 'axcompass:adminToken',
    }),

  postReportRequest: (): Promise<void> =>
    apiFetch<void>(`/ax-reports`, {
      method: 'POST',
      tokenKey: 'axcompass:adminToken',
    }),
};
