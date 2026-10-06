'use client';

import { useState } from 'react';

import { usePreLinkResponse } from '@/hooks/usePostResponse';

export type LinkCandidate = { userId: number; name: string; department: string | null };

/**
 * 사전검사 응시자를 손으로 잇는다.
 *
 * 자동 매칭은 이름이 한 글자라도 다르면 비운다. 실제로는 띄어쓰기나 표기가
 * 다를 뿐 같은 사람인 경우가 잦아, 담당자가 보고 직접 고른다.
 *
 * 고르는 순간 매칭 인원이 달라지고, 그 인원으로 내는 "같은 사람끼리 비교"의
 * 수치도 함께 움직인다. 이미 발행한 보고서는 그때의 전문을 담아 두므로 바뀌지
 * 않는다 — 반영하려면 다시 생성해야 한다.
 *
 * 후보는 **이 검사에서** 아직 아무 응답에도 붙지 않은 사람만 나온다. 다른
 * 검사에서 이어진 사람은 빼지 않는다 — 교육을 두 번 들은 사람이고, 이
 * 검사에서도 이어져야 한다.
 */
export function LinkToPre({
  responseId,
  candidates,
}: {
  responseId: string;
  candidates: LinkCandidate[];
}) {
  const link = usePreLinkResponse();
  const [picked, setPicked] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (candidates.length === 0) {
    return (
      <p className="txt-c2-regular mt-3 text-gray-400">
        이을 수 있는 사전검사 응시자가 없습니다. 명단의 모든 사람이 이미 이 검사의 다른 응답에
        이어져 있습니다.
      </p>
    );
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <p className="txt-c2-regular text-gray-500">
        같은 사람이라면 사전검사 명단에서 골라 이어 주세요.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select
          value={picked}
          onChange={(e) => setPicked(e.target.value)}
          className="txt-c1-regular h-9 max-w-[280px] rounded-[8px] border border-gray-200 bg-white px-3 text-gray-900"
        >
          <option value="">사전검사 응시자 고르기</option>
          {candidates.map((c) => (
            <option key={c.userId} value={c.userId}>
              {c.name}
              {c.department ? ` · ${c.department}` : ''}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!picked || link.isPending}
          onClick={() => {
            const c = candidates.find((x) => String(x.userId) === picked);
            if (!c) return;
            setMessage(null);
            link.mutate(
              { responseId: Number(responseId), preUserId: c.userId },
              {
                onSuccess: () => setPicked(''),
                onError: (e) => setMessage(e instanceof Error ? e.message : '잇지 못했습니다.'),
              },
            );
          }}
          className="txt-c1-bold h-9 shrink-0 rounded-[8px] border border-gray-200 bg-white px-3.5 text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          {link.isPending ? '잇는 중…' : '이 사람으로 잇기'}
        </button>
        {message && <span className="txt-c2-regular text-special-pink-600">{message}</span>}
      </div>
    </div>
  );
}
