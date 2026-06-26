import {
  getAxInsightContent,
  type AxLevelCounts,
  type AxMemberCompetencyCode,
  type AxMemberCompetencyLevel,
  type AxMemberCompetencyLevelSection,
  type AxSkillLevel,
} from '../../../types/ax-report';

const MEMBER_COMPETENCY_LABELS: Record<AxMemberCompetencyCode, string> = {
  UNDERSTAND: '이해',
  USE_AND_APPLY: '활용',
  EVALUATE: '평가·개선',
  RESPONSIBLE: '책임·거버넌스',
};

const SKILL_LEVEL_LABEL: Record<AxSkillLevel, string> = {
  BEGINNER: '입문',
  ELEMENTARY: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

const MEMBER_COMPETENCY_LABEL_COLORS: Record<AxMemberCompetencyCode, string> = {
  UNDERSTAND: 'text-red-500',
  USE_AND_APPLY: 'text-special-orange-500',
  EVALUATE: 'text-green-500',
  RESPONSIBLE: 'text-gray-700',
};

const SECTION_ORDER: AxMemberCompetencyCode[] = [
  'UNDERSTAND',
  'USE_AND_APPLY',
  'EVALUATE',
  'RESPONSIBLE',
];

const LEVEL_ORDER: { key: keyof AxLevelCounts; label: string }[] = [
  { key: 'BEGINNER', label: '입문' },
  { key: 'ELEMENTARY', label: '초급' },
  { key: 'INTERMEDIATE', label: '중급' },
  { key: 'ADVANCED', label: '고급' },
];

function getCompetencyLevel(
  competencies: AxMemberCompetencyLevel[],
  code: AxMemberCompetencyCode,
): AxMemberCompetencyLevel | undefined {
  return competencies.find((competency) => competency.competencyCode === code);
}

function getTotalCount(levelCounts: AxLevelCounts): number {
  return (
    (levelCounts.ELEMENTARY ?? 0) +
      (levelCounts.BEGINNER ?? 0) +
      (levelCounts.INTERMEDIATE ?? 0) +
      (levelCounts.ADVANCED ?? 0) || 1
  );
}

interface AxGradeDistributionPageProps {
  data: AxMemberCompetencyLevelSection;
}

export function AxGradeDistributionPage({ data }: AxGradeDistributionPageProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">07</div>
        <div className="txt-b-bold">구성원 AX 역량 - 등급 분포</div>
        <div className="txt-c2-regular">
          각 핵심 역량의 입문·초급·중급·고급 분포와 대표 등급을 통해 구성원의
          수준별 현황과 교육 설계 시 고려할 사항을 확인합니다.
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {SECTION_ORDER.map((code, index) => {
          const competency = getCompetencyLevel(data.competencies, code);
          const label = MEMBER_COMPETENCY_LABELS[code];
          const levelCounts = competency?.levelCounts ?? {
            ELEMENTARY: 0,
            BEGINNER: 0,
            INTERMEDIATE: 0,
            ADVANCED: 0,
          };
          const totalCount = getTotalCount(levelCounts);
          const labelColor = MEMBER_COMPETENCY_LABEL_COLORS[code];

          return (
            <div key={code} className="flex gap-4">
              <div className="flex w-[180px] min-w-[180px] shrink-0 flex-col gap-3">
                <div className={`txt-c2-bold ${labelColor}`}>{label}</div>
                <div className="rounded-[10px] shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
                  {LEVEL_ORDER.map((level) => {
                    const count = levelCounts[level.key] ?? 0;
                    const barWidth = count === 0 ? 16 : Math.round((count / totalCount) * 76);
                    return (
                      <div key={level.key} className="flex h-[28px]">
                        <div className="txt-c2-bold flex h-full w-[52px] min-w-[52px] shrink-0 items-center justify-center text-center">
                          {level.label}
                        </div>
                        <div className="flex h-full w-[76px] min-w-[76px] shrink-0 items-center overflow-hidden">
                          <div
                            className="bg-special-orange-300 h-[16px] min-w-[16px] shrink-0 rounded-[10px]"
                            style={{ width: `${barWidth}px` }}
                          />
                        </div>
                        <div className="txt-c2-regular flex h-full w-[52px] min-w-[52px] shrink-0 items-center justify-center text-center text-gray-500">
                          {count}명
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex h-fit flex-1 flex-col gap-3 rounded-[12px] border border-gray-200 p-3">
                <div className="txt-c2-bold">
                  <span className={labelColor}>{label}</span> 대표등급:{' '}
                  <span className="bg-special-dark-blue-100 rounded-[20px] px-1 py-0.5 text-gray-700">
                    {competency ? SKILL_LEVEL_LABEL[competency.dominantLevel] : '-'}
                  </span>
                </div>
                <div className="txt-c2-regular">
                  {getAxInsightContent(data.insights, index)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
