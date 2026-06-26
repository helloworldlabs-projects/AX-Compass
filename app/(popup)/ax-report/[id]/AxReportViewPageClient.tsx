'use client';

import { useQuery } from '@tanstack/react-query';
import { Printer } from 'lucide-react';
import { axReportKeys } from '@/api/keys/axReport.keys';
import { axReportService } from '@/api/services/axReport.service';
import { buildAxPageData } from '@/types/ax-report';
import { AxReportPageRenderer } from '../../../../components/ax-report/AxReportPageRenderer';

interface AxReportViewPageClientProps {
  reportId: string;
}

export function AxReportViewPageClient({ reportId }: AxReportViewPageClientProps) {
  const { data: detail, isLoading, isError } = useQuery({
    queryKey: axReportKeys.detail(reportId),
    queryFn: () => axReportService.getReport(reportId),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="txt-b text-gray-400">리포트를 불러오는 중...</span>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="txt-b text-red-400">리포트를 불러올 수 없습니다.</span>
      </div>
    );
  }

  const pageData = buildAxPageData(detail);
  const { institutionName, institutionLogoUrl, departmentLabel: groupLabel } = detail;

  return (
    <div className="mx-auto flex w-full min-w-[1200px] flex-col gap-[30px] print:min-w-0 print:gap-0">
      <div className="border-b border-gray-100 py-[24px] print:hidden">
        <div className="flex items-center justify-between px-[30px]">
          <div className="txt-t1">
            AX 역량 결과 리포트 {groupLabel && <span>[{groupLabel}]</span>}
          </div>
          <button
            className="bg-special-dark-blue-500 flex h-[30px] w-[86px] cursor-pointer items-center justify-center gap-2.5 rounded-[12px] text-white"
            onClick={() => window.print()}
          >
            <Printer className="size-[18px]" />
            <span className="txt-c1-bold">프린트</span>
          </button>
        </div>
      </div>
      <div className="report-print-container mx-auto flex w-[624px] max-w-[624px] min-w-[624px] shrink-0 flex-col gap-[24px] py-[24px]">
        {pageData.map((page, index) => (
          <div
            key={index}
            className="report-print-page rounded-[4px] border border-gray-100"
          >
            <AxReportPageRenderer
              page={page}
              institutionLogoUrl={institutionLogoUrl}
              institutionName={institutionName}
              isLastPage={index === pageData.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
