export const institutionKeys = {
  all: ['institution'] as const,
  stats: () => [...institutionKeys.all, 'stats'] as const,
};
