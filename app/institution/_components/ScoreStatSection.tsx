'use client';

import Section from '@/components/layout/Section';
import { ScoreStatGuideModal } from '@/components/modals/ScoreStatGuideModal';
import { RadarChart } from '@/components/ui/RadarChart';
import { COMPETENCY_COLOR_MAP, COMPETENCY_NAME_MAP } from '@/constants/competencyConfig';
import { BadgeCheck, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { InstitutionCompetencyStat, InstitutionScoreStats } from '@/types/institution';
import { roundScore } from '@/lib/utils';

interface ScoreStatSectionProps {
  scoreStats: InstitutionScoreStats;
  competencyStats: InstitutionCompetencyStat[];
}

export function ScoreStatSection({ scoreStats, competencyStats }: ScoreStatSectionProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Section className="max-w-[1000px] shrink-0">
      <ScoreStatGuideModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className="flex w-[700px] items-center justify-between">
        <div className="flex items-center gap-4">
          <BadgeCheck className="size-10 text-white" fill="#533699" />
          <span className="txt-t1">역량 점수 통계(전체 평균)</span>
        </div>
        <HelpCircle
          className="text-special-dark-blue-900 size-9"
          onClick={() => setOpenModal(true)}
        />
      </div>
      <div className="flex w-full flex-col gap-[30px]">
        <div className="flex w-full max-w-[900px] flex-col gap-[30px]">
          <div>
            <div className="flex items-end justify-center gap-2.5">
              <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">{roundScore(scoreStats.seAvg)}</span>
                <div
                  className="bg-special-dark-blue-200 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                  style={{ height: `${roundScore(scoreStats.seAvg)}%` }}
                />
              </div>
              <div className="w-[50px] lg:w-[120px]">
                <div
                  className={`txt-b-bold flex h-[100px] flex-col text-center ${scoreStats.gapSrAvg > 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  <span>Gap_SR</span>
                  <span>
                    ({scoreStats.gapSrAvg > 0 ? '+' : ''} {scoreStats.gapSrAvg.toFixed(1)})
                  </span>
                  <div className="flex w-full items-center">
                    <div className="h-px flex-1 bg-current" />
                    <div className="h-0 w-0 border-y-[5px] border-l-8 border-y-transparent border-l-current" />
                  </div>
                </div>
              </div>
              <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">{roundScore(scoreStats.sjAvg)}</span>
                <div
                  className="bg-special-dark-blue-400 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                  style={{ height: `${roundScore(scoreStats.sjAvg)}%` }}
                />
              </div>
              <div className="w-[50px] lg:w-[120px]">
                <div
                  className={`txt-b-bold flex h-[100px] flex-col text-center ${scoreStats.gapSbAvg > 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  <span>Gap_SB</span>
                  <span>
                    ({scoreStats.gapSbAvg > 0 ? '+' : ''} {scoreStats.gapSbAvg.toFixed(1)})
                  </span>
                  <div className="flex w-full items-center">
                    <div className="h-px flex-1 bg-current" />
                    <div className="h-0 w-0 border-y-[5px] border-l-8 border-y-transparent border-l-current" />
                  </div>
                </div>
              </div>
              <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">{roundScore(scoreStats.bhAvg)}</span>
                <div
                  className="bg-special-dark-blue-600 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                  style={{ height: `${roundScore(scoreStats.bhAvg)}%` }}
                />
              </div>
            </div>
            <div className="h-[3px] w-full rounded-full bg-gray-500" />
            <div className="txt-st2-bold mt-5 flex items-center justify-center gap-[170px] text-center">
              <div>
                자기 평가(SE)
                <br />
                (종합)
              </div>
              <div>
                상황 판단(SJ)
                <br />
                (종합)
              </div>
              <div>
                행동 빈도(BH)
                <br />
                (종합)
              </div>
            </div>
          </div>
          <div className="mx-auto flex max-w-[700px] flex-col gap-6">
            <div>
              <div className="txt-st-bold">
                <span className="text-purple-700">* </span>
                Gap_SR (SE − SJ)
              </div>
              <div>
                자기평가(Self-Estimate)와 상황판단(Situational Judgment)의 차이입니다.
                <br />
                <span className="txt-b-bold text-green-600">[양수(+)]</span> 자기평가가 상황판단보다
                높아, 자신감이 실제 판단보다 앞서는 경향이 있습니다.
                <br />
                <span className="txt-b-bold text-red-500">[음수(−)]</span> 상황판단이 자기평가보다
                높아, 스스로를 보수적으로 평가하거나 실제 판단이 더 강한 경향이 있습니다.
              </div>
            </div>
            <div>
              <div className="txt-st-bold">
                <span className="text-purple-700">* </span>
                Gap_SB (SJ − BH)
              </div>
              <div>
                상황판단(Situational Judgment)과 행동빈도(Behavior Habit)의 차이입니다.
                <br />
                <span className="txt-b-bold text-green-600">[양수(+)]</span> 상황판단이 행동빈도보다
                높아, 판단은 좋지만 실사용/실행이 부족한 경향이 있습니다.
                <br />
                <span className="txt-b-bold text-red-500">[음수(−)]</span> 행동빈도가 상황판단보다
                높아, 실행은 많지만 판단·검증이 따라오지 않을 수 있는 경향이 있습니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
        {competencyStats.map((competency) => {
          const color = COMPETENCY_COLOR_MAP[competency.competencyCode];
          return (
            <div key={competency.competencyCode} className="print-chart-item flex w-[300px] flex-col lg:w-[500px]">
              <div className="txt-st-bold text-center">
                {COMPETENCY_NAME_MAP[competency.competencyCode]}
              </div>
              <div className="flex flex-col gap-5">
                <div className="h-[300px] w-full lg:h-[500px]">
                  <RadarChart
                    seScore={competency.seAvg}
                    sjScore={competency.sjAvg}
                    bhScore={competency.bhAvg}
                    strokeColor={color?.hex ?? '#8b5cff'}
                  />
                </div>
                <div className="flex flex-col">
                  {competency.tags.map((tag) => (
                    <div
                      key={tag.tagCode}
                      className="flex flex-col gap-1.5 px-5 py-1.5 lg:px-[50px]"
                    >
                      <div className="txt-b-bold">
                        <span className={color?.text}>* </span>
                        {tag.tagName}
                      </div>
                      <div
                        className={`${color?.border} relative h-9 w-full overflow-hidden rounded-[12px] border-3`}
                        style={
                          { '--progress': `${roundScore(tag.avgScore)}%` } as React.CSSProperties
                        }
                      >
                        <div
                          className={`${color?.bg} absolute inset-y-0 left-0 h-full w-(--progress)`}
                        />
                        <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                          {roundScore(tag.avgScore)}점
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-500">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
