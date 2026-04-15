'use client';

import { startTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PC_MIN_WIDTH = 1024;

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window === 'undefined' || window.innerWidth >= PC_MIN_WIDTH,
  );

  useEffect(() => {
    const token = localStorage.getItem('axcompass:adminToken');
    if (!token) {
      router.replace('/');
      return;
    }

    startTransition(() => setIsAuthorized(true));
  }, [router]);

  useEffect(() => {
    function check() {
      setIsDesktop(window.innerWidth >= PC_MIN_WIDTH);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isAuthorized) return null;

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
