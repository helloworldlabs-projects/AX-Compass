'use client';

import { startTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/');
      return;
    }

    startTransition(() => setIsAuthorized(true));
  }, [router]);

  if (!isAuthorized) return null;

  return <>{children}</>;
}
