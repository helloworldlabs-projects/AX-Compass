import type { ReactNode } from 'react';
import { NotepadText } from 'lucide-react';
import { AxGapBarChart } from '../AxGapBarChart';
import {
  getAxInsightContent,
  type AxExecutiveMaturitySection,
  type AxMaturityStage,
} from '../../../types/ax-report';

type MaturityLevel = '도입' | '활용' | '통합' | '혁신';

const MATURITY_STAGE_TO_LEVEL: Record<AxMaturityStage, MaturityLevel> = {
  INITIATION: '도입',
  UTILIZATION: '활용',
  INTEGRATION: '통합',
  INNOVATION: '혁신',
};

interface MaturityGrades {
  understanding: string;
  utilization: string;
  evaluation: string;
  governance: string;
}

interface MaturityLevelData {
  nameEn: string;
  description: string;
  competencyLevelNode: ReactNode;
  grades: MaturityGrades;
}

const MATURITY_DATA: Record<MaturityLevel, MaturityLevelData> = {
  도입: {
    nameEn: 'Initiation',
    description:
      'AI를 이해하고 가능성을 탐색하는 단계입니다. 기술을 처음 접하고, 파일럿을 시도하며, 데이터와 운영의 기초를 만드는 구간입니다.',
    competencyLevelNode: (
      <>
        이 단계에서는 전사적으로 높은 활용 역량보다, 우선{' '}
        <strong>공통 이해 기반</strong>과{' '}
        <strong>기본적인 책임 있는 사용 인식</strong>이 중요합니다.
      </>
    ),
    grades: {
      understanding: '초급',
      utilization: '입문~초급',
      evaluation: '입문',
      governance: '초급',
    },
  },
  활용: {
    nameEn: 'Utilization',
    description:
      '특정 업무 영역에서 AI를 부분적으로 적용하는 단계입니다. 파일럿을 넘어서 일부 팀이나 직무에서 실제 활용이 일어나기 시작합니다.',
    competencyLevelNode: (
      <>
        이 단계부터는 단순 이해를 넘어 <strong>실제 업무 적용 능력</strong>이
        필요합니다. 동시에 활용이 늘어나므로 결과를 검토하는 힘도 함께
        요구됩니다.
      </>
    ),
    grades: {
      understanding: '초급~중급',
      utilization: '초급~중급',
      evaluation: '초급',
      governance: '초급',
    },
  },
  통합: {
    nameEn: 'Integration',
    description:
      'AI를 전사 업무와 프로세스 안에 연결하는 단계입니다. 부서별 실험이 아니라, 실제 운영 흐름과 협업 구조까지 바꾸기 시작합니다.',
    competencyLevelNode: (
      <>
        이 단계에서는 활용 능력만으로 부족합니다.{' '}
        <strong>평가·개선(E), 책임·거버넌스(R)</strong>, 그리고{' '}
        <strong>부서 간 연계 관점</strong>이 중요해집니다.
      </>
    ),
    grades: {
      understanding: '중급',
      utilization: '중급~고급',
      evaluation: '중급',
      governance: '중급',
    },
  },
  혁신: {
    nameEn: 'Innovation',
    description:
      'AI가 조직의 효율화 수준을 넘어 비즈니스 혁신을 이끄는 단계입니다. 신규 사업, 자율 시스템, 전사 생태계 관점까지 확장됩니다.',
    competencyLevelNode: (
      <>
        이 단계에서는 일부 실무자만 잘하는 것으로는 부족합니다.{' '}
        <strong>핵심 인력군은 고급 수준이 필요</strong>하고, 전체적으로도 높은
        기준이 요구됩니다.
      </>
    ),
    grades: {
      understanding: '중급~고급',
      utilization: '고급',
      evaluation: '고급',
      governance: '중급~고급',
    },
  },
};

interface MaturityCardProps {
  label: string;
  level: MaturityLevel;
}

function MaturityCard({ label, level }: MaturityCardProps) {
  const { nameEn, description, competencyLevelNode, grades } =
    MATURITY_DATA[level];

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
      <div className="bg-special-navy-500 flex flex-col items-center gap-1 rounded-[12px] px-3 py-2 text-white">
        <div className="txt-c2-regular">{label}</div>
        <div className="txt-c1-bold">
          {level} ({nameEn})
        </div>
      </div>
      <div className="txt-c2-regular">{description}</div>
      <div className="flex flex-col gap-1.5">
        <div className="txt-c2-bold text-purple-700">[요구 역량 수준]</div>
        <div className="txt-c2-regular">{competencyLevelNode}</div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="txt-c2-bold text-purple-700">[권장 역량 등급]</div>
        <div className="flex items-center gap-1">
          <div className="flex flex-1 flex-col items-center gap-0.5 rounded-[8px] border border-red-300 bg-red-500 py-1 text-white">
            <div className="text-[8px]">이해</div>
            <div className="txt-c2-bold">{grades.understanding}</div>
          </div>
          <div className="border-special-blue-300 bg-special-blue-500 flex flex-1 flex-col items-center gap-0.5 rounded-[8px] border py-1 text-white">
            <div className="text-[8px]">활용</div>
            <div className="txt-c2-bold">{grades.utilization}</div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5 rounded-[8px] border border-purple-300 bg-purple-700 py-1 text-white">
            <div className="text-[8px]">평가·개선</div>
            <div className="txt-c2-bold">{grades.evaluation}</div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5 rounded-[8px] border border-gray-300 bg-gray-700 py-1 text-white">
            <div className="text-[8px]">책임·거버넌스</div>
            <div className="txt-c2-bold">{grades.governance}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AxMaturityBasicPageProps {
  data: AxExecutiveMaturitySection;
}

export function AxMaturityBasicPage({ data }: AxMaturityBasicPageProps) {
  const currentLevel = MATURITY_STAGE_TO_LEVEL[data.avgCurrentMaturityStage];
  const targetLevel = MATURITY_STAGE_TO_LEVEL[data.avgTargetMaturityStage];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">04</div>
        <div className="txt-b-bold">기관 AX 성숙도 분석</div>
        <div className="txt-c2-regular">
          기관의 현재와 목표 AX 성숙도 수준을 비교하고, 목표 단계로 나아가기
          위해 보완해야 할 주요 과제를 확인합니다.
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">AX 성숙도 진단 결과</div>
        <div className="flex items-center gap-3">
          <MaturityCard label="현재 성숙도 수준" level={currentLevel} />
          <MaturityCard label="목표 성숙도 수준" level={targetLevel} />
        </div>
        <div className="flex h-full items-center gap-3">
          <div className="flex-1 p-3">
            <AxGapBarChart
              currentValue={data.avgCurrentMaturityScore}
              targetValue={data.avgTargetMaturityScore}
              groupLabel="종합"
            />
          </div>
          <div className="border-special-orange-300 flex flex-1 flex-col gap-2 rounded-[12px] border p-3">
            <div className="txt-c1-bold">성숙도 GAP 진단 요약</div>
            <div className="txt-c2-regular">
              {getAxInsightContent(data.insights, 0)}
            </div>
          </div>
        </div>
        <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
          <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
            <NotepadText className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="txt-b-bold text-special-dark-blue-700">
              인사이트 요약
            </div>
            <div className="txt-c2-regular text-special-dark-blue-700">
              {getAxInsightContent(data.insights, 1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
