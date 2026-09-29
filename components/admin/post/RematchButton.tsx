'use client';

import { getApiErrorDetail } from '@/types/common';
import { useRematchPostResponses } from '@/hooks/usePostResponse';

/**
 * 사전검사 다시 맞추기. 제출할 때 사전검사를 읽지 못했거나 사전검사 쪽에 사람이
 * 나중에 등록된 경우에 누른다. 이 검사의 응답을 지금 명단으로 다시 맞추고, 짝이 달라진 것만 고친다.
 */
export function RematchButton({ linkId }: { linkId: number }) {
  const rematch = useRematchPostResponses();

  const message = rematch.isError
    ? (getApiErrorDetail(rematch.error) ?? '다시 맞추지 못했습니다.')
    : rematch.data
      ? rematch.data.changed > 0
        ? `${rematch.data.changed}건을 새로 이었습니다.`
        : '새로 이을 수 있는 응답이 없습니다.'
      : null;

  return (
    <span className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => rematch.mutate(linkId)}
        disabled={rematch.isPending}
        className="txt-c1-bold hover:bg-adm-line-soft h-9 shrink-0 rounded-[10px] border border-gray-100 bg-white px-3.5 whitespace-nowrap text-gray-900 transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-400"
      >
        {rematch.isPending ? '맞추는 중…' : '사전검사 다시 맞추기'}
      </button>
      {message && (
        <span role="status" className="txt-c2-regular text-gray-500">
          {message}
        </span>
      )}
    </span>
  );
}
