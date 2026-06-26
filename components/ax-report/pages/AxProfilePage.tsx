import { NotepadText } from 'lucide-react';
import {
  AxProfileDonutChart,
  PROFILE_ORDER,
  PROFILE_TYPE_CONFIG,
} from '../AxProfileDonutChart';
import { AxProfileRadarChart } from '../AxProfileRadarChart';
import {
  getAxInsightContent,
  type AxProfileSection,
  type AxProfileType,
} from '../../../types/ax-report';
import Image from 'next/image';

interface AxProfilePageProps {
  data: AxProfileSection;
}

interface ProfileContent {
  imageSrc: string;
  description: string;
  strengths: string[];
  improvements: string[];
}

const PROFILE_CONTENT: Record<AxProfileType, ProfileContent> = {
  BALANCED: {
    imageSrc: '/images/report/img_balanced.png',
    description:
      '판단과 실행이 고르게 나타나며, AX를 이해하는 과정과 실제 활용하는 과정이 비교적 안정적으로 균형을 이루는 타입.',
    strengths: [
      '필요한 순간에 AI를 적절하게 활용해 생산성을 꾸준히 높일 수 있다.',
      '결과를 검토하고 다듬는 루틴이 있어 실무 품질이 비교적 안정적으로 유지된다.',
      '활용 기준과 작업 방식이 정리되어 있어 업무 적용 흐름이 예측 가능하고 일관적이다.',
    ],
    improvements: [
      '필요한 순간에 AI를 적절하게 활용해 생산성을 꾸준히 높일 수 있다.',
      '결과를 검토하고 다듬는 루틴이 있어 실무 품질이 비교적 안정적으로 유지된다.',
      '활용 기준과 작업 방식이 정리되어 있어 업무 적용 흐름이 예측 가능하고 일관적이다.',
    ],
  },
  LEARNER: {
    imageSrc: '/images/report/img_learner.png',
    description:
      '개념과 원리를 먼저 이해하는 데 강점이 있으며, 이해한 내용을 바탕으로 실제 적용 가능성과 활용 방법을 차근차근 연결해 나가는 타입.',
    strengths: [
      'AI의 구조와 한계, 주의할 점을 비교적 잘 이해하고 설명할 수 있다.',
      '새로운 개념이나 가이드를 받아들이는 속도가 빨라 학습력이 좋은 편이다.',
      '기본 이해를 바탕으로 성장 여지가 커, 적용 경험이 쌓일수록 빠르게 확장될 가능성이 있다.',
    ],
    improvements: [
      '업무를 나누고 요청을 구조화하는 적용 방식을 익히면 이해가 활용으로 더 잘 이어질 수 있다.',
      '반복적으로 사용하는 루틴을 만들면 학습한 내용이 실제 업무 습관으로 더 자리잡는 데 도움이 된다.',
      '결과를 점검하는 최소 기준을 정리하면 활용 자신감과 적용 안정성을 함께 높일 수 있다.',
    ],
  },
  DOER: {
    imageSrc: '/images/report/img_doer.png',
    description:
      '실행 전환이 빠르고 새로운 도구를 실제로 활용해보는 데 적극적이며, 직접 써보는 경험을 통해 활용 감각과 적용 범위를 넓혀가는 타입.',
    strengths: [
      '업무 적용 속도가 빠르고 새로운 방식도 부담 없이 시도해볼 수 있다.',
      '도구나 프롬프트를 실제 업무 흐름에 자연스럽게 연결해 활용하는 데 익숙하다.',
      '직접 사용해보며 개선점을 찾고, 실무 안에서 빠르게 활용 가능성을 확인해 나간다.',
    ],
    improvements: [
      '출처 확인이나 테스트 같은 검증 루틴을 함께 갖추면 결과 품질이 더 안정될 수 있다.',
      '민감정보·저작권·사실 확인 기준을 정리하면 활용 범위를 더 안전하게 넓힐 수 있다.',
      '요청 방식과 출력 형식을 표준화하면 결과 편차를 줄이고 재사용성을 높일 수 있다.',
    ],
  },
  OVERCONFIDENT: {
    imageSrc: '/images/report/img_overconfident.png',
    description:
      '자신감을 바탕으로 새로운 도구나 방식을 빠르게 시도하는 편이며, 판단과 검증보다 확신이 먼저 형성되는 경향이 비교적 뚜렷하게 나타나는 타입.',
    strengths: [
      '새로운 도구나 방식을 주저하지 않고 먼저 시도해보는 추진력이 강하다.',
      '아이디어의 발산이나 초안 작성 단계에서 속도감 있게 결과를 만들어낼 수 있다.',
      '변화에 대한 거부감이 낮아 새로운 활용 방식을 빠르게 받아들이고 실행으로 옮길 수 있다.',
    ],
    improvements: [
      '근거 확인과 수정, 재검토 루틴을 함께 갖추면 강한 추진력이 더 안정적인 성과로 이어질 수 있다.',
      '보안·저작권·사실 확인 기준을 미리 정리하면 활용 자신감도를 높이는 데 도움이 된다.',
      '결과 품질을 점검할 수 있는 기준을 마련하면 확신과 실행력이 더 효과적으로 발휘될 수 있다.',
    ],
  },
  ANALYST: {
    imageSrc: '/images/report/img_analyst.png',
    description:
      '위험 요소와 활용 맥락을 신중하게 살피는 편이며, 충분한 검토와 판단을 바탕으로 실행 방향과 활용 가능성을 정리해 나가는 타입.',
    strengths: [
      '결과의 허점이나 누락 가능성을 비교적 빠르게 발견하고 점검할 수 있다.',
      '보안·윤리·품질 기준을 중요하게 여기며 안정적인 활용 방향을 잡는 데 강점이 있다.',
      '의사결정의 전제와 기준을 정리해 팀 내 커뮤니케이션을 명확하게 만드는 데 도움이 된다.',
    ],
    improvements: [
      '작은 과제부터 빠르게 적용해보는 경험이 쌓이면 판단 실 사용성과로 더 잘 이어질 수 있다.',
      '완성도를 확보한 뒤 시작하기보다 템플릿 기반으로 반복 사용을 시작하면 활용 폭이 넓어진다.',
      '일정한 사용 루틴을 만들면 신중한 판단력이 실무 활용력으로 더 자연스럽게 연결될 수 있다.',
    ],
  },
  CAUTIOUS: {
    imageSrc: '/images/report/img_cautious.png',
    description:
      '안정성과 익숙함을 우선해 새로운 활용에 천천히 접근하는 편이며, 부담이 낮고 익숙한 방식부터 활용 범위를 점차 넓혀가는 타입.',
    strengths: [
      '리스크에 대한 감각이 있어 민감정보나 규정 위반 가능성을 낮추는 데 강점이 있다.',
      '기준이 정리된 환경에서는 비교적 안정되고 일관된 방식으로 활용할 수 있다.',
      '예외 상황이나 위험 요소를 먼저 고려해 안전한 활용 흐름을 만드는 데 도움이 된다.',
    ],
    improvements: [
      '안전한 사용 템플릿을 바탕으로 작은 과제부터 시작하면 활용 진입 장벽을 낮출 수 있다.',
      '결과를 스스로 점검할 수 있는 체크리스트를 갖추면 활용 자신감을 높이는 데 도움이 된다.',
      '시도 빈도를 높일 수 있는 최소 루틴을 만들면 활용 경험과 적용 범위를 점차 넓혀갈 수 있다.',
    ],
  },
};

function computeIncrement(totalCount: number): number {
  return Math.floor(totalCount / 10) + 1;
}

function computeTargetCounts(
  profileCounts: Partial<Record<AxProfileType, number>>,
  totalCount: number,
): Record<AxProfileType, number> {
  const current: Record<AxProfileType, number> = {
    BALANCED: profileCounts.BALANCED ?? 0,
    LEARNER: profileCounts.LEARNER ?? 0,
    DOER: profileCounts.DOER ?? 0,
    OVERCONFIDENT: profileCounts.OVERCONFIDENT ?? 0,
    ANALYST: profileCounts.ANALYST ?? 0,
    CAUTIOUS: profileCounts.CAUTIOUS ?? 0,
  };

  const delta = computeIncrement(totalCount);

  const fromLearner = Math.min(delta, current.LEARNER);
  const fromOverconfident = Math.min(delta, current.OVERCONFIDENT);
  const fromCautious = Math.min(delta, current.CAUTIOUS);

  return {
    BALANCED: current.BALANCED + fromLearner,
    LEARNER: current.LEARNER - fromLearner,
    DOER: current.DOER + fromOverconfident,
    OVERCONFIDENT: current.OVERCONFIDENT - fromOverconfident,
    ANALYST: current.ANALYST + fromCautious,
    CAUTIOUS: current.CAUTIOUS - fromCautious,
  };
}

export function AxProfilePage({ data }: AxProfilePageProps) {
  const totalCount = PROFILE_ORDER.reduce(
    (sum, type) => sum + (data.profileCounts[type] ?? 0),
    0,
  );

  const targetCounts = computeTargetCounts(data.profileCounts, totalCount);

  const topType = data.topProfileType;
  const { label: topLabel } = PROFILE_TYPE_CONFIG[topType];
  const topContent = PROFILE_CONTENT[topType];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">11</div>
        <div className="txt-b-bold">구성원 프로필 유형 분석</div>
        <div className="txt-c2-regular">
          구성원의 AX 활용 특성을 프로필 유형으로 구분하고, 현재와 목표 분포를
          비교하여 조직의 구성원 유형과 주요 특성을 파악합니다.
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-c1-bold">프로필 유형 분포 현황</div>
          <div className="flex items-end justify-between gap-2">
            <div className="shrink-0">
              <AxProfileDonutChart
                profileRatios={data.profileRatios}
                totalCount={totalCount}
              />
            </div>
            <div className="flex flex-col gap-1">
              {PROFILE_ORDER.map((type) => {
                const count = data.profileCounts[type] ?? 0;
                const { label, color } = PROFILE_TYPE_CONFIG[type];
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div
                      className="size-[10px] shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <div className="txt-c2-regular">{label}</div>
                    <div className="txt-c2-bold text-special-dark-blue-700 w-[30px] text-right">
                      {count}명
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-c1-bold">조직 프로필 특성 (현재 vs 목표)</div>
          <div className="flex items-center justify-between gap-2">
            <div className="shrink-0">
              <AxProfileRadarChart
                profileCounts={data.profileCounts}
                targetCounts={targetCounts}
              />
            </div>
            <div className="flex flex-col gap-1">
              {PROFILE_ORDER.map((type) => {
                const count = data.profileCounts[type] ?? 0;
                const target = targetCounts[type];
                const { label } = PROFILE_TYPE_CONFIG[type];
                const diff = target - count;
                return (
                  <div key={type} className="flex items-center gap-1">
                    <div className="txt-c2-regular shrink-0">{label}</div>
                    <div className="txt-c2-bold text-special-dark-blue-700 shrink-0 text-right">
                      {count}명
                    </div>
                    <div className="txt-c2-regular shrink-0 text-gray-400">→</div>
                    <div
                      className={`txt-c2-bold shrink-0 ${
                        diff > 0
                          ? 'text-green-500'
                          : diff < 0
                            ? 'text-red-500'
                            : 'text-special-dark-blue-700'
                      }`}
                    >
                      {target}명
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">핵심 프로필 유형</div>
        <div className="flex items-start gap-3">
          <div className="relative h-[80px] w-[80px] min-w-[80px] shrink-0">
            <Image
              src={topContent.imageSrc}
              alt={topLabel}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="txt-c2-bold rounded-[20px] bg-green-400 px-2 py-0.5 text-white">
                1순위
              </div>
              <div className="txt-c2-bold">{topLabel}</div>
            </div>
            <div className="txt-c2-regular">{topContent.description}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2 rounded-[12px] border border-gray-200 p-3">
            <div className="bg-green-0 txt-c2-bold w-fit rounded-[20px] px-2 py-0.5 text-green-500">
              강점
            </div>
            <ul className="flex flex-col gap-1">
              {topContent.strengths.map((strength, i) => (
                <li key={i} className="txt-c2-regular flex gap-1">
                  <span className="shrink-0 text-gray-400">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-[12px] border border-gray-200 p-3">
            <div className="bg-red-0 txt-c2-bold w-fit rounded-[20px] px-2 py-0.5 text-red-500">
              보완점
            </div>
            <ul className="flex flex-col gap-1">
              {topContent.improvements.map((improvement, i) => (
                <li key={i} className="txt-c2-regular flex gap-1">
                  <span className="shrink-0 text-gray-400">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <NotepadText className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">인사이트 요약</div>
          <div className="txt-c2-regular text-special-dark-blue-700">
            {getAxInsightContent(data.insights, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
