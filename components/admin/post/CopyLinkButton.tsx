'use client';

import { useState } from 'react';

import { copyText } from '@/lib/admin/copy-text';
import { notify } from '@/lib/admin/notify';
import { cn } from '@/lib/utils';

/** 응시 주소. 공개 응시 화면은 /admin 밖(/after/[slug])에 있다. */
export const examUrlOf = (slug: string) => `${window.location.origin}/after/${slug}`;

/**
 * 응시 링크 복사. 누르면 바로 복사하고 알린다 — 창을 띄워 되묻지 않는다.
 * 알림은 운영체제 알림으로 띄우고, 권한이 막혀 있으면 화면 위쪽에 띄운다.
 */
export function CopyLinkButton({ slug }: { slug: string }) {
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null);

  async function copy() {
    const url = examUrlOf(slug);
    const ok = await copyText(url);
    const shown = await notify(
      ok ? 'AX Compass' : 'AX Compass · 복사 실패',
      ok ? `${url}\n담당자에게 전달해 주세요.` : '주소창에서 직접 복사해 주세요.',
    );

    // 운영체제 알림이 떴으면 화면에는 겹쳐 띄우지 않는다.
    if (shown && ok) return;
    setBanner({ ok, text: ok ? '응시 링크를 복사했습니다' : '링크를 복사하지 못했습니다' });
    setTimeout(() => setBanner(null), ok ? 2500 : 4000);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="txt-c1-bold hover:bg-adm-line-soft h-9 shrink-0 rounded-[10px] border border-gray-100 bg-white px-3.5 whitespace-nowrap text-gray-900 transition-colors duration-200"
      >
        링크 복사
      </button>

      {/* 목록이 길면 누른 줄이 화면 밖으로 밀리므로 버튼 옆이 아니라 화면 위쪽에 띄운다. */}
      {banner && (
        <div role="status" className="fixed top-6 left-1/2 z-[60] -translate-x-1/2">
          <p
            className={cn(
              'txt-c1-bold rounded-full px-5 py-2.5 text-white shadow-sm',
              banner.ok ? 'bg-gray-900' : 'bg-special-pink-600',
            )}
          >
            {banner.text}
          </p>
        </div>
      )}
    </>
  );
}
