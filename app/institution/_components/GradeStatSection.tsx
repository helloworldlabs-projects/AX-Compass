'use client';

import Section from '@/components/layout/Section';
import { GradeStatGuideModal } from '@/components/modals/GradeStatGuideModal';
import { CompetencyLevelChart } from '@/components/institution/CompetencyLevelChart';
import { BadgeCheck, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { InstitutionCompetencyStat, InstitutionLevel } from '@/types/institution';
import { INSTITUTION_LEVEL_LABEL_MAP } from '@/constants/levelConfig';

interface GradeStatSectionProps {
  competencyStats: InstitutionCompetencyStat[];
}

function getDominantLevelLabel(
  competencyCode: string,
  competencyStats: InstitutionCompetencyStat[],
): string {
  const dominantLevel = competencyStats.find((stat) => stat.competencyCode === competencyCode)
    ?.dominantLevel as InstitutionLevel | undefined;
  return dominantLevel ? INSTITUTION_LEVEL_LABEL_MAP[dominantLevel] : '-';
}

export function GradeStatSection({ competencyStats }: GradeStatSectionProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Section className="max-w-[1000px] shrink-0">
      <GradeStatGuideModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className="flex w-[700px] items-center justify-between">
        <div className="flex items-center gap-4">
          <BadgeCheck className="size-10 text-white" fill="#533699" />
          <span className="txt-t1">역량 등급 통계</span>
        </div>
        <HelpCircle
          className="text-special-dark-blue-900 size-9"
          onClick={() => setOpenModal(true)}
        />
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-red-300 bg-red-500 py-5 text-white">
          <div className="flex items-center gap-1">
            <BadgeCheck className="size-5 text-red-500" fill="white" />
            <span className="txt-b-bold">이해</span>
          </div>
          <div className="txt-t2">{getDominantLevelLabel('UNDERSTAND', competencyStats)}</div>
        </div>
        <div className="border-special-blue-300 bg-special-blue-500 flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 py-5 text-white">
          <div className="flex items-center gap-1">
            <BadgeCheck className="text-special-blue-500 size-5" fill="white" />
            <span className="txt-b-bold">활용</span>
          </div>
          <div className="txt-t2">{getDominantLevelLabel('USE_AND_APPLY', competencyStats)}</div>
        </div>
        <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-purple-300 bg-purple-700 py-5 text-white">
          <div className="flex items-center gap-1">
            <BadgeCheck className="size-5 text-purple-700" fill="white" />
            <span className="txt-b-bold">평가·개선</span>
          </div>
          <div className="txt-t2">{getDominantLevelLabel('EVALUATE', competencyStats)}</div>
        </div>
        <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-gray-300 bg-gray-700 py-5 text-white">
          <div className="flex items-center gap-1">
            <BadgeCheck className="size-5 text-gray-700" fill="white" />
            <span className="txt-b-bold">책임·거버넌스</span>
          </div>
          <div className="txt-t2">{getDominantLevelLabel('RESPONSIBLE', competencyStats)}</div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
        {competencyStats.map((stat) => (
          <CompetencyLevelChart key={stat.competencyCode} stat={stat} />
        ))}
      </div>
    </Section>
  );
}
