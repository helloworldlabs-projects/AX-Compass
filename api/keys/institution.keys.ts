export const institutionKeys = {
  all: ['institution'] as const,
  stats: () => [...institutionKeys.all, 'stats'] as const,
  membersAll: () => [...institutionKeys.all, 'members'] as const,
  members: (params: Record<string, unknown>) =>
    [...institutionKeys.all, 'members', params] as const,
  executivesAll: () => [...institutionKeys.all, 'executives'] as const,
  executives: (params: Record<string, unknown>) =>
    [...institutionKeys.all, 'executives', params] as const,
};
