'use client';

import Section from '@/components/layout/Section';
import { BadgeCheck } from 'lucide-react';
import { MaturityLevelCard } from './MaturityLevelCard';
import { InstitutionStats } from '@/types/institution';
import { getCompetencyScore, MATURITY_STAGE_LABEL } from '@/constants/maturityConfig';
import { roundScore } from '@/lib/utils';
import { CompetencyScorePanel } from '@/components/ui/CompetencyScorePanel';

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
      <Section className="max-w-[1000px] shrink-0">
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
        <div className="boder-gray-500 mx-auto flex w-full max-w-[700px] flex-col gap-[30px] rounded-[20px] border bg-white p-[50px] shadow">
          <MaturityLevelCard type={stats.executiveMaturityStats.avgCurrentMaturityStage} />
          {stats.executiveMaturityStats.avgTargetMaturityStage !==
            stats.executiveMaturityStats.avgCurrentMaturityStage && (
            <MaturityLevelCard type={stats.executiveMaturityStats.avgTargetMaturityStage} />
          )}
        </div>
        {/** ---  */}
        <div className="flex w-full flex-col gap-[30px]">
          <div className="mx-auto w-full max-w-[340px] lg:max-w-[900px]">
            <div className="flex items-end justify-center gap-2.5">
              <div className="relative flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">
                  {roundScore(stats.executiveMaturityStats.avgCurrentMaturityScore)}
                </span>
                <div
                  className="flex w-full items-center justify-center rounded-t-[12px] border-3 border-b-0 border-purple-300 bg-purple-700 lg:rounded-t-[20px]"
                  style={{
                    height: `${roundScore(stats.executiveMaturityStats.avgCurrentMaturityScore)}%`,
                  }}
                >
                  <span className="txt-st2-bold text-white">
                    {MATURITY_STAGE_LABEL[stats.executiveMaturityStats.avgCurrentMaturityStage]}
                  </span>
                </div>
              </div>
              <div className="w-[50px] lg:w-[120px]">
                <div
                  className={`txt-b-bold flex h-[100px] flex-col text-center ${gap > 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  <span>Gap_MS</span>
                  <span>
                    ({gap > 0 ? '+' : ''} {gap})
                  </span>
                  <div className="flex w-full items-center">
                    <div className="h-px flex-1 bg-current" />
                    <div className="h-0 w-0 border-y-[5px] border-l-8 border-y-transparent border-l-current" />
                  </div>
                </div>
              </div>
              <div className="relative flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">
                  {roundScore(stats.executiveMaturityStats.avgTargetMaturityScore)}
                </span>
                <div
                  className="bg-special-pink-600 border-special-pink-200 flex w-full items-center justify-center rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                  style={{
                    height: `${roundScore(stats.executiveMaturityStats.avgTargetMaturityScore)}%`,
                  }}
                >
                  <span className="txt-st2-bold text-white">
                    {MATURITY_STAGE_LABEL[stats.executiveMaturityStats.avgTargetMaturityStage]}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[3px] w-full rounded-full bg-gray-500" />
            <div className="txt-st2-bold mt-5 flex items-center justify-center gap-[50px] text-center lg:gap-[120px] lg:px-6">
              <div>
                현재 성숙도(CMS)
                <br />
                (종합)
              </div>
              <div>
                목표 성숙도(TMS)
                <br />
                (종합)
              </div>
            </div>
          </div>
          <div className="mx-auto w-[700px]">
            <div className="txt-st-bold">
              <span className="text-purple-700">* </span>
              Gap_MS (CMS − TMS)
            </div>
            <div>
              현재 성숙도(Current Maturity Stage)와 목표 성숙도(Target Maturity Stage)의 차이입니다.
              <br />
              <span className="txt-b-bold text-green-600">[양수(+)]</span> 현재 성숙도가 목표
              성숙도보다 높아, 현재 수준 대비 보수적인 목표를 두거나 향후 추진 방향을 낮게 설정하는
              경향이 있습니다.
              <br />
              <span className="txt-b-bold text-red-500">[음수(−)]</span> 현재 성숙도가 목표
              성숙도보다 낮아, 현재 수준을 넘어 더 높은 단계로의 성장과 고도화를 기대하는 경향이
              있습니다.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
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
        <div className="flex flex-col gap-2.5 rounded-[20px] border border-gray-500 bg-white px-[50px] py-[30px] shadow">
          <div className="txt-st-bold">
            <span className="text-purple-700">* </span>
            검사 결과 요약
          </div>
          <ul className="list-outside list-decimal pl-5 text-black marker:text-black">
            {stats.executiveMaturityStats.resultSummary.map((summary) => (
              <li key={summary}>
                {summary.split(/\*([^*]*)\*/g).map((word, index) =>
                  index % 2 === 0 ? (
                    word
                  ) : (
                    <span key={index} className="txt-b-bold">
                      {word}
                    </span>
                  ),
                )}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
