import type { ExecutiveListParams, MemberListParams } from '@/types/institution';

export const institutionKeys = {
  all: ['institution'] as const,
  stats: (departments?: string[]) =>
    [...institutionKeys.all, 'stats', { departments }] as const,
  membersAll: () => [...institutionKeys.all, 'members'] as const,
  members: (params: MemberListParams) =>
    [...institutionKeys.all, 'members', params] as const,
  executivesAll: () => [...institutionKeys.all, 'executives'] as const,
  executives: (params: ExecutiveListParams) =>
    [...institutionKeys.all, 'executives', params] as const,
};
