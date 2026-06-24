'use client';

import Image from 'next/image';
import Section from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useInstitutions } from '@/hooks/useInstitutions';

export function InstitutionRollingBanner() {
  const { data, isLoading } = useInstitutions();

  const CARD_WIDTH = 264; // 240px card + 24px gap
  const MIN_FILL = Math.ceil(1920 / CARD_WIDTH) + 2;
  const repeatCount = data.length > 0 ? Math.ceil(MIN_FILL / data.length) : 1;
  const base = Array.from({ length: repeatCount }, () => data).flat();
  const items = [...base, ...base];

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
          {isLoading || items.length === 0
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-[240px] shrink-0 flex-col items-center justify-center gap-3 rounded-[12px] bg-white px-4 py-3 shadow"
                >
                  <div className="h-[53px] w-[180px] animate-pulse bg-gray-200" />
                  <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              ))
            : items.map((inst, i) => (
                <div
                  key={`${inst.institutionId}-${i}`}
                  className="flex w-[240px] shrink-0 flex-col items-center justify-center gap-3 rounded-[12px] bg-white px-4 py-3 shadow"
                >
                  <div className="relative h-[53px] w-[180px]">
                    <Image
                      src={inst.logoUrl}
                      alt={inst.institutionName}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="txt-b-bold text-special-dark-blue-500">{inst.institutionName}</span>
                </div>
              ))}
        </div>
      </div>
    </Section>
  );
}
