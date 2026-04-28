import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import Link from 'next/link';

export function FinalCtaSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            이제, <span className="text-special-pink-600"> AX 역량</span>을 직접 확인해 보세요.
          </>
        }
        description="AX 역량을 빠르게 진단하고, 역량 프로필 기반으로 필요한 AI 학습 방향을 확인하세요."
        as="h2"
      />
      <Button render={<Link href="/assessment" />} className="txt-st-bold h-20 lg:h-[130px]">
        검사 유형 선택 →
      </Button>
    </Section>
  );
}
