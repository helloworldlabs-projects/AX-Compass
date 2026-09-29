'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/admin/ui';
import { refetchCompanyReportSources, useCompanyReport } from '@/hooks/useCompanyReport';
import { usePublishReport } from '@/hooks/usePostReport';
import { getApiErrorDetail } from '@/types/common';
import type { ExamLink } from '@/types/postLink';

/**
 * 보고서 발행.
 *
 * 누른 날짜가 그 보고서의 발행일이 된다. 다시 누르면 날짜가 새로 쓰이고 판이 하나
 * 올라가므로, 이미 발행한 보고서에는 한 번 묻는다 — 기업에 건넨 문서와 날짜가
 * 어긋나면 어느 쪽을 받았는지 확인할 길이 없다.
 *
 * 보고서 계산은 무거워서 누른 뒤에만 한다(Publisher 를 그때 붙인다). 계산 전에 캐시를 지금 값으로
 * 다시 받는다 — 목록을 열어 둔 사이 들어온 응답이 발행본에서 빠지면 안 된다.
 */
export function GenerateButton({
  link,
  issuedOn,
}: {
  /** 보고서를 만들 검사(링크). 기업이 아니라 검사 단위다. */
  link: ExamLink;
  /** 이미 발행했다면 그 날짜. 없으면 첫 발행이다. */
  issuedOn?: string;
}) {
  const queryClient = useQueryClient();
  const [working, setWorking] = useState(false);
  // 캐시를 다시 받은 뒤에만 Publisher 를 붙인다.
  const [refreshed, setRefreshed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (
      issuedOn &&
      !window.confirm(
        `${issuedOn} 에 발행한 보고서를 새로 만듭니다.\n발행일이 오늘로 바뀝니다. 계속할까요?`,
      )
    ) {
      return;
    }
    setError(null);
    setWorking(true);
    await refetchCompanyReportSources(queryClient, link);
    setRefreshed(true);
  }

  return (
    <span className="flex items-center justify-end gap-2">
      {error && <span className="txt-c2-regular text-special-pink-600">{error}</span>}
      {working && refreshed && (
        <Publisher
          linkId={link.id}
          onDone={(message) => {
            setWorking(false);
            setRefreshed(false);
            setError(message);
          }}
        />
      )}
      <Button variant={issuedOn ? 'ghost' : 'primary'} onClick={run} disabled={working}>
        <span className="whitespace-nowrap">
          {working ? '만드는 중…' : issuedOn ? '다시 생성' : '생성하기'}
        </span>
      </Button>
    </span>
  );
}

/** 지금 데이터로 보고서를 계산해 그대로 발행한다. 끝나면 오류 문구(없으면 null)로 알린다. */
function Publisher({
  linkId,
  onDone,
}: {
  linkId: number;
  onDone: (error: string | null) => void;
}) {
  const report = useCompanyReport(linkId);
  const publish = usePublishReport();
  const { mutate } = publish;
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    if (report.error) {
      onDone(getApiErrorDetail(report.error) ?? '보고서를 계산하지 못했습니다.');
      return;
    }
    if (report.data === undefined) return;
    if (report.data === null) return onDone('링크가 없거나 사전검사 자료가 없습니다.');
    if (report.data.coverage.postN === 0) return onDone('사후검사 응답이 아직 없습니다.');
    sent.current = true;
    mutate(
      { linkId, report: report.data },
      {
        onSuccess: () => onDone(null),
        onError: (e) => onDone(getApiErrorDetail(e) ?? '발행하지 못했습니다.'),
      },
    );
    // 계산이 끝난 한 번만 발행한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report.data, report.error]);

  return null;
}
