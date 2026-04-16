import type { ProfileType } from '@/types/exam';

export const PROFILE_TYPE_LABEL: Record<ProfileType, string> = {
  BALANCED: '균형형',
  ACTION_ORIENTED: '실행형',
  JUDGEMENT_ORIENTED: '판단형',
  UNDERSTAND_FOCUSED: '이해형',
  OVERCONFIDENT: '과신형',
  CAUTIOUS: '조심형',
} as const;
