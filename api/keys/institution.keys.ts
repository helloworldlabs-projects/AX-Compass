export const institutionKeys = {
  all: ['institution'] as const,
  stats: () => [...institutionKeys.all, 'stats'] as const,
  members: (params: Record<string, unknown>) =>
    [...institutionKeys.all, 'members', params] as const,
};
