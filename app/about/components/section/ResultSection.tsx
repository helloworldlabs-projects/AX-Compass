import Section from '@/components/layout/Section';
import { CardImageRow } from '../ui';

type ResultItem = {
  title: string;
  items: string[];
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
};

const generalResults: ResultItem[] = [
  {
    title: '1) 진단 결과 요약',
    items: [
      '내 점수와 핵심 결과를 한눈에 확인할 수 있습니다.',
      '검사 완료 후 조회 코드를 발급하며, 코드를 복사해 두면 나중에 동일 결과를 다시 확인할 수 있습니다.',
    ],
    imageSrc: '/images/about/img_report_general_01.png',
    imageWidth: 470,
    imageHeight: 267,
  },
  {
    title: '2) 역량 프로필(4개 역량군)',
    items: [
      '아래 4개 역량군 기준으로 현재 수준을 구조화해 제공합니다.',
      '이해(Understand)',
      '활용(Use & Apply)',
      '평가·개선(Evaluate & Improve)',
      '책임·거버넌스(Responsible Use)',
    ],
    imageSrc: '/images/about/img_report_general_02.png',
    imageWidth: 470,
    imageHeight: 466,
  },
  {
    title: '3) 역량 상세 분석(세부 역량 분포)',
    items: [
      '4개 역량군 각각에 대해 세부 역량(3개) 분포를 레이더 차트와 점수 바 형태로 제공합니다.',
      '강점/보완 영역이 어디인지 직관적으로 확인할 수 있습니다.',
    ],
    imageSrc: '/images/about/img_report_general_03.png',
    imageWidth: 470,
    imageHeight: 564,
  },
  {
    title: '4) 나의 프로필 유형',
    items: [
      '진단 결과를 바탕으로 대표 프로필 유형을 제공하고, 특징과 강점/보완 포인트를 요약해 안내합니다.',
    ],
    imageSrc: '/images/about/img_report_general_04.png',
    imageWidth: 470,
    imageHeight: 504,
  },
  {
    title: '5) 맞춤형 학습 로드맵 추천',
    items: [
      '진단 결과를 바탕으로, 학습 로드맵을 추천합니다.',
      '추천 주제별로 Step 단위 학습 흐름과 커리큘럼 구조를 함께 제공합니다.',
    ],
    imageSrc: '/images/about/img_report_general_05.png',
    imageWidth: 470,
    imageHeight: 510,
  },
];

const orgResults: ResultItem[] = [
  {
    title: '1) 기관 AX 성숙도',
    items: [
      '기관의 AX 성숙도를 진단해 현재 수준과 목표 수준을 객관적으로 확인할 수 있습니다.',
      '결과를 바탕으로 조직에 맞는 우선 과제와 실행 방향을 빠르게 설계할 수 있습니다.',
    ],
    imageSrc: '/images/about/img_report_organization_01.png',
    imageWidth: 470,
    imageHeight: 550,
  },
  {
    title: '2) 역량 등급/분포 통계(4개 역량군)',
    items: [
      '4개 역량군(이해/활용/평가·개선/책임·거버넌스)별로 구성원의 등급 분포와 편차를 통계로 확인할 수 있습니다.',
    ],
    imageSrc: '/images/about/img_report_organization_02.png',
    imageWidth: 470,
    imageHeight: 479,
  },
  {
    title: '3) 역량 상세 분석(기관 평균/분포)',
    items: [
      '역량군별 세부 역량(3개) 수준을 레이더 차트와 점수 바 형태로 제공합니다.',
      '교육 설계 시 우선 보완 영역을 잡는 데 활용할 수 있습니다.',
    ],
    imageSrc: '/images/about/img_report_organization_03.png',
    imageWidth: 470,
    imageHeight: 856,
  },
  {
    title: '4) 프로필 유형 통계(조직 분포)',
    items: [
      '구성원의 프로필 유형 분포를 제공합니다.',
      '조직의 전반적 특성과 운영 시 주의 포인트를 함께 확인할 수 있습니다.',
    ],
    imageSrc: '/images/about/img_report_organization_04.png',
    imageWidth: 470,
    imageHeight: 523,
  },
  {
    title: '5) 기관 학습 로드맵 추천',
    items: [
      '조직원의 진단 결과를 바탕으로, 학습 로드맵을 추천합니다.',
      '주제별 Step 흐름과 커리큘럼 구조를 통해, 기관은 교육 운영 우선순위와 실행 계획을 정리할 수 있습니다.',
    ],
    imageSrc: '/images/about/img_report_organization_05.png',
    imageWidth: 470,
    imageHeight: 619,
  },
];

export function ResultSection() {
  return (
    <Section id="ax-result" className="scroll-mt-[110px] lg:scroll-mt-[120px]">
      <div className="flex w-full flex-col gap-[30px]">
        <div className="txt-t2">검사 결과 내용</div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          AX Compass는 정밀 검사 기준으로, 개인과 기관에 필요한 형태로 결과를 제공합니다.
          <br />
          개인은 내 역량 프로필과 학습 로드맵, 기관은 조직 현황과 운영용 리포트를 중심으로 확인할 수
          있습니다.
        </div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          <div className="txt-st-bold">개인 결과지(일반/개인용)</div>
          <div className="flex flex-col gap-6">
            {generalResults.map((item) => (
              <CardImageRow key={item.title} {...item} />
            ))}
          </div>
        </div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          <div className="txt-st-bold">기관 결과지(조직 리포트)</div>
          <div className="flex flex-col gap-6">
            {orgResults.map((item) => (
              <CardImageRow key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
