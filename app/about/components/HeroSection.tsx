import Section from '@/components/layout/Section';
import { SectionHeader } from '@/app/(home)/components/ui';

export function HeroSection() {
  return (
    <Section className="p-0 pt-[50px]">
      <SectionHeader
        title={
          <>
            AX 역량 진단 서비스 <span className="text-purple-700">AX Compass</span>
          </>
        }
        description="AX 전환에 필요한 역량을 진단하고, 결과 기반 학습 방향을 제안합니다."
        as="h1"
      />
    </Section>
  );
}
