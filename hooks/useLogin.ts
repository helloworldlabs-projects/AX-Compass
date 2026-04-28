'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/api/services/auth.service';
import { LoginRequestDTO } from '@/types/auth';
import { getApiErrorDetail } from '@/types/common';
import { toast } from 'sonner';

export const useLogin = () =>
  useMutation({
    mutationFn: (body: LoginRequestDTO) => authService.login(body),
    onSuccess: ({ token }) => {
      localStorage.setItem('axcompass:accessToken', token);
    },
    onError: (error) => {
      const detail = getApiErrorDetail(error);
      toast.error(detail ?? '기관 코드 또는 이름을 다시 확인해 주세요.');
    },
  });
