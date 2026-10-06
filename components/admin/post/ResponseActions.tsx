'use client';

import { useState } from 'react';

import { usePreLinkResponse, useSetResponseExcluded } from '@/hooks/usePostResponse';

const PILL =
  'txt-c2-bold h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 transition disabled:cursor-not-allowed';
const IDLE =
  'border-gray-200 text-gray-500 hover:border-special-pink-600 hover:text-special-pink-600';
const BACK = 'border-adm-brand text-adm-brand hover:bg-adm-brand hover:text-white';

/**
 * 응답 한 줄에 붙는 관리 버튼.
 *
 * 이어진 응답은 풀 수 있고, 어느 응답이든 집계에서 뺄 수 있다. 둘 다 지우는
 * 것이 아니라 표시만 바꾸므로 한 번 더 묻지 않는다 — 되돌리기가 늘 그 자리에
 * 있고, 누를 때마다 확인을 요구하면 정작 고쳐야 할 것을 미루게 된다.
 *
 */
export function ResponseActions({
  responseId,
  matched,
  excluded,
}: {
  responseId: string;
  matched: boolean;
  excluded: boolean;
}) {
  const unlink = usePreLinkResponse();
  const setExcluded = useSetResponseExcluded();
  const [message, setMessage] = useState<string | null>(null);

  const busy = unlink.isPending || setExcluded.isPending;
  const fail = (e: unknown) => setMessage(e instanceof Error ? e.message : '처리하지 못했습니다.');

  return (
    <span className="flex flex-wrap items-center justify-end gap-1.5">
      {!excluded && matched && (
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setMessage(null);
            unlink.mutate({ responseId: Number(responseId), preUserId: null }, { onError: fail });
          }}
          className={`${PILL} ${IDLE}`}
        >
          {unlink.isPending ? '…' : '연결 풀기'}
        </button>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setMessage(null);
          setExcluded.mutate(
            { responseId: Number(responseId), exclude: !excluded },
            { onError: fail },
          );
        }}
        className={`${PILL} ${excluded ? BACK : IDLE}`}
      >
        {setExcluded.isPending ? '…' : excluded ? '되돌리기' : '제외'}
      </button>
      {message && <span className="txt-c2-regular text-special-pink-600">{message}</span>}
    </span>
  );
}
