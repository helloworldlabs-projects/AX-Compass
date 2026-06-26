export const axReportKeys = {
  all: ['axReport'] as const,
  detail: (reportId: string) => [...axReportKeys.all, 'detail', reportId] as const,
};
