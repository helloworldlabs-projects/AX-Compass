'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/api/services/dashboard.service';
import { dashboardKeys } from '@/api/keys/dashboard.keys';
import { Institution } from '@/types/dashboard';

export const useInstitutions = (): { data: Institution[]; isLoading: boolean } => {
  const { data, isLoading } = useQuery({
    queryKey: dashboardKeys.institutions(),
    queryFn: () => dashboardService.fetchInstitutions(),
  });

  return {
    data: data ?? [],
    isLoading,
  };
};
