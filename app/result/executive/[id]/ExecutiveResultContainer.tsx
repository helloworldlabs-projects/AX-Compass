'use client';

import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ResultCodeCard } from '../../components/ResultCodeCard';
import { BadgeCheck, Map } from 'lucide-react';
import { MaturityLevelCard } from '@/app/institution/_components/MaturityLevelCard';
import { CompetencyScorePanel } from '@/components/ui/CompetencyScorePanel';
import { CurriculumItem } from '@/components/ui/CurriculumItem';
import { GapMsChart } from '@/components/ui/GapMsChart';
import { ResultSummaryList } from '@/components/ui/ResultSummaryList';
import { Button } from '@/components/ui/button';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { useState } from 'react';
import SectionNav from '@/components/layout/SectionNav';
import type { ExecutiveResult } from '@/types/exam';
import { MATURITY_STAGE_LABEL, getCompetencyScore } from '@/constants/maturityConfig';
import { roundScore } from '@/lib/utils';

const CurriculumTreeChart = dynamic(
  () =>
    import('@/components/shared/CurriculumTreeChart').then((m) => ({
      default: m.CurriculumTreeChart,
    })),
  { ssr: false },
);

export default function ExecutiveResultContainer({ result }: { result: ExecutiveResult }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const currentStageLabel = MATURITY_STAGE_LABEL[result.currentMaturityStage];
  const targetStageLabel = MATURITY_STAGE_LABEL[result.targetMaturityStage];
  const gap = roundScore(result.currentMaturityScore - result.targetMaturityScore);

  const currentStrategy = getCompetencyScore(result.currentCompetencyScores, 'EXEC_STRATEGY');
  const currentGovernance = getCompetencyScore(result.currentCompetencyScores, 'EXEC_GOVERNANCE');
  const currentAdoption = getCompetencyScore(result.currentCompetencyScores, 'EXEC_ADOPTION');
  const currentDataSystem = getCompetencyScore(result.currentCompetencyScores, 'EXEC_DATA_SYSTEM');

  const targetStrategy = getCompetencyScore(result.targetCompetencyScores, 'EXEC_STRATEGY');
  const targetGovernance = getCompetencyScore(result.targetCompetencyScores, 'EXEC_GOVERNANCE');
  const targetAdoption = getCompetencyScore(result.targetCompetencyScores, 'EXEC_ADOPTION');
  const targetDataSystem = getCompetencyScore(result.targetCompetencyScores, 'EXEC_DATA_SYSTEM');

  const activeEdges = result.recommendedRoadmap.curriculumTree.edges.map((e) => ({
    from: e.fromNodeId,
    to: e.toNodeId,
  }));

  return (
    <>
      <SectionNav
        groups={[
          {
            groupLabel: 'AX 성숙도 검사 통계',
            items: [
              { label: 'AX 성숙도 등급', targetId: 'maturity-grade' },
              { label: '성숙도 점수 통계', targetId: 'maturity-score' },
              { label: '영역별 성숙도 통계', targetId: 'domain-stats' },
              { label: '결과 요약 해석', targetId: 'summary' },
            ],
          },
        ]}
      />
      <Container>
        <div
          data-print-hidden
          className="bg-gray-0 flex w-full max-w-[1000px] flex-col gap-3 rounded-[20px] border border-gray-100 p-3"
        >
          <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
            <CompassIcon className="size-4.5 text-white" fillOpacity="1" />
            <span className="txt-c1-bold text-white">공식 인증</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Image
              src="/images/logo/img_logo_helloworldlabs.png"
              alt=""
              width={300}
              height={30}
              className="h-[30px] w-[300px] object-contain"
              priority
            />
            <div className="txt-st2-bold text-black">에서 인증하는 공식 결과입니다.</div>
          </div>
          <div className="text-center">
            본 문서는 AX Compass 진단 결과를 바탕으로 생성되었습니다.
          </div>
          <div className="txt-c2-regular flex items-center justify-end gap-2">
            <span>발급일: {result.computedAt.split('T')[0].replace(/-/g, '.')}</span>
            <div>|</div>
            <span>결과 코드: {result.resultCode}</span>
            <div>|</div>
            <span>발급 기관: (주)헬로월드랩스</span>
          </div>
        </div>
        <Section className="w-full max-w-[1000px]">
          <div className="w-full max-w-[700px]">
            <div>
              <span className="txt-t1 mr-1.5">{result.institutionName}</span>
            </div>
            <div className="txt-st2-regular">기관 AX 성숙도 진단 결과 입니다.</div>
          </div>
          <div className="flex items-center justify-center gap-6 text-white lg:gap-[50px]">
            <div className="flex w-[140px] flex-col items-center gap-2.5 rounded-[12px] border-3 border-purple-300 bg-purple-700 py-5 shadow lg:w-[160px]">
              <div className="flex items-center gap-1">
                <BadgeCheck className="size-5" />
                <span className="txt-b-bold">현재 성숙도 수준</span>
              </div>
              <div className="txt-t2">{currentStageLabel}</div>
            </div>
            <div className="bg-special-pink-600 border-special-pink-200 flex w-[140px] flex-col items-center gap-2.5 rounded-[12px] border-3 py-5 shadow lg:w-[160px]">
              <div className="flex items-center gap-1">
                <BadgeCheck className="size-5" />
                <span className="txt-b-bold">목표 성숙도 수준</span>
              </div>
              <div className="txt-t2">{targetStageLabel}</div>
            </div>
          </div>
          <ResultCodeCard resultCode={result.resultCode} />
          <div
            id="maturity-grade"
            className="rounded-card flex w-full max-w-[700px] scroll-mt-[110px] flex-col gap-[30px] border border-gray-500 bg-white px-4 py-[50px] lg:scroll-mt-[120px] lg:px-[50px]"
          >
            <MaturityLevelCard type={result.currentMaturityStage} />
            {currentStageLabel !== targetStageLabel && (
              <MaturityLevelCard type={result.targetMaturityStage} />
            )}
          </div>
          <div id="maturity-score" className="w-full scroll-mt-[110px] lg:scroll-mt-[120px]">
            <GapMsChart
              currentScore={result.currentMaturityScore}
              currentStageLabel={currentStageLabel}
              targetScore={result.targetMaturityScore}
              targetStageLabel={targetStageLabel}
              gap={gap}
            />
          </div>
          <div
            id="domain-stats"
            className="flex w-full max-w-[728px] scroll-mt-[110px] flex-wrap items-center justify-center gap-y-[50px] lg:max-w-[1000px] lg:scroll-mt-[120px]"
          >
            <CompetencyScorePanel
              title="현재 영역별 성숙도"
              strategy={currentStrategy}
              governance={currentGovernance}
              adoption={currentAdoption}
              dataSystem={currentDataSystem}
              strokeColor="#ff5a81"
              variant="pink"
            />
            <CompetencyScorePanel
              title="목표 영역별 성숙도"
              strategy={targetStrategy}
              governance={targetGovernance}
              adoption={targetAdoption}
              dataSystem={targetDataSystem}
              strokeColor="#2e75cc"
              variant="blue"
            />
          </div>
          <div id="summary">
            <ResultSummaryList items={result.resultSummary} className="max-w-[700px]" />
          </div>
        </Section>
        <Section className="max-w-[728px] lg:max-w-[1000px]">
          <div className="flex w-full max-w-[700px] items-center">
            <div className="flex items-center gap-2 lg:gap-4">
              <Map className="size-8 text-purple-700 lg:size-10" />
              <div className="txt-t1">기관 추천 학습 로드맵</div>
            </div>
          </div>
          <div className="h-[3px] w-full rounded-full bg-purple-700" />
          <div className="flex w-full max-w-[700px] flex-col gap-2.5">
            <div className="txt-st-bold">
              <span className="text-purple-700">* </span>
              <span>AX 성숙도 진단 및 목표 수립</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="txt-b-bold text-purple-700">[커리큘럼 가이드]</div>
              <div className="flex flex-col gap-2.5">
                {result.recommendedRoadmap.curriculums.map((curriculum, index) => (
                  <CurriculumItem
                    key={index}
                    level={curriculum.step}
                    type={curriculum.role}
                    title={curriculum.curriculumName}
                    duration={String(curriculum.durationHour)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full max-w-[1000px]">
            <CurriculumTreeChart
              roadmapType="overall"
              activeNodes={result.recommendedRoadmap.curriculumTree.nodes}
              activeEdges={activeEdges}
            />
          </div>
          <div className="h-[3px] w-full rounded-full bg-purple-700" />
        </Section>
        <ResultCodeCard resultCode={result.resultCode} />
        <div data-print-hidden className="flex justify-center gap-4 lg:gap-6">
          <Button render={<Link href="/" />} variant="gray">
            메인으로
          </Button>
          <Button variant="purple" onClick={() => setInquiryOpen(true)}>
            문의하기
          </Button>
        </div>
        <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
      </Container>
    </>
  );
}
