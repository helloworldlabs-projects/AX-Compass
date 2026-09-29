'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { LoadingState } from '@/components/admin/ui';
import { Sidebar } from '@/components/admin/Sidebar';
import { useOpsToken } from '@/hooks/useOpsToken';
import { LOGIN_PATH } from '@/lib/admin/routes';

/**
 * 관리자 화면 문지기(클라이언트).
 * 토큰이 없으면 로그인으로(돌아올 주소를 next 로 남긴다). 백엔드에 /me 가 없으므로 토큰 유무만 본다.
 * 토큰이 죽었거나 잘못됐으면 API 호출 시 401 을 받은 apiFetch 가 토큰을 지우고 로그인으로 보낸다.
 */
export default function GuardedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useOpsToken();

  useEffect(() => {
    if (token !== null) return;
    const next = window.location.pathname + window.location.search;
    router.replace(`${LOGIN_PATH}?next=${encodeURIComponent(next)}`);
  }, [token, router]);

  // undefined = 하이드레이션 대기, null = 로그인으로 보내는 중
  if (!token) return <LoadingState />;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      {/* 인쇄할 때는 화면용 여백을 걷어낸다. */}
      <main className="print-flat min-w-0 flex-1 px-5 py-6 lg:px-8 lg:py-10">
        <div className="space-y-6">
          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
