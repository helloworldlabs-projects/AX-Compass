'use client';

import Section from '@/components/layout/Section';
import { BadgeCheck } from 'lucide-react';
import { MaturityLevelCard } from './MaturityLevelCard';
import { InstitutionStats } from '@/types/institution';
import { getCompetencyScore, MATURITY_STAGE_LABEL } from '@/constants/maturityConfig';
import { roundScore } from '@/lib/utils';
import { CompetencyScorePanel } from '@/components/ui/CompetencyScorePanel';
import { GapMsChart } from '@/components/ui/GapMsChart';
import { ResultSummaryList } from '@/components/ui/ResultSummaryList';

interface MaturitySectionProps {
  stats: InstitutionStats;
}

export function MaturitySection({ stats }: MaturitySectionProps) {
  const gap = roundScore(
    stats.executiveMaturityStats.avgCurrentMaturityScore -
      stats.executiveMaturityStats.avgTargetMaturityScore,
  );

  return (
    <>
      <Section
        id="maturity-grade"
        className="max-w-[1000px] shrink-0 scroll-mt-[110px] lg:scroll-mt-[120px]"
      >
        <div className="mx-auto w-full max-w-[700px] flex-col items-start">
          <div className="txt-t1">{stats.institutionName}</div>
          <span className="txt-st2-regular">기관 AX 진단 결과 입니다.</span>
        </div>
        <div className="flex items-center gap-[50px]">
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-purple-300 bg-purple-700 py-5 shadow">
            <div className="flex items-center gap-1 text-white">
              <BadgeCheck className="size-5 text-purple-700" fill="white" />
              <span className="txt-b-bold">현재 성숙도 수준</span>
            </div>
            <div className="txt-t2 text-white">
              {MATURITY_STAGE_LABEL[stats.executiveMaturityStats.avgCurrentMaturityStage]}
            </div>
          </div>
          <div className="border-special-pink-200 bg-special-pink-600 flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 py-5 shadow">
            <div className="flex items-center gap-1 text-white">
              <BadgeCheck className="text-special-pink-600 size-5" fill="white" />
              <span className="txt-b-bold">목표 성숙도 수준</span>
            </div>
            <div className="txt-t2 text-white">
              {MATURITY_STAGE_LABEL[stats.executiveMaturityStats.avgTargetMaturityStage]}
            </div>
          </div>
        </div>
        <div className="boder-gray-500 mx-auto flex w-full max-w-[700px] scroll-mt-[110px] flex-col gap-[30px] rounded-[20px] border bg-white p-[50px] shadow lg:scroll-mt-[120px]">
          <MaturityLevelCard type={stats.executiveMaturityStats.avgCurrentMaturityStage} />
          {stats.executiveMaturityStats.avgTargetMaturityStage !==
            stats.executiveMaturityStats.avgCurrentMaturityStage && (
            <MaturityLevelCard type={stats.executiveMaturityStats.avgTargetMaturityStage} />
          )}
        </div>
        <div id="maturity-score" className="w-full scroll-mt-[110px] lg:scroll-mt-[120px]">
          <GapMsChart
            currentScore={stats.executiveMaturityStats.avgCurrentMaturityScore}
            currentStageLabel={
              MATURITY_STAGE_LABEL[stats.executiveMaturityStats.avgCurrentMaturityStage]
            }
            targetScore={stats.executiveMaturityStats.avgTargetMaturityScore}
            targetStageLabel={
              MATURITY_STAGE_LABEL[stats.executiveMaturityStats.avgTargetMaturityStage]
            }
            gap={gap}
          />
        </div>
        <div
          id="maturity-domain-stats"
          className="flex scroll-mt-[110px] flex-wrap items-center justify-center gap-y-[50px] lg:scroll-mt-[120px]"
        >
          <CompetencyScorePanel
            title="현재 영역별 성숙도"
            strategy={getCompetencyScore(
              stats.executiveMaturityStats.currentCompetencyScores,
              'EXEC_STRATEGY',
            )}
            governance={getCompetencyScore(
              stats.executiveMaturityStats.currentCompetencyScores,
              'EXEC_GOVERNANCE',
            )}
            adoption={getCompetencyScore(
              stats.executiveMaturityStats.currentCompetencyScores,
              'EXEC_ADOPTION',
            )}
            dataSystem={getCompetencyScore(
              stats.executiveMaturityStats.currentCompetencyScores,
              'EXEC_DATA_SYSTEM',
            )}
            strokeColor="#ff5a81"
            variant="pink"
          />
          <CompetencyScorePanel
            title="목표 영역별 성숙도"
            strategy={getCompetencyScore(
              stats.executiveMaturityStats.targetCompetencyScores,
              'EXEC_STRATEGY',
            )}
            governance={getCompetencyScore(
              stats.executiveMaturityStats.targetCompetencyScores,
              'EXEC_GOVERNANCE',
            )}
            adoption={getCompetencyScore(
              stats.executiveMaturityStats.targetCompetencyScores,
              'EXEC_ADOPTION',
            )}
            dataSystem={getCompetencyScore(
              stats.executiveMaturityStats.targetCompetencyScores,
              'EXEC_DATA_SYSTEM',
            )}
            strokeColor="#2e75cc"
            variant="blue"
          />
        </div>
        <div id="summary" className="scroll-mt-[110px] lg:scroll-mt-[120px]">
          <ResultSummaryList items={stats.executiveMaturityStats.resultSummary} />
        </div>
      </Section>
    </>
  );
}
