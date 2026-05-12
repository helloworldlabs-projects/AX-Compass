import { ReactNode } from 'react';
import Section from '@/components/layout/Section';
import {
  ApplicationIcon,
  EvaluationIcon,
  ResponsibilityIcon,
  UnderstandingIcon,
} from '@/components/icons';
import { CompetencyCard } from '../ui';

type CompetencyItem = {
  icon: ReactNode;
  name: string;
  nameEn: string;
  description: string;
  subItems: string[];
};

const competencies: CompetencyItem[] = [
  {
    icon: <UnderstandingIcon className="size-6 text-purple-700 lg:size-[30px]" />,
    name: '이해',
    nameEn: 'Understand',
    description:
      'AI가 잘하는 것과 못하는 것을 구분하고, 환각·편향·최신성 한계와 결과 변동 원인을 이해하는 역량입니다.',
    subItems: [
      'AI/LLM 작동 원리 이해 역량',
      '생성형 AI 오류·리스크 이해 역량',
      '컨텍스트·제약에 따른 결과 변동 이해 역량',
    ],
  },
  {
    icon: <ApplicationIcon className="size-6 text-purple-700 lg:size-[30px]" />,
    name: '활용',
    nameEn: 'Use & Apply',
    description:
      '목표·조건·출력 형식에 맞게 요청을 구성하고, 업무 유스케이스에 적용해 실제 성과로 연결하는 역량입니다.',
    subItems: [
      '프롬프트·요구사항 명세화 역량',
      '업무 유스케이스 선정·적용 설계 역량',
      '워크플로우·도구 조합 운영 역량',
    ],
  },
  {
    icon: <EvaluationIcon className="size-6 text-purple-700 lg:size-[30px]" />,
    name: '평가·개선',
    nameEn: 'Evaluate & Improve',
    description:
      'AI 결과를 그대로 믿지 않고 근거를 검증하며, 오류·누락을 보완해 반복 개선하는 역량입니다.',
    subItems: [
      'AI 출력 사실·근거 검증 역량',
      'AI 결과 품질 기준 평가 역량',
      '실험·피드백 기반 반복 개선 역량',
    ],
  },
  {
    icon: <ResponsibilityIcon className="size-6 text-purple-700 lg:size-[30px]" />,
    name: '책임·거버넌스',
    nameEn: 'Responsible Use',
    description:
      '개인정보·기밀·저작권·조직 정책을 준수하고, 위험한 사용을 피하며 안전한 대안을 선택하는 역량입니다.',
    subItems: [
      'AI 데이터 보안·개인정보 처리 역량',
      'AI 저작권·윤리 리스크 대응 역량',
      'AI 운영 거버넌스 준수 역량',
    ],
  },
];

export function CompetencySection() {
  return (
    <Section id="ax-competency" className="scroll-mt-[110px] lg:scroll-mt-[120px]">
      <div className="flex w-full flex-col gap-[30px]">
        <div className="txt-t2">역량 설계</div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          AX Compass는 AX 전환에 필요한 역량을 기준으로 진단을 설계했습니다.
          <br />
          진단 결과는 아래 4개 역량군을 중심으로 구조화되며, 역량군별 세부 역량을 통해 강점과 보완
          포인트를 명확히 확인할 수 있습니다.
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-[30px]">
          {competencies.map((item) => (
            <CompetencyCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </Section>
  );
}
