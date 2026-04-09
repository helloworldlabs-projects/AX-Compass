import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { BadgeCheck } from 'lucide-react';
import Image from 'next/image';

export function ConsultingCtaSection() {
  return (
    <Section>
      <div className="rounded-card w-full max-w-[728px] overflow-hidden shadow lg:max-w-[1000px]">
        <div className="relative flex h-[350px] items-center justify-center">
          <Image
            src="/images/main/img_card_bg.png"
            width={1000}
            height={350}
            alt="AX Compass"
            className="absolute inset-0 h-[350px] w-[1000px] object-cover"
          />
          <div className="relative flex flex-col items-center justify-center gap-6 px-2.5 lg:gap-[30px]">
            <div className="flex flex-col gap-4">
              <div className="txt-st-bold text-shadow">
                <span className="text-special-dark-blue-700 txt-t1">AX Compass</span> 는
              </div>
              <div className="text-shadow txt-st2-regular">
                진단 결과를 바탕으로 현재 수준에 맞는 학습 방향과 교육 설계를 제안합니다.
              </div>
              <div className="txt-st-bold">
                다음 학습과 성장 방향까지 전문가와 함께 구체화해 보세요.
              </div>
            </div>
            <Button className="txt-st-bold h-20 w-fit" variant={'dark-blue'}>
              AX 컨설팅 문의하기
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 px-2.5 py-5 lg:gap-4">
          <BadgeCheck className="text-special-dark-blue-500 size-6 shrink-0 lg:size-[30px]" />
          <span className="txt-st2-regular">
            AX Compass는 시스템 기반 진단과 전문가의 설계를 함께 제공합니다.
          </span>
        </div>
      </div>
    </Section>
  );
}
