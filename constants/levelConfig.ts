import { InstitutionLevel } from '@/types/institution';

export type Level = '입문' | '초급' | '중급' | '고급';

export const LEVEL_CONFIG: Record<Level, { starColor: string; barColors: string[] }> = {
  입문: {
    starColor: 'text-purple-300',
    barColors: ['bg-purple-300'],
  },
  초급: {
    starColor: 'text-purple-500',
    barColors: ['bg-purple-300', 'bg-purple-500'],
  },
  중급: {
    starColor: 'text-purple-700',
    barColors: ['bg-purple-300', 'bg-purple-500', 'bg-purple-700'],
  },
  고급: {
    starColor: 'text-purple-900',
    barColors: ['bg-purple-300', 'bg-purple-500', 'bg-purple-700', 'bg-purple-900'],
  },
} as const;

export const INSTITUTION_LEVEL_LABEL_MAP: Record<InstitutionLevel, Level> = {
  BEGINNER: '입문',
  ELEMENTARY: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
} as const;
