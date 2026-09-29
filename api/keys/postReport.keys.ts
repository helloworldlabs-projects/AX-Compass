export const postReportKeys = {
  all: ['postReport'] as const,
  lists: () => [...postReportKeys.all, 'list'] as const,
  detail: (linkId: number) => [...postReportKeys.all, 'detail', linkId] as const,
};
