'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { CompanyReportView } from '@/components/admin/report/CompanyReportView';
import { PrintButton } from '@/components/admin/report/PrintButton';
import { Card, EmptyState, ErrorState, LoadingState, Notice } from '@/components/admin/ui';
import { useCompanyReport } from '@/hooks/useCompanyReport';
import { usePublishedReport } from '@/hooks/usePostReport';
import { usePostResponseCount, useRawPostResponses } from '@/hooks/usePostResponse';
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
  /*
    key 를 검사 번호로 둔다. 같은 라우트 안에서 보고서를 옮겨 다니면 React 가
    컴포넌트를 그대로 재사용해, 앞 보고서에서 끈 "소속 차이 분석"이 다음
    보고서까지 꺼진 채로 따라온다. 보고서가 바뀌면 상태도 다시 잡는다.
  */
  return snapshot ? (
    <Published key={linkId} r={snapshot} record={record} />
  ) : (
    <LiveReport key={linkId} linkId={linkId} record={record} />
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
  /*
    발행한 뒤에 무엇이 달라졌는지 센다. 보고서 전체를 다시 계산하지 않는다.

    응답 수만으로는 모자라다. 사전검사 매칭이 달라지면 행 수는 그대로인 채
    "같은 사람끼리 비교"의 인원과 수치가 움직인다.
  */
  const live = usePostResponseCount(record.linkId).data;
  const rawRows = useRawPostResponses(record.linkId).data;
  const liveMatched = rawRows?.filter((x) => x.preUserId !== null).length;

  /*
    소속 차이 분석을 실을지 말지.

    부서가 너무 적거나 인원이 모자라면 이 장은 "분석하지 못했습니다"와 빈 표만
    남는다. 기업에 건네는 문서에 그런 쪽을 넣을 이유가 없으므로 뺄 수 있게 한다.
    보여 주는 방식만 바꾸므로 저장된 보고서는 건드리지 않는다 — 어느 쪽을 건넬지
    고르는 일 때문에 발행일과 판이 움직여서는 안 된다.
  */
  const [showManova, setShowManova] = useState(r.department.manovaPost.usable);

  const changes: { headline: string; detail: string }[] = [];
  if (live !== undefined && live !== record.postRespondents) {
    changes.push({
      headline:
        live > record.postRespondents
          ? `사후검사 응답이 ${live - record.postRespondents}명 늘었습니다`
          : '사후검사 응답이 달라졌습니다',
      detail: `응답은 발행할 때 ${record.postRespondents}명이었고 지금은 ${live}명입니다.`,
    });
  }
  if (liveMatched !== undefined && liveMatched !== r.coverage.matchedN) {
    changes.push({
      headline: '사전검사 매칭이 달라졌습니다',
      detail: `사전검사와 이어진 사람은 발행할 때 ${r.coverage.matchedN}명이었고 지금은 ${liveMatched}명입니다. 같은 사람끼리 비교가 이 인원으로 나옵니다.`,
    });
  }

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
          {/*
            어느 쪽을 건넬지 여기서 고른다. 저장된 보고서는 그대로 두고 보여
            주는 방식만 바꾸므로, 몇 번을 오가도 발행일과 판은 움직이지 않는다.
          */}
          <button
            type="button"
            onClick={() => setShowManova((v) => !v)}
            className="txt-c1-bold hover:border-adm-brand hover:text-adm-brand flex h-10 items-center rounded-[8px] border border-gray-200 px-4 text-gray-500 transition"
          >
            {showManova ? '소속 차이 분석 빼고 보기' : '소속 차이 분석 넣어 보기'}
          </button>
          <PrintButton />
        </span>
      </div>

      {!showManova && (
        <div className="no-print">
          <Notice bordered title="소속 차이 분석을 뺀 상태입니다">
            뒤 장 번호가 한 칸씩 당겨져, 받는 쪽에는 처음부터 없던 장으로 보입니다. 읽는
            기준표에서도 그 줄이 빠집니다. 저장된 보고서는 그대로이므로 발행일과 판은 바뀌지
            않습니다.
          </Notice>
        </div>
      )}

      {/* 담당자에게 하는 말이지 기업에 하는 말이 아니라 인쇄물에는 나가지 않는다. */}
      {changes.length > 0 && (
        <div className="no-print">
          <Notice bordered title={`발행한 뒤에 ${changes.map((c) => c.headline).join(', ')}`}>
            {changes.map((c) => c.detail).join(' ')} 아래 화면은{' '}
            <b className="text-gray-900">발행 시점의 보고서</b>라 그때 건넨 문서와 같습니다. 지금
            상태로 새로 전달하려면 목록에서 <b className="text-gray-900">다시 생성</b>을 눌러
            주세요. 그때 발행일도 함께 새로 찍힙니다.
          </Notice>
        </div>
      )}

      <CompanyReportView r={r} date={record.issuedOn} showManova={showManova} />
    </>
  );
}
