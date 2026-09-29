export const postResponseKeys = {
  all: ['postResponse'] as const,
  byLink: (linkId: number) => [...postResponseKeys.all, 'byLink', linkId] as const,
  count: (linkId: number) => [...postResponseKeys.all, 'count', linkId] as const,
  counts: () => [...postResponseKeys.all, 'counts'] as const,
  tagAverages: (linkId: number) => [...postResponseKeys.all, 'tagAverages', linkId] as const,
};
