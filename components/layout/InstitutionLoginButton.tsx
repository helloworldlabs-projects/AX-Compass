'use client';

import Link from 'next/link';
import { Building } from 'lucide-react';
import { AdminLoginModal } from '../modals/AdminLoginModal';
import { useState, useSyncExternalStore } from 'react';
import { useLoginAdmin } from '@/hooks/useLoginAdmin';

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('axcompass:tokenChanged', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('axcompass:tokenChanged', callback);
  };
}

export default function InstitutionLoginButton() {
  const token = useSyncExternalStore<string | null | undefined>(
    subscribeToStorage,
    () => localStorage.getItem('axcompass:adminToken'),
    () => undefined,
  );

  const [open, setOpen] = useState(false);
  const { mutate: loginAdmin } = useLoginAdmin();

  const handleConfirm = (code: string, password: string) => {
    loginAdmin({ safarionCode: code, password }, { onSuccess: () => setOpen(false) });
  };

  if (token === undefined) return null;

  if (token) {
    return (
      <Link href="/institution" className="flex items-center gap-1.5 text-white">
        <Building className="size-5" />
        <span className="txt-b-bold">기관 관리</span>
      </Link>
    );
  }

  return (
    <>
      <button
        className="flex cursor-pointer items-center gap-1.5 text-white"
        onClick={() => setOpen(true)}
      >
        <Building className="size-5" />
        <span className="txt-b-bold">기관 관리</span>
      </button>
      <AdminLoginModal open={open} onClose={() => setOpen(false)} onConfirm={handleConfirm} />
    </>
  );
}
