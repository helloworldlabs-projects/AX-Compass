'use client';

import { useState } from 'react';

import { AdminDialog } from '@/components/admin/Dialog';
import { Button, FormError } from '@/components/admin/ui';
import { useClosePostLink } from '@/hooks/usePostLink';

export interface DeleteLinkButtonProps {
  id: number;
  org: string;
  /** 이미 들어온 응답 수. 마감해도 사라지지 않는다. */
  responses: number;
}

/**
 * 링크 마감. 무엇이 달라지는지를 묻는 자리에 그대로 적는다.
 * 응답은 사라지지 않는다 — 응답은 링크가 아니라 기업에 매달려 있다.
 */
export function DeleteLinkButton({ id, org, responses }: DeleteLinkButtonProps) {
  const close = useClosePostLink();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          close.reset();
          setOpen(true);
        }}
        className="txt-c1-bold hover:border-special-pink-200 hover:text-special-pink-600 h-9 shrink-0 rounded-[10px] border border-gray-100 bg-white px-3.5 whitespace-nowrap text-gray-500 transition-colors duration-200"
      >
        마감
      </button>

      <AdminDialog open={open} onClose={() => setOpen(false)} title="링크를 마감할까요?">
        <div className="bg-gray-0 mt-5 rounded-[16px] px-5 py-4">
          <p className="txt-c1-bold text-gray-900">{org}</p>
          <ul className="txt-c1-regular mt-3 space-y-1.5 text-gray-500">
            <li>· 이 주소로는 더 이상 응시할 수 없습니다.</li>
            <li>· 같은 기업에 링크를 다시 발급할 수 있습니다.</li>
            {responses > 0 && <li>· 이미 들어온 응답 {responses}건은 그대로 남습니다.</li>}
          </ul>
        </div>

        <div className="mt-4">
          <FormError error={close.error} fallback="마감하지 못했습니다." />
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <Button variant="ghost" size="lg" onClick={() => setOpen(false)}>
            취소
          </Button>
          {/* 되돌릴 수 없는 동작이라 강조색(분홍)으로 둔다. */}
          <button
            type="button"
            disabled={close.isPending}
            onClick={() => close.mutate(id, { onSuccess: () => setOpen(false) })}
            className="txt-c1-bold bg-special-pink-600 h-12 rounded-[10px] px-6 text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200"
          >
            {close.isPending ? '마감 중…' : '마감'}
          </button>
        </div>
      </AdminDialog>
    </>
  );
}
