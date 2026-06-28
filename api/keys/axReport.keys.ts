export const axReportKeys = {
  all: ['axReport'] as const,
  detail: () => [...axReportKeys.all, 'detail'] as const,
  status: () => [...axReportKeys.all, 'status'] as const,
};
