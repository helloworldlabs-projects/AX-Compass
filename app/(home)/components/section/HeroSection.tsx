import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { BadgeCheck, ContactRound, Map, Building, type LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import Link from 'next/link';

const cards: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BadgeCheck,
    title: '검사 결과 즉시 제공',
    description: '검사 완료 후 결과를\n즉시 확인할 수 있습니다.',
  },
  {
    icon: ContactRound,
    title: '역량 기반 프로필 제공',
    description: '현재 역량 수준에 적합한\n프로필을 제공합니다.',
  },
  {
    icon: Map,
    title: '맞춤형 학습 로드맵 추천',
    description: '검사 결과 기반으로\n학습 로드맵을 추천합니다.',
  },
  {
    icon: Building,
    title: '기관 정밀 분석 지원',
    description: '기관용 정밀 분석과\n결과 리포트를 제공합니다.',
  },
];

export function HeroSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            <span className="text-purple-700">AX 역량</span>을 지금 바로 진단하세요.
          </>
        }
        description="AX 역량을 빠르게 진단하고, 역량 프로필 기반으로 필요한 AI 학습 방향을 확인하세요."
        as="h1"
      />
      <Button render={<Link href="/assessment" />} className="txt-st-bold h-20 lg:h-[130px]">
        검사 유형 선택 →
      </Button>
      <div className="flex max-w-[544px] flex-wrap items-center justify-center gap-6">
        {cards.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-card bg-purple-0 border-special-navy-100 flex w-[260px] shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4"
          >
            <div className="flex items-center gap-2">
              <Icon className="size-5 text-purple-700 lg:size-6" />
              <span className="txt-b-bold">{title}</span>
            </div>
            <div className="text-center whitespace-pre-line">{description}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
