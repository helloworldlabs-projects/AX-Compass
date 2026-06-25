'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authService } from '@/api/services/auth.service';
import { LoginAdminEmailRequestDTO } from '@/types/auth';
import { getApiErrorDetail } from '@/types/common';

interface UseAdminEmailLoginOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useAdminEmailLogin = (options?: UseAdminEmailLoginOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: LoginAdminEmailRequestDTO) => authService.loginAdminByEmail(body),
    onSuccess: ({ token }) => {
      localStorage.setItem('axcompass:adminToken', token);
      window.dispatchEvent(new Event('axcompass:tokenChanged'));
      queryClient.invalidateQueries();
      options?.onSuccess?.();
      router.push('/institution');
    },
    onError: (error) => {
      const detail = getApiErrorDetail(error);
      const message = detail ?? (error instanceof Error ? error.message : '로그인에 실패했습니다.');
      options?.onError?.(message);
    },
  });
};
