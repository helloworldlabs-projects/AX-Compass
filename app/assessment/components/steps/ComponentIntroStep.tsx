import type { ExamType, ItemComponent } from '@/types/exam';
import Image from 'next/image';

const INTRO_LABEL: Record<
  ExamType,
  Partial<
    Record<
      ItemComponent,
      { title: string; description: string[]; warning: string[]; imageSrc: string }
    >
  >
> = {
  STANDARD: {
    SELF_ESTIMATE: {
      title: '※ Step 1. 자기평가',
      description: [
        '지금부터는 AI와 AX 역량에 대해 스스로 어떻게 인식하고 있는지를 확인합니다.',
        '각 문항을 읽고, 현재 본인이 느끼는 이해 수준과 활용 자신감에 가장 가까운 정도를 별점으로 선택해 주세요.',
      ],
      warning: [
        '정답이 있는 평가는 아닙니다. 자신을 과하게 높이거나 낮게 평가하기보다, 현재 업무와 학습 상황에서 실제로 느끼는 수준을 기준으로 응답해 주세요.',
      ],
      imageSrc: '/images/assessment/img_intro_01.png',
    },
    SITUATIONAL_JUDGMENT: {
      title: '※ Step 2. 상황판단 평가',
      description: [
        '지금부터는 AI 활용 상황에서 어떤 판단을 내리는지를 확인합니다.',
        '제시되는 업무 상황을 읽고, 4개의 선택지 중 해당 상황에서 가장 적절하다고 생각하는 답변을 선택해 주세요.',
      ],
      warning: [
        '각 문항의 상황, 요청 내용, 조건을 함께 살펴본 뒤 응답해 주세요.',
        '평소 습관이나 선호보다, 제시된 상황에서 가장 타당하다고 판단되는 선택지를 골라 주세요.',
      ],
      imageSrc: '/images/assessment/img_intro_02.png',
    },
    BEHAVIOR_HABIT: {
      title: '※ Step 3. 행동빈도 평가',
      description: [
        '지금부터는 AI를 실제 업무나 학습 과정에서 얼마나 자주, 어떤 방식으로 활용하고 있는지를 확인합니다.',
        '각 문항을 읽고, 최근 실제 행동과 가장 가까운 빈도를 별점으로 선택해 주세요.',
      ],
      warning: [
        '잘해야 한다고 생각하는 방식이 아니라, 실제로 얼마나 자주 실행하고 있는지를 기준으로 응답해 주세요.',
        'AI 사용 횟수뿐 아니라 결과 확인, 수정, 재질문, 업무 적용 습관도 함께 고려해 주세요.',
      ],
      imageSrc: '/images/assessment/img_intro_03.png',
    },
  },
  PRECISION: {
    SELF_ESTIMATE: {
      title: '※ Step 1. 자기평가',
      description: [
        '지금부터는 AI와 AX 역량에 대해 스스로 어떻게 인식하고 있는지를 확인합니다.',
        '각 문항을 읽고, 현재 본인이 느끼는 이해 수준과 활용 자신감에 가장 가까운 정도를 별점으로 선택해 주세요.',
      ],
      warning: [
        '정답이 있는 평가는 아닙니다. 자신을 과하게 높이거나 낮게 평가하기보다, 현재 업무와 학습 상황에서 실제로 느끼는 수준을 기준으로 응답해 주세요.',
      ],
      imageSrc: '/images/assessment/img_intro_01.png',
    },
    SITUATIONAL_JUDGMENT: {
      title: '※ Step 2. 상황판단 평가',
      description: [
        '지금부터는 AI 활용 상황에서 어떤 판단을 내리는지를 확인합니다.',
        '제시되는 업무 상황을 읽고, 4개의 선택지 중 해당 상황에서 가장 적절하다고 생각하는 답변을 선택해 주세요.',
      ],
      warning: [
        '각 문항의 상황, 요청 내용, 조건을 함께 살펴본 뒤 응답해 주세요.',
        '평소 습관이나 선호보다, 제시된 상황에서 가장 타당하다고 판단되는 선택지를 골라 주세요.',
      ],
      imageSrc: '/images/assessment/img_intro_02.png',
    },
    BEHAVIOR_HABIT: {
      title: '※ Step 3. 행동빈도 평가',
      description: [
        '지금부터는 AI를 실제 업무나 학습 과정에서 얼마나 자주, 어떤 방식으로 활용하고 있는지를 확인합니다.',
        '각 문항을 읽고, 최근 실제 행동과 가장 가까운 빈도를 별점으로 선택해 주세요.',
      ],
      warning: [
        '잘해야 한다고 생각하는 방식이 아니라, 실제로 얼마나 자주 실행하고 있는지를 기준으로 응답해 주세요.',
        'AI 사용 횟수뿐 아니라 결과 확인, 수정, 재질문, 업무 적용 습관도 함께 고려해 주세요.',
      ],
      imageSrc: '/images/assessment/img_intro_03.png',
    },
  },
  EXECUTIVE: {
    CURRENT_MATURITY: {
      title: '※ Step 1. 기업의 현재 AX 수준',
      description: [
        '현재 우리 조직의 AX 수준을 확인합니다.',
        'AI와 AX가 실제 업무와 조직 운영에 어느 정도 적용되고 있는지, 현재 상태에 가장 가까운 응답을 선택해 주세요.',
      ],
      warning: [
        '앞으로의 계획이나 기대가 아니라, 지금 실제로 실행되고 있는 수준을 기준으로 응답해 주세요.',
      ],
      imageSrc: '/images/assessment/img_intro_executive_01.png',
    },
    TARGET_MATURITY: {
      title: '※ Step 2. 기업의 목표 AX 수준',
      description: [
        '우리 조직이 앞으로 도달하고자 하는 AX 목표 수준을 확인합니다.',
        'AI와 AX를 업무와 조직 운영 전반에 어느 정도까지 확장하고 싶은지, 목표에 가장 가까운 응답을 선택해 주세요.',
      ],
      warning: [
        '가장 높은 수준을 선택하기보다, 조직의 방향과 현실적인 실행 여건을 함께 고려해 응답해 주세요.',
      ],
      imageSrc: '/images/assessment/img_intro_executive_01.png',
    },
  },
};

interface ComponentIntroStepProps {
  component: ItemComponent;
  examType: ExamType;
}

export default function ComponentIntroStep({ component, examType }: ComponentIntroStepProps) {
  const stepInfo = INTRO_LABEL[examType]?.[component];

  if (!stepInfo) return null;

  return (
    <div className="rounded-card flex min-h-[500px] flex-col items-center justify-center gap-6 bg-white px-4 py-6 shadow lg:px-20">
      <div className="txt-t3 text-shadow text-center text-purple-700">{stepInfo.title}</div>
      <div className="flex flex-wrap gap-6">
        <div className="flex min-w-[300px] flex-1 shrink-0 flex-col gap-6">
          <div className="rounded-card bg-purple-0 flex flex-col gap-2.5 p-3 shadow lg:p-5">
            <div className="txt-st2-bold">* 평가 안내</div>
            <ul className="ml-5 list-outside list-disc">
              {stepInfo.description.map((text, index) => (
                <li key={index} className="txt-b-regular text-black">
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-purple-0 flex flex-col gap-2.5 p-3 shadow lg:p-5">
            <div className="txt-st2-bold">* 주의사항</div>
            <ul className="ml-4 flex list-outside list-disc flex-col gap-1">
              {stepInfo.warning.map((text, index) => (
                <li key={index} className="txt-b-regular text-black">
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex min-w-[300px] flex-1 shrink-0">
          <Image
            src={stepInfo.imageSrc}
            alt=""
            width={408}
            height={233}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
