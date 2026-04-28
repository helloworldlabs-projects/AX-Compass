import type { ExecutiveCompetencyCode, ExecutiveResult, MaturityStage } from '@/types/exam';
import { roundScore } from '@/lib/utils';

export const MATURITY_STAGE_LABEL: Record<MaturityStage, string> = {
  INITIATION: '도입',
  UTILIZATION: '활용',
  INTEGRATION: '통합',
  INNOVATION: '혁신',
};

export function getCompetencyScore(
  scores: ExecutiveResult['currentCompetencyScores'],
  code: ExecutiveCompetencyCode,
): number {
  return roundScore(scores.find((s) => s.competencyCode === code)?.score ?? 0);
}
