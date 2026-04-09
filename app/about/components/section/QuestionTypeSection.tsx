import Section from '@/components/layout/Section';
import { CardImageRow } from '../ui';

type QuestionTypeItem = {
  title: string;
  items: string[];
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
};

const questionTypes: QuestionTypeItem[] = [
  {
    title: '1) 자기 평가 (별점형)',
    items: [
      '"나는 ~할 수 있다" 형태의 자기보고 문항에 1~5점으로 응답합니다.',
      '현재 수준에 대한 자기 인식과 자신감, 준비도를 빠르게 점검할 수 있어 진단 진입 부담이 낮습니다.',
      '자기평가 문항은 진단의 한 부분으로 활용되며, 상황 판단과 행동 빈도 문항과 함께 역량을 종합적으로 확인합니다.',
    ],
    imageSrc: '/images/about/img_question_type_01.png',
    imageWidth: 470,
    imageHeight: 251,
  },
  {
    title: '2) 상황 판단 평가 (SJT, 선택형)',
    items: [
      '관련 업무 상황을 제시하고 가장 적절한 선택지를 고르는 방식입니다.',
      '실제 업무에서 어떤 기준으로 판단하고 어떤 방식으로 문제를 해결하는지 확인할 수 있습니다.',
      '자기평가에서 드러나지 않는 "실제 판단 방식"이 반영되어, 결과가 더 현실적인 방향으로 정리됩니다.',
    ],
    imageSrc: '/images/about/img_question_type_02.png',
    imageWidth: 470,
    imageHeight: 251,
  },
  {
    title: '3) 행동 빈도 평가 (별점형)',
    items: [
      '"최근 1개월 동안 ~을 얼마나 자주 했나" 형태의 문항에 1~5점으로 응답합니다.',
      '알고 있는지/판단할 수 있는지와 별개로, 실제 업무에서 얼마나 실행되고 있는지를 확인합니다.',
      '이를 통해 추천 로드맵이 단순 이론이 아니라, 현재의 실행 수준을 고려한 방향으로 제안될 수 있습니다.',
    ],
    imageSrc: '/images/about/img_question_type_03.png',
    imageWidth: 470,
    imageHeight: 251,
  },
];

export function QuestionTypeSection() {
  return (
    <Section>
      <div className="flex w-full flex-col gap-[30px]">
        <div className="txt-t2">문항 유형 구성</div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          <div>
            AX Compass는 한 가지 질문 방식만으로 판단하지 않고, 아래 3가지 문항 유형을 함께
            사용합니다.
            <br />
            이는 사용자의 역량을 이해–판단–실행 관점에서 균형 있게 확인하고, 진단 결과(역량
            프로필/추천 로드맵)의 타당도를 높이기 위한 구성입니다.
          </div>
          <div className="flex flex-col gap-6">
            {questionTypes.map((item) => (
              <CardImageRow key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
