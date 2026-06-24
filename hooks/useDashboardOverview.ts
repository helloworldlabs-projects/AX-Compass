'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/api/services/dashboard.service';
import { dashboardKeys } from '@/api/keys/dashboard.keys';
import { DashboardOverview } from '@/types/dashboard';

export const useDashboardOverview = (): { data: DashboardOverview | undefined; isLoading: boolean } => {
  const { data, isLoading } = useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => dashboardService.fetchOverview(),
  });

  return {
    data,
    isLoading,
  };
};
