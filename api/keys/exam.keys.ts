import { ExamType } from '@/types/exam';

export const examKeys = {
  all: ['exam'] as const,
  expectationForm: () => [...examKeys.all, 'expectationForm'] as const,
  examineeProfiles: () => [...examKeys.all, 'examineeProfiles'] as const,
  items: (examType: ExamType) => [...examKeys.all, 'items', examType] as const,
};
