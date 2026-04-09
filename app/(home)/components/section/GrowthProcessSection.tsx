import Section from '@/components/layout/Section';
import { ShieldBadge } from '@/components/ui/ShieldBadge';
import { SectionHeader } from '../ui';

type StageItem = {
  number: number;
  title: string;
  description: string;
};

type Stage = {
  label: string;
  color: string;
  borderColor: string;
  items: StageItem[];
};

const stages: Stage[] = [
  {
    label: '진단',
    color: 'var(--color-special-dark-blue-300)',
    borderColor: 'var(--color-special-dark-blue-100)',
    items: [
      {
        number: 1,
        title: '역량 검사',
        description:
          '자기 평가, 상황 판단, 행동 빈도 문항을 통해 AX 역량과 활용 패턴을 진단합니다.\n지금 어느 수준에서 어떻게 활용하고 있는지 구조적으로 확인합니다.',
      },
      {
        number: 2,
        title: '역량 및 프로필 분석',
        description:
          '4대 역량 결과와 프로필 유형을 바탕으로 현재 강점과 보완 포인트를 확인합니다.\n무엇이 부족한지뿐 아니라, 어떤 방식으로 활용하고 있는지도 함께 파악합니다.',
      },
    ],
  },
  {
    label: '설계 · 교육',
    color: 'var(--color-special-dark-blue-500)',
    borderColor: 'var(--color-special-dark-blue-300)',
    items: [
      {
        number: 3,
        title: '맞춤형 학습 로드맵 제공',
        description:
          '역량 결과를 바탕으로 무엇을 배우고 어떤 순서로 확장할지 로드맵을 제공합니다.\n현재 수준에 맞는 학습 시작점과 다음 단계를 제안합니다.',
      },
      {
        number: 4,
        title: '실제 환경에 맞는 커리큘럼 제안',
        description:
          '사용 중인 AI 도구와 업무 환경에 맞춰 실제 적용 가능한 커리큘럼을 제안합니다.\n단순 이론이 아니라, 현업에 바로 활용할 수 있는 실무 흐름으로 연결합니다.',
      },
      {
        number: 5,
        title: '실무 과제 중심(PBL) 교육 진행',
        description:
          '추천된 주제와 커리큘럼을 바탕으로, 실제 업무와 연결된 과제를 수행합니다.\n배운 내용을 바로 적용, 검증하며 실질적인 역량 향상으로 이어갑니다.',
      },
    ],
  },
  {
    label: '분석 · 확장',
    color: 'var(--color-special-dark-blue-800)',
    borderColor: 'var(--color-special-dark-blue-300)',
    items: [
      {
        number: 6,
        title: '추가 역량 검사 및 전후 비교',
        description:
          '교육 이후 추가 진단을 통해, 이전 대비 변화와 성장 정도를 다시 확인합니다.\n교육 전후 결과를 비교해 어떤 역량이 개선되었는지 구체적으로 확인할 수 있습니다.',
      },
      {
        number: 7,
        title: '피드백 및 다음 스텝 제안',
        description:
          '교육 전후 결과를 바탕으로 다음에 필요한 학습과 운영 방향을 이어서 제안합니다.\n한 번의 진단으로 끝나지 않고, 다음 성장 단계까지 연결되는 흐름을 제공합니다.',
      },
    ],
  },
];

export function GrowthProcessSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            검사로 끝나지 않는 <span className="text-special-navy-500">AX 성장 로직</span>
          </>
        }
        description={[
          'AX Compass는 현재 역량을 진단하는 데서 멈추지 않습니다.',
          '결과를 바탕으로 맞춤형 학습 방향과 실제 교육, 다음 성장 단계까지 연결합니다.',
        ]}
        as="h2"
      />
      <div className="flex flex-col gap-[50px]">
        {stages.map((stage) => (
          <div key={stage.label} className="flex flex-col gap-1.5 lg:gap-2.5">
            <div className="bg-special-navy-500 rounded-card border-special-navy-100 txt-b-bold w-fit border px-[30px] py-2.5 text-white">
              {stage.label}
            </div>
            <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-6 p-4 lg:gap-[30px] lg:p-[30px]">
              {stage.items.map((item) => (
                <div key={item.number} className="flex gap-4 lg:gap-6">
                  <ShieldBadge color={stage.color} borderColor={stage.borderColor}>
                    {item.number}
                  </ShieldBadge>
                  <div className="flex flex-col gap-1.5 lg:gap-2.5">
                    <h3 className="txt-st2-bold">{item.title}</h3>
                    <p className="whitespace-pre-line">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="txt-st2-bold text-center">
        <span className="text-special-dark-blue-500">*</span> AX Compass는{' '}
        <span className="text-special-dark-blue-500">진단 이후의 학습과 다음 성장 단계</span>까지
        함께 설계합니다.
      </div>
    </Section>
  );
}
