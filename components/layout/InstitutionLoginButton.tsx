'use client';

import Link from 'next/link';
import { Building, LogOut } from 'lucide-react';
import { AdminLoginModal, type LoginCredentials } from '../modals/AdminLoginModal';
import { useState, useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const { mutate: loginAdmin } = useLoginAdmin();

  function handleLogout() {
    localStorage.removeItem('axcompass:adminToken');
    queryClient.clear();
    window.dispatchEvent(new Event('axcompass:tokenChanged'));
  }

  const handleConfirm = (credentials: LoginCredentials) => {
    if (credentials.type === 'code') {
      loginAdmin(
        { safarionCode: credentials.code, password: credentials.password },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      console.warn('운영자 계정 로그인 미구현');
    }
  };

  if (token === undefined) return null;

  if (token) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/institution" className="flex items-center gap-1.5 text-white">
          <Building className="size-5" />
          <span className="txt-b-bold">기관 관리</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-1.5 text-white"
          aria-label="로그아웃"
        >
          <LogOut className="size-5" />
          <span className="txt-b-bold">로그아웃</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        className="flex cursor-pointer items-center gap-1.5 text-white"
        onClick={() => setOpen(true)}
      >
        <Building className="size-5" />
        <span className="txt-b-bold">기관 로그인 & 회원가입</span>
      </button>
      <AdminLoginModal open={open} onClose={() => setOpen(false)} onConfirm={handleConfirm} />
    </>
  );
}
