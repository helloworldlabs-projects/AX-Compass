'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { postReportKeys } from '@/api/keys/postReport.keys';
import { postReportService } from '@/api/services/postReport.service';
import type { CompanyReport } from '@/lib/admin/report';
import { ApiError } from '@/types/common';

/** linkId → 발행 기록 */
export const useReportRecords = () =>
  useQuery({ queryKey: postReportKeys.lists(), queryFn: postReportService.fetchReportRecords });

/** 발행 기록과 전문. 아직 발행하지 않았으면 data = null. */
export const usePublishedReport = (linkId: number) =>
  useQuery({
    queryKey: postReportKeys.detail(linkId),
    queryFn: async () => {
      try {
        return await postReportService.fetchReport(linkId);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404 && e.errorCode === 'OPS_102') return null;
        throw e;
      }
    },
    enabled: Number.isInteger(linkId) && linkId > 0,
  });

/** 방금 계산한 보고서를 그대로 담아 발행한다. 누른 날이 발행일이 된다. */
export const usePublishReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ linkId, report }: { linkId: number; report: CompanyReport }) =>
      postReportService.publishReport(linkId, {
        preRespondents: report.coverage.preN,
        postRespondents: report.coverage.postN,
        payload: report,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postReportKeys.all }),
  });
};
