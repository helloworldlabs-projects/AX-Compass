'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/api/services/auth.service';
import { authKeys } from '@/api/keys/auth.keys';
import { BusinessTypes } from '@/types/auth';

export const useBusinessTypes = (): { data: BusinessTypes | undefined; isLoading: boolean } => {
  const { data, isLoading } = useQuery({
    queryKey: authKeys.businessTypes(),
    queryFn: () => authService.getBusinessTypes(),
    staleTime: 1000 * 60 * 60, // 1시간 — 정적 목록이므로 길게 설정
  });

  return { data, isLoading };
};
