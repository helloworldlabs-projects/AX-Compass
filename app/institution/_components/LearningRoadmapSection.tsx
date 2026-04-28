'use client';

import Section from '@/components/layout/Section';
import { LearningRoadmapGuideModal } from '@/components/modals/LearningRoadmapGuideModal';
import { Button } from '@/components/ui/button';
import { CurriculumItem } from '@/components/ui/CurriculumItem';
import { CurriculumTreeChart } from '@/components/shared/CurriculumTreeChart';
import { HelpCircle, Map } from 'lucide-react';
import { useState } from 'react';
import type { InstitutionRoadmaps } from '@/types/institution';

interface LearningRoadmapSectionProps {
  institutionRoadmap: InstitutionRoadmaps;
}

export function LearningRoadmapSection({ institutionRoadmap }: LearningRoadmapSectionProps) {
  const [selectedRoadmap, setSelectedRoadmap] = useState<
    'overall' | 'beginnerElementary' | 'intermediateAdvanced'
  >('overall');
  const [openModal, setOpenModal] = useState(false);

  const roadmap =
    selectedRoadmap === 'overall'
      ? institutionRoadmap.overallRoadmap
      : selectedRoadmap === 'beginnerElementary'
        ? institutionRoadmap.beginnerElementaryRoadmap
        : institutionRoadmap.intermediateAdvancedRoadmap;

  return (
    <Section className="max-w-[1000px] shrink-0">
      <LearningRoadmapGuideModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className="flex w-[700px] items-center justify-between">
        <div className="flex items-center gap-4">
          <Map className="size-10 text-purple-700" />
          <span className="txt-t1">기관 추천 학습 로드맵</span>
        </div>
        <HelpCircle
          className="text-special-dark-blue-900 size-9"
          onClick={() => setOpenModal(true)}
        />
      </div>
      <div className="flex w-full flex-col gap-6 rounded-[20px] border border-gray-500 p-6 shadow">
        <div className="flex w-full gap-4">
          <Button
            variant={selectedRoadmap === 'overall' ? 'purple' : 'gray'}
            className="txt-t3 h-20 flex-1"
            onClick={() => setSelectedRoadmap('overall')}
          >
            전체({institutionRoadmap.overallCount}명)
          </Button>
          {institutionRoadmap.beginnerElementaryCount > 0 && (
            <Button
              variant={selectedRoadmap === 'beginnerElementary' ? 'purple' : 'gray'}
              className="txt-t3 h-20 flex-1"
              onClick={() => setSelectedRoadmap('beginnerElementary')}
            >
              입문-초급({institutionRoadmap.beginnerElementaryCount}명)
            </Button>
          )}
          {institutionRoadmap.intermediateAdvancedCount > 0 && (
            <Button
              variant={selectedRoadmap === 'intermediateAdvanced' ? 'purple' : 'gray'}
              className="txt-t3 h-20 flex-1"
              onClick={() => setSelectedRoadmap('intermediateAdvanced')}
            >
              중급-고급({institutionRoadmap.intermediateAdvancedCount}명)
            </Button>
          )}
        </div>
      </div>

      {roadmap?.steps.map((step, index) => (
        <div
          key={step.stepId}
          className="flex w-full flex-col items-center gap-[50px] lg:gap-[75px]"
        >
          <div className="h-[3px] w-full rounded-full bg-purple-700" />
          <div className="flex w-full max-w-[700px] flex-col gap-2.5">
            <div className="txt-st-bold">
              <span className="text-purple-700">* </span>
              <span>Step {index + 1}. </span>
              <span>{step.stepName}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="txt-b-bold text-purple-700">[커리큘럼 가이드]</div>
              <div className="flex flex-col gap-2.5">
                {step.curriculumItems.map((curriculumItem) => (
                  <CurriculumItem
                    key={curriculumItem.curriculumName}
                    level={curriculumItem.step}
                    type={curriculumItem.role}
                    title={curriculumItem.curriculumName}
                    duration={curriculumItem.durationHour.toString()}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="txt-b-bold text-purple-700">[프로필 유형별 학습 Tip]</div>
              <ul className="txt-b-regular flex list-outside list-disc flex-col gap-2.5 pl-5 text-black marker:text-black">
                {step.learningTips.map((tip) => (
                  <li key={tip} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full max-w-[1000px]">
            <CurriculumTreeChart
              roadmapType={selectedRoadmap}
              activeNodes={step.curriculumTree.nodes}
              activeEdges={step.curriculumTree.edges}
            />
          </div>
        </div>
      ))}
    </Section>
  );
}
