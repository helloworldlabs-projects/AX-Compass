import { authService } from '@/api/services/auth.service';
import { RegisterRequestDTO } from '@/types/auth';
import { ApiError } from '@/types/common';
import { useMutation } from '@tanstack/react-query';

export const useRegister = () => {
  return useMutation({
    mutationFn: (body: RegisterRequestDTO) => authService.register(body),
    onError: (error) => {
      if (error instanceof ApiError) {
        // errorCode 기반 분기 처리
      }
    },
  });
};
