'use client';

import { useSyncExternalStore } from 'react';

const TOKEN_KEY = 'axcompass:opsToken';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('axcompass:tokenChanged', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('axcompass:tokenChanged', callback);
  };
}

/** 운영 관리자 토큰. 서버 렌더·하이드레이션 중에는 undefined(아직 모름), 없으면 null. */
export const useOpsToken = () =>
  useSyncExternalStore<string | null | undefined>(
    subscribe,
    () => localStorage.getItem(TOKEN_KEY),
    () => undefined,
  );
