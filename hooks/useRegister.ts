import { authService } from '@/api/services/auth.service';
import { RegisterRequestDTO } from '@/types/auth';
import { getApiErrorDetail } from '@/types/common';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRegister = () => {
  return useMutation({
    mutationFn: (body: RegisterRequestDTO) => authService.register(body),
    onSuccess: () => {},
    onError: (error) => {
      const detail = getApiErrorDetail(error);
      toast.error(
        detail ?? (error instanceof Error ? error.message : '입력한 정보를 다시 확인해 주세요.'),
      );
    },
  });
};
