import type { ProfileType } from '@/types/exam';

export const PROFILE_TYPE_LABEL: Record<ProfileType, string> = {
  BALANCED: '균형형',
  OVERCONFIDENT: '과신형',
  DOER: '실행형',
  ANALYST: '판단형',
  CAUTIOUS: '조심형',
  LEARNER: '이해형',
} as const;
