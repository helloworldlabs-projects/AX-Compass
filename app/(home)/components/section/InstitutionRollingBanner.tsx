'use client';

import Section from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

const INSTITUTIONS = [
  { name: '이젠아카데미' },
  { name: '솔트룩스' },
  { name: '동대문구시설관리공단' },
  { name: '시넥스' },
  { name: '엘캠퍼스' },
  { name: '이볼브' },
];

export function InstitutionRollingBanner() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            <span className="text-purple-700">AX 역량 검사</span> 참여 기관
          </>
        }
        description="제조, 교육, 공공, IT 등 다양한 분야의 기관이 AX 역량 강화를 위해 함께하고 있습니다."
        as="h1"
      />
      <div className="w-full overflow-hidden pb-1">
        <div className="animate-rolling-banner flex w-max gap-6">
          {[...INSTITUTIONS, ...INSTITUTIONS].map((inst, i) => (
            <div
              key={i}
              className="flex w-[240px] shrink-0 flex-col items-center justify-center gap-3 rounded-[12px] bg-white px-4 py-3 shadow"
            >
              <div className="h-[53px] w-[180px] bg-gray-200" />
              <span className="txt-b-bold text-special-dark-blue-500">{inst.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
