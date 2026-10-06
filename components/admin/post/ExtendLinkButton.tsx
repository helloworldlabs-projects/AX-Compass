'use client';

import { useState } from 'react';

import { AdminDialog } from '@/components/admin/Dialog';
import { Button, Field, FormError, INPUT_CLASS } from '@/components/admin/ui';
import { useExtendPostLink } from '@/hooks/usePostLink';
import { todayKST } from '@/lib/admin/metrics';
import type { ExamLink } from '@/types/postLink';

/**
 * 마감일을 바꾼다.
 *
 * **진행중인 링크에도 보인다.** 마감된 뒤에 늘리면 그 사이에 들어오려던
 * 사람이 "종료되었습니다"를 보고 돌아간다. 응답률이 모자라 보이면 마감 전에
 * 미리 늘리는 것이 맞다.
 *
 * 링크가 닫히는 길이 둘이고, 둘을 같은 말로 다루면 위험하다.
 *
 *   · 마감일이 지남   — 그냥 늘리면 된다
 *   · 운영자가 거둠   — 기업을 잘못 적어 거둔 링크일 수 있다
 *
 * 거둔 링크는 「다시 열기」로 따로 두고, 누가 언제 거뒀는지 보여 준 뒤에
 * 바꾼다. 주소(slug)는 그대로이므로 이미 안내한 링크가 살아난다.
 *
 * 이미 낸 사람은 다시 못 낸다 — 아직 안 낸 사람을 받기 위한 기능이다.
 */
export function ExtendLinkButton({ link }: { link: ExamLink }) {
  const extend = useExtendPostLink();
  const [open, setOpen] = useState(false);
  const [dueOn, setDueOn] = useState(link.dueOn);

  // 거둔 링크를 다시 여는 것은 되돌리기 어렵다. 말과 색을 달리한다.
  const risky = link.withdrawn;
  const label = risky ? '다시 열기' : link.closed ? '기간 연장' : '마감일 변경';

  return (
    <>
      {/* 옆의 「링크 복사」·「마감」과 같은 크기·모양으로 둔다. */}
      <button
        type="button"
        onClick={() => {
          extend.reset();
          setDueOn(link.dueOn < todayKST() ? todayKST() : link.dueOn);
          setOpen(true);
        }}
        className="txt-c1-bold hover:border-adm-brand hover:text-adm-brand h-9 shrink-0 rounded-[10px] border border-gray-100 bg-white px-3.5 whitespace-nowrap text-gray-500 transition-colors duration-200"
      >
        {label}
      </button>

      <AdminDialog
        open={open}
        onClose={() => setOpen(false)}
        title={risky ? '링크를 다시 열까요?' : '마감일을 바꿀까요?'}
      >
        <div className="bg-gray-0 mt-5 rounded-[16px] px-5 py-4">
          <p className="txt-c1-bold text-gray-900">{link.org}</p>
          <p className="txt-c2-regular mt-1 text-gray-500">/after/{link.slug}</p>

          <ul className="txt-c1-regular mt-3 space-y-1.5 text-gray-500">
            <li>
              · 지금 마감일은 <b className="text-gray-900">{link.dueOn}</b> 입니다. 그날 23:59까지
              응시할 수 있습니다.
            </li>
            <li>· 주소는 바뀌지 않습니다. 이미 안내한 링크가 그대로 쓰입니다.</li>
            <li>· 이미 응답한 사람은 다시 내지 못합니다. 아직 안 낸 사람만 받습니다.</li>
          </ul>
        </div>

        {/* 거둔 링크는 잘못 적어 거둔 것일 수 있다. 다시 열기 전에 그 사실을 먼저 알린다. */}
        {risky && (
          <div className="bg-special-pink-50 mt-3 rounded-[16px] px-5 py-4">
            <p className="txt-c1-bold text-special-pink-600">운영자가 거둔 링크입니다</p>
            <p className="txt-c1-regular mt-1.5 text-gray-500">
              {link.closedOn ? `${link.closedOn}에 ` : ''}마감 처리되었습니다. 기업을 잘못 적어 거둔
              링크라면 다시 열지 마시고, 새로 발급해 주세요.
            </p>
          </div>
        )}

        <div className="mt-5">
          <Field
            label="새 마감일"
            htmlFor="extend-due-on"
            hint="오늘보다 이전으로는 둘 수 없습니다."
          >
            <input
              id="extend-due-on"
              type="date"
              value={dueOn}
              min={todayKST()}
              onChange={(e) => setDueOn(e.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        <div className="mt-4">
          <FormError error={extend.error} fallback="마감일을 바꾸지 못했습니다." />
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <Button variant="ghost" size="lg" onClick={() => setOpen(false)}>
            취소
          </Button>
          <button
            type="button"
            disabled={!dueOn || extend.isPending}
            onClick={() =>
              extend.mutate(
                // 거둔 링크일 때만 다시 연다. 기간 만료에 reopen 을 붙이면
                // 잘못 적어 거둔 링크까지 되살릴 길이 열린다.
                { linkId: link.id, dueOn, reopen: risky || undefined },
                { onSuccess: () => setOpen(false) },
              )
            }
            className={`txt-c1-bold h-12 rounded-[10px] px-6 text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200 ${
              risky ? 'bg-special-pink-600' : 'bg-adm-brand'
            }`}
          >
            {extend.isPending ? '바꾸는 중…' : risky ? '다시 열기' : '마감일 바꾸기'}
          </button>
        </div>
      </AdminDialog>
    </>
  );
}
