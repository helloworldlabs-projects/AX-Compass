import Section from '@/components/layout/Section';
import { Search, Layers, Map, type LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const cards: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Search,
    title: '현재 수준을 정확히 알아야 합니다',
    description:
      'AI를 사용하고 있어도 실제 수준은 막연할 수 있습니다.\n현재 수준을 알아야 다음 학습 방향을 제대로 정할 수 있습니다.',
  },
  {
    icon: Layers,
    title: '많이 쓰는 것과 잘 쓰는 것은 다릅니다',
    description:
      '사용 빈도가 높아도 판단, 검증, 실행 습관까지 충분하다고 보기는 어렵습니다.\nAX 역량은 여러 관점에서 함께 확인해야 합니다.',
  },
  {
    icon: Map,
    title: '발전하려면 다음 로드맵이 필요합니다',
    description:
      '지금 어디에 있는지 아는 것만큼, 다음에 무엇을 해야 하는지 아는 것도 중요합니다.\n우선순위가 보이면 더 빠르게 성장하고 실제 업무에 연결할 수 있습니다.',
  },
];
export function AssessmentNeedSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            왜 <span className="text-purple-700">AX 역량</span> 검사가 필요할까요?
          </>
        }
        description={[
          'AI를 사용하고 있어도 현재 수준이 어느 정도인지, 무엇을 먼저 보완해야 하는지는 쉽게 알기 어렵습니다.',
          'AX 역량 검사는 지금의 상태를 확인하고, 더 발전하기 위한 학습 방향을 찾는 데 도움을 줍니다.',
        ]}
        as="h2"
      />
      <div className="flex w-full max-w-[728px] flex-col gap-6">
        {cards.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-card bg-purple-0 border-special-navy-100 flex w-full shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4"
          >
            <div className="flex items-center gap-2">
              <Icon className="size-6 text-purple-700 lg:size-[30px]" />
              <span className="txt-st2-bold">{title}</span>
            </div>
            <div className="text-center whitespace-pre-line">{description}</div>
          </div>
        ))}
      </div>
      <div className="txt-st2-bold text-center">
        <span className="text-purple-700">*</span> 현재 수준을 알고, 다음 학습 방향을 아는 것이{' '}
        <span className="text-purple-700">AX 역량 성장의 시작</span>입니다.
      </div>
    </Section>
  );
}
