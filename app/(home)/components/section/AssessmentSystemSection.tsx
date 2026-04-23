import Image from 'next/image';
import Section from '@/components/layout/Section';
import { Check } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

type SystemItem = {
  imageSrc: string;
  title: string;
  description: string;
  checkText: string;
};

const items: SystemItem[] = [
  {
    imageSrc: '/images/main/img_system_01.png',
    title: '3가지 문항 유형 통합 진단',
    description:
      '자기 평가, 상황 판단, 행동 빈도 결과를 함께 분석해\n현재 역량과 활용 패턴을 다각도로 진단합니다.',
    checkText: '인식, 판단, 실행을 함께 확인하는 복합 진단 구조입니다.',
  },
  {
    imageSrc: '/images/main/img_system_02.png',
    title: '4대 역량 구조 기반 해석',
    description: '이해, 활용, 평가·개선, 책임·거버넌스 기준으로\n결과를 구조적으로 해석합니다.',
    checkText: '단순 총점이 아니라, 어떤 역량에서 차이가 나는지 확인합니다.',
  },
  {
    imageSrc: '/images/main/img_system_03.png',
    title: '프로필 유형 도출',
    description: '응답 패턴을 분석해 현재의 활용 성향을\n프로필 유형으로 직관적으로 보여줍니다.',
    checkText: '점수뿐 아니라, AI를 활용하는 방식의 특징까지 함께 보여줍니다.',
  },
  {
    imageSrc: '/images/main/img_system_04.png',
    title: '결과 기반 학습 로드맵 연결',
    description: '진단 결과와 관심 주제를 반영해\n현재 수준에 맞는 학습 흐름을 제안합니다.',
    checkText: '무엇을 먼저 배우고, 다음에 무엇을 확장할지 흐름으로 제안합니다.',
  },
];

export function AssessmentSystemSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            AX Compass의 <span className="text-special-pink-600">검사 시스템</span>
          </>
        }
        description={[
          'AX Compass는 단순 점수 평가가 아니라, 인식·판단·실행을 함께 진단하고',
          '그 결과를 학습 로드맵까지 연결하도록 설계되어 있습니다.',
        ]}
        as="h2"
      />
      <div className="flex max-w-[728px] flex-col gap-[50px]">
        {items.map((item) => (
          <div
            key={item.imageSrc}
            className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]"
          >
            <Image
              src={item.imageSrc}
              width={300}
              height={300}
              alt=""
              className="rounded-card h-[300px] w-[300px] shrink-0 object-cover shadow"
            />
            <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
              <div className="txt-st2-bold text-center">{item.title}</div>
              <div className="text-center whitespace-pre-line">{item.description}</div>
              <div className="border-special-pink-100 rounded-card flex items-center gap-3 border-3 bg-white p-3 lg:gap-4 lg:p-4">
                <Check className="text-special-pink-600 size-5 lg:size-6" />
                <span>{item.checkText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="txt-st2-bold text-center">
        <span className="text-special-pink-600">*</span> AX Compass는{' '}
        <span className="text-special-pink-600">복합 진단 결과</span>와{' '}
        <span className="text-special-pink-600 break-keep">희망 학습 주제를 결합</span>해,
        <br />
        현재 수준에 맞는 학습 흐름을 제안합니다.
      </div>
    </Section>
  );
}
