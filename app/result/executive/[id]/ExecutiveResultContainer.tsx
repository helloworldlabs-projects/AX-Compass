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
import { Button } from '@/components/ui/button';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { useState } from 'react';
import type { ExecutiveResult } from '@/types/exam';
import { MATURITY_STAGE_LABEL, getCompetencyScore } from '@/constants/maturityConfig';
import { roundScore } from '@/lib/utils';

const CurriculumTreeChart = dynamic(
  () => import('@/components/shared/CurriculumTreeChart').then((m) => ({ default: m.CurriculumTreeChart })),
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
    <Container>
      <div className="bg-gray-0 flex w-full max-w-[1000px] flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
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
          />
          <div className="txt-st2-bold text-black">에서 인증하는 공식 결과입니다.</div>
        </div>
        <div className="text-center">본 문서는 AX Compass 진단 결과를 바탕으로 생성되었습니다.</div>
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
        <div className="rounded-card flex w-full max-w-[700px] flex-col gap-[30px] border border-gray-500 bg-white px-4 py-[50px] lg:px-[50px]">
          <MaturityLevelCard type={result.currentMaturityStage} />
          <MaturityLevelCard type={result.targetMaturityStage} />
        </div>
        <div className="flex w-full flex-col gap-[30px]">
          <div className="mx-auto w-full max-w-[340px] lg:max-w-[900px]">
            <div className="flex items-end justify-center gap-2.5">
              <div className="relative flex h-[200px] w-[100px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">
                  {Math.round(result.currentMaturityScore * 10) / 10}
                </span>
                <div
                  className="flex w-full items-center justify-center rounded-t-[12px] border-3 border-b-0 border-purple-300 bg-purple-700 lg:rounded-t-[20px]"
                  style={{ height: `${Math.round(result.currentMaturityScore * 10) / 10}%` }}
                >
                  <span className="txt-st2-bold text-white">{currentStageLabel}</span>
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
              <div className="relative flex h-[200px] w-[100px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">{result.targetMaturityScore}</span>
                <div
                  className="bg-special-pink-600 border-special-pink-200 flex w-full items-center justify-center rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                  style={{ height: `${result.targetMaturityScore}%` }}
                >
                  <span className="txt-st2-bold text-white">{targetStageLabel}</span>
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
          <div className="mx-auto w-full max-w-[700px]">
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
        <div className="flex w-full max-w-[728px] flex-wrap items-center justify-center gap-y-[50px] lg:max-w-[1000px]">
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
        <div className="flex max-w-[700px] flex-col gap-2.5 rounded-[20px] border border-gray-500 bg-white px-2.5 py-[30px] shadow lg:px-[50px]">
          <div className="txt-st-bold">
            <span className="text-purple-700">* </span>
            검사 결과 요약
          </div>
          <ul className="list-outside list-decimal pl-5 text-black marker:text-black">
            {result.resultSummary.map((line, index) => (
              <li key={index}>
                {line.split(/\*([^*]*)\*/g).map((word, i) =>
                  i % 2 === 0 ? word : (
                    <span key={i} className="txt-b-bold">{word}</span>
                  ),
                )}
              </li>
            ))}
          </ul>
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
  );
}
