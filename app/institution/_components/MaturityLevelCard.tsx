import { BadgeCheck } from 'lucide-react';
import { Box, Layers, PackageOpen, Square, type LucideIcon } from 'lucide-react';

export type MaturityLevel = 'INITIATION' | 'UTILIZATION' | 'INTEGRATION' | 'INNOVATION';

type GradeColor = 'red' | 'blue' | 'purple' | 'gray';

type GradeInfo = {
  label: string;
  grade: string;
  color: GradeColor;
};

type MaturityData = {
  icon: LucideIcon;
  titleKo: string;
  titleEn: string;
  description: string;
  requirementDescription: React.ReactNode;
  grades: GradeInfo[];
};

const GRADE_STYLES: Record<GradeColor, { badge: string }> = {
  red: { badge: 'border-red-300 bg-red-500' },
  blue: { badge: 'border-special-blue-300 bg-special-blue-500' },
  purple: { badge: 'border-purple-300 bg-purple-700' },
  gray: { badge: 'border-gray-300 bg-gray-700' },
};

const MATURITY_DATA: Record<MaturityLevel, MaturityData> = {
  INITIATION: {
    icon: Square,
    titleKo: '도입',
    titleEn: 'Initiation',
    description:
      'AI를 이해하고 가능성을 탐색하는 단계입니다.\n기술을 처음 접하고, 파일럿을 시도하며, 데이터와 운영의 기초를 만드는 구간입니다.',
    requirementDescription: (
      <>
        이 단계에서는 전사적으로 높은 활용 역량보다,
        <br />
        우선 <strong>공통 이해 기반</strong>과 <strong>기본적인 책임 있는 사용 인식</strong>이
        중요합니다.
      </>
    ),
    grades: [
      { label: '이해', grade: '초급', color: 'red' },
      { label: '활용', grade: '입문~초급', color: 'blue' },
      { label: '평가·개선', grade: '입문', color: 'purple' },
      { label: '책임·거버넌스', grade: '초급', color: 'gray' },
    ],
  },
  UTILIZATION: {
    icon: Layers,
    titleKo: '활용',
    titleEn: 'Utilization',
    description:
      '특정 업무 영역에서 AI를 부분적으로 적용하는 단계입니다.\n파일럿을 넘어서 일부 팀이나 직무에서 실제 활용이 일어나기 시작합니다.',
    requirementDescription: (
      <>
        이 단계부터는 단순 이해를 넘어 <strong>실제 업무 적용 능력</strong>이 필요합니다.
        <br />
        동시에 활용이 늘어나므로 결과를 검토하는 힘도 함께 요구됩니다.
      </>
    ),
    grades: [
      { label: '이해', grade: '초급~중급', color: 'red' },
      { label: '활용', grade: '초급~중급', color: 'blue' },
      { label: '평가·개선', grade: '초급', color: 'purple' },
      { label: '책임·거버넌스', grade: '초급', color: 'gray' },
    ],
  },
  INTEGRATION: {
    icon: Box,
    titleKo: '통합',
    titleEn: 'Integration',
    description:
      'AI를 전사 업무와 프로세스 안에 연결하는 단계입니다.\n부서별 실험이 아니라, 실제 운영 흐름과 협업 구조까지 바꾸기 시작합니다.',
    requirementDescription: (
      <>
        이 단계에서는 활용 능력만으로 부족합니다.
        <br />
        <strong>평가·개선(E)</strong>, <strong>책임·거버넌스(R)</strong>, 그리고 부서 간 연계 관점이
        중요해집니다.
      </>
    ),
    grades: [
      { label: '이해', grade: '중급', color: 'red' },
      { label: '활용', grade: '중급~고급', color: 'blue' },
      { label: '평가·개선', grade: '중급', color: 'purple' },
      { label: '책임·거버넌스', grade: '중급', color: 'gray' },
    ],
  },
  INNOVATION: {
    icon: PackageOpen,
    titleKo: '혁신',
    titleEn: 'Innovation',
    description:
      'AI가 조직의 효율화 수준을 넘어 비즈니스 혁신을 이끄는 단계입니다.\n신규 사업, 자율 시스템, 전사 생태계 관점까지 확장됩니다.',
    requirementDescription: (
      <>
        이 단계에서는 일부 실무자만 잘하는 것으로는 부족합니다.
        <br />
        핵심 인력군은 <strong>고급 수준</strong>이 필요하고, 전체적으로도 높은 기준이 요구됩니다.
      </>
    ),
    grades: [
      { label: '이해', grade: '중급~고급', color: 'red' },
      { label: '활용', grade: '고급', color: 'blue' },
      { label: '평가·개선', grade: '고급', color: 'purple' },
      { label: '책임·거버넌스', grade: '중급~고급', color: 'gray' },
    ],
  },
};

export function MaturityLevelCard({ type }: { type: MaturityLevel }) {
  const {
    icon: Icon,
    titleKo,
    titleEn,
    description,
    requirementDescription,
    grades,
  } = MATURITY_DATA[type];

  return (
    <div className="flex gap-4 lg:gap-6">
      <Icon className="size-10 shrink-0 text-purple-700" />

      <div className="flex flex-col gap-2.5">
        {/* 제목 */}
        <div className="txt-st-bold text-black">
          {titleKo}({titleEn})
        </div>

        {/* 설명 */}
        <p className="txt-b-regular whitespace-pre-line text-black">{description}</p>

        {/* 요구 역량 수준 */}
        <div className="flex flex-col gap-1.5">
          <span className="txt-b-bold text-purple-700">[요구 역량 수준]</span>
          <p className="txt-b-regular text-black">{requirementDescription}</p>
        </div>

        {/* 권장 역량 등급 */}
        <div className="flex flex-col gap-2">
          <span className="txt-b-bold text-purple-700">[권장 역량 등급]</span>
          <div className="flex flex-wrap gap-4">
            {grades.map(({ label, grade, color }) => {
              const { badge } = GRADE_STYLES[color];
              return (
                <div
                  key={label}
                  className={`flex w-[100px] flex-col items-center gap-1.5 rounded-[12px] border-3 py-2.5 text-white lg:w-[120px] ${badge}`}
                >
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="size-4 text-white" strokeWidth={3} />
                    <span className="txt-c1-bold">{label}</span>
                  </div>
                  <span className="txt-b-bold">{grade}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
