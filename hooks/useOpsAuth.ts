'use client';

import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { postLinkKeys } from '@/api/keys/postLink.keys';
import { postResponseKeys } from '@/api/keys/postResponse.keys';
import { referenceKeys } from '@/api/keys/reference.keys';
import { opsAuthService } from '@/api/services/opsAuth.service';
import { LOGIN_PATH } from '@/lib/admin/routes';
import type { OpsLoginRequestDto } from '@/types/opsAuth';

const TOKEN_KEY = 'axcompass:opsToken';

const saveToken = (token: string | null) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event('axcompass:tokenChanged'));
};

/**
 * 로그인(SafariOn 관리자 계정).
 * goTo 는 로그인 뒤 돌아갈 내부 경로. 호출하는 쪽에서 '/' 로 시작하는지 검증해 넘긴다.
 */
export const useOpsLogin = (goTo = '/admin') => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: OpsLoginRequestDto) => opsAuthService.login(body),
    onSuccess: ({ token }) => {
      saveToken(token);
      queryClient.invalidateQueries();
      router.push(goTo);
    },
  });
};

/** 로그아웃. 백엔드에 로그아웃 API 가 없으므로 이 브라우저의 토큰과 캐시만 지운다. */
export const useOpsLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(() => {
    saveToken(null);
    for (const key of [postLinkKeys.all, postResponseKeys.all, referenceKeys.all]) {
      queryClient.removeQueries({ queryKey: key });
    }
    router.replace(LOGIN_PATH);
  }, [queryClient, router]);
};
