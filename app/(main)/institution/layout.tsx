'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { InstitutionPageSkeleton } from './_components/InstitutionPageSkeleton';

const PC_MIN_WIDTH = 1024;

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('axcompass:tokenChanged', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('axcompass:tokenChanged', callback);
  };
}

function subscribeToResize(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const token = useSyncExternalStore<string | null | undefined>(
    subscribeToStorage,
    () => localStorage.getItem('axcompass:adminToken'),
    () => undefined,
  );

  const isDesktop = useSyncExternalStore(
    subscribeToResize,
    () => window.innerWidth >= PC_MIN_WIDTH,
    () => true,
  );

  useEffect(() => {
    if (token === null) router.replace('/');
  }, [token, router]);

  if (token === undefined) return <InstitutionPageSkeleton />;

  if (!token) return null;

  if (!isDesktop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-xl font-bold text-white">
          화면 너비 1024px 이상의 PC 환경에서 이용해 주세요.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
