'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { CompanyReportView } from '@/components/admin/report/CompanyReportView';
import { PrintButton } from '@/components/admin/report/PrintButton';
import { Card, EmptyState, ErrorState, LoadingState, Notice } from '@/components/admin/ui';
import { useCompanyReport } from '@/hooks/useCompanyReport';
import { usePublishedReport } from '@/hooks/usePostReport';
import { usePostResponseCount } from '@/hooks/usePostResponse';
import type { CompanyReport } from '@/lib/admin/report';
import type { ReportRecord } from '@/types/postReport';

const BASE_TITLE = 'AX Compass 교육 전후 종합 보고서';

const back = (
  <Link href="/admin/reports" className="txt-c1-regular text-gray-500 hover:text-gray-900">
    ← 기업 보고서
  </Link>
);

/**
 * 검사 종합 보고서.
 *
 * 주소의 번호는 검사(링크) 번호다 — 한 기업이 사후검사를 여러 번 받을 수 있다.
 *
 * 발행한 보고서는 그때의 내용(payload)을 그대로 그린다. 열 때마다 다시 계산하면,
 * 발행한 뒤에 응답이 하나만 더 들어와도 기업에 건넨 문서와 화면의 수치가 말없이 달라진다.
 * 담아 둔 것이 없으면(전문 저장 이전 발행) 지금 데이터로 계산한다.
 * 발행하지 않은 보고서는 열지 않는다 — 표지에 찍을 발행일이 없다.
 */
export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const linkId = Number(id);
  const published = usePublishedReport(linkId);

  if (!Number.isInteger(linkId) || linkId <= 0) {
    return (
      <>
        {back}
        <EmptyState message="잘못된 보고서 주소입니다." />
      </>
    );
  }

  if (published.isError) {
    return (
      <>
        {back}
        <ErrorState error={published.error} onRetry={() => void published.refetch()} />
      </>
    );
  }

  if (published.isPending) return <LoadingState message="보고서를 불러오는 중…" />;

  if (published.data === null) {
    return (
      <>
        {back}
        <Card>
          <div className="py-8 text-center">
            <p className="txt-st2-bold text-gray-900">아직 발행하지 않았습니다</p>
            <p className="txt-c1-regular mx-auto mt-2.5 max-w-[480px] text-gray-500">
              목록에서 <b className="text-gray-900">생성하기</b>를 눌러 발행해 주세요. 누른 날짜가
              이 보고서의 발행일이 됩니다.
            </p>
          </div>
        </Card>
      </>
    );
  }

  const { record, snapshot } = published.data;
  return snapshot ? (
    <Published r={snapshot} record={record} />
  ) : (
    <LiveReport linkId={linkId} record={record} />
  );
}

/** 전문 없이 발행된 옛 기록. 지금 데이터로 계산해 그린다. */
function LiveReport({ linkId, record }: { linkId: number; record: ReportRecord }) {
  const report = useCompanyReport(linkId);
  const queryClient = useQueryClient();

  if (report.error) {
    return (
      <>
        {back}
        {/* ponytail: useCompanyReport 가 refetch 를 돌려주지 않아 걸린 쿼리를 전부 다시 부른다. */}
        <ErrorState
          error={report.error}
          onRetry={() => queryClient.refetchQueries({ type: 'active' })}
        />
      </>
    );
  }
  if (report.data === undefined) return <LoadingState message="보고서를 계산하는 중…" />;
  if (report.data === null) {
    return (
      <>
        {back}
        <EmptyState message="사전검사 자료가 없어 보고서를 만들 수 없습니다." />
      </>
    );
  }
  return <Published r={report.data} record={record} />;
}

function Published({ r, record }: { r: CompanyReport; record: ReportRecord }) {
  // 발행한 뒤에 응답이 더 들어왔는지만 따로 센다. 보고서 전체를 다시 계산하지 않는다.
  const live = usePostResponseCount(record.linkId).data;

  return (
    <>
      {/* 인쇄로 PDF 를 만들 때 이 제목이 파일 이름이 된다. 기업 이름을 넣어 파일끼리 가려지게 한다. */}
      <title>{`${BASE_TITLE} [${r.link.org}]`}</title>

      <div className="no-print flex items-center justify-between">
        {back}
        <span className="flex items-center gap-3">
          <span className="txt-c2-regular text-gray-500">
            {record.issuedOn} 발행
            {record.revision > 1 && ` · ${record.revision}판`}
          </span>
          <PrintButton />
        </span>
      </div>

      {/* 담당자에게 하는 말이지 기업에 하는 말이 아니라 인쇄물에는 나가지 않는다. */}
      {live !== undefined && live !== record.postRespondents && (
        <div className="no-print">
          <Notice
            bordered
            title={`발행한 뒤에 사후검사 응답이 ${
              live > record.postRespondents
                ? `${live - record.postRespondents}명 늘었습니다`
                : '달라졌습니다'
            }`}
          >
            {record.issuedOn}에 발행할 때는 {record.postRespondents}명이었고 지금은 {live}
            명입니다. 아래 화면은 <b className="text-gray-900">발행 시점의 보고서</b>라 그때 건넨
            문서와 같습니다. 늘어난 응답까지 넣어 새로 전달하려면 목록에서{' '}
            <b className="text-gray-900">다시 생성</b>을 눌러 주세요. 그때 발행일도 함께 새로
            찍힙니다.
          </Notice>
        </div>
      )}

      <CompanyReportView r={r} date={record.issuedOn} />
    </>
  );
}
