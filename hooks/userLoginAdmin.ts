'use client';

import { LoginAdminRequestDTO } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/api/services/auth.service';
import { getApiErrorDetail } from '@/types/common';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLoginAdmin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: LoginAdminRequestDTO) => authService.loginAdmin(body),
    onSuccess: ({ token }) => {
      localStorage.setItem('accessToken', token);
      queryClient.invalidateQueries();
      router.push('/institution');
    },
    onError: (error) => {
      const detail = getApiErrorDetail(error);
      toast.error(detail ?? (error instanceof Error ? error.message : '로그인에 실패했습니다.'));
    },
  });
};
