import { ChartNoAxesCombined, NotepadText, Search, Shield, Target } from 'lucide-react';
import {
  AxMaturityQuadrantChart,
  getAreaBgClass,
  type MaturityPerspective,
} from '../AxMaturityQuadrantChart';
import {
  getAxInsightContent,
  type AxExecCompetencyCode,
  type AxFourPerspectiveSection,
} from '../../../types/ax-report';

const EXEC_COMPETENCY_NAMES: Record<AxExecCompetencyCode, string> = {
  EXEC_STRATEGY: '전략·리더십',
  EXEC_ADOPTION: '업무·적용',
  EXEC_GOVERNANCE: '운영체계·확산',
  EXEC_DATA_SYSTEM: '데이터·시스템 기반',
};

function getAreaPriority(current: number, target: number): number {
  if (current < 50 && target >= 50) return 0;
  if (current >= 50 && target >= 50) return 1;
  if (current < 50 && target < 50) return 2;
  return 3;
}

interface AxMaturityDetailPageProps {
  data: AxFourPerspectiveSection;
}

export function AxMaturityDetailPage({ data }: AxMaturityDetailPageProps) {
  const sortedScores = [...data.competencyScores].sort((a, b) => {
    const aPriority = getAreaPriority(a.currentScore, a.targetScore);
    const bPriority = getAreaPriority(b.currentScore, b.targetScore);
    if (aPriority !== bPriority) return aPriority - bPriority;
    return b.gap - a.gap;
  });

  const perspectives: MaturityPerspective[] = sortedScores.map((s) => ({
    name: EXEC_COMPETENCY_NAMES[s.competencyCode],
    current: s.currentScore,
    target: s.targetScore,
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">05</div>
        <div className="txt-b-bold">기관 AX 성숙도 분석 - 4대 관점</div>
        <div className="txt-c2-regular">
          전략·리더십, 운영체계·확산, 업무·적용, 데이터·시스템 관점에서 현재와 목표 간 격차를
          비교하고 개선 우선순위를 제시합니다.
        </div>
      </div>
      <AxMaturityQuadrantChart perspectives={perspectives} />
      <div className="flex gap-3">
        <div className="flex w-[200px] min-w-[200px] shrink-0 flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-b-bold">우선순위 해석</div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <Target className="size-5 shrink-0 text-red-500" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-end gap-0.5 text-red-500">
                  <span className="txt-c2-bold">집중 개선 영역</span>
                  <span className="text-[8px] leading-[140%] font-bold">(Top Priority)</span>
                </div>
                <div className="text-[8px] leading-[140%]">
                  현재 수준이 낮고 개선 필요도가 높은 영역으로, 집중적인 투자와 개선이 필요한
                  영역입니다.
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <ChartNoAxesCombined className="text-special-orange-500 size-5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <div className="text-special-orange-500 flex items-end gap-0.5">
                  <span className="txt-c2-bold">점진 개선 영역</span>
                  <span className="text-[8px] leading-[140%] font-bold">(Midium Priority)</span>
                </div>
                <div className="text-[8px] leading-[140%]">
                  현재 수준은 높지만 개선 필요도도 높은 영역으로, 단계적으로 개선을 추진해야 하는
                  영역입니다.
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Search className="size-5 shrink-0 text-gray-700" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-end gap-0.5 text-gray-700">
                  <span className="txt-c2-bold">모니터링 영역</span>
                  <span className="text-[8px] leading-[140%] font-bold">(Monitor)</span>
                </div>
                <div className="text-[8px] leading-[140%]">
                  현재 수준이 낮고 개선 필요도가 높은 영역으로, 집중적인 투자와 개선이 필요한
                  영역입니다.
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Shield className="size-5 shrink-0 text-green-500" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-end gap-0.5 text-green-500">
                  <span className="txt-c2-bold">유지 강화 영역</span>
                  <span className="text-[8px] leading-[140%] font-bold">(Low Priority)</span>
                </div>
                <div className="text-[8px] leading-[140%]">
                  현재 수준이 낮고 개선 필요도가 높은 영역으로, 집중적인 투자와 개선이 필요한
                  영역입니다.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-b-bold">영역별 요약</div>
          <div className="txt-c2-bold flex flex-col overflow-hidden rounded-[8px]">
            <div className="bg-special-dark-blue-100 flex items-center">
              <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">순위</div>
              <div className="w-[90px] min-w-[90px] shrink-0 px-2 py-1.5 text-center">영역</div>
              <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">현재</div>
              <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">목표</div>
              <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">Gap</div>
              <div className="w-[90px] min-w-[90px] shrink-0 px-2 py-1.5 text-center">
                개선 우선순위
              </div>
            </div>
            {sortedScores.map((score, index) => (
              <div
                key={score.competencyCode}
                className="bg-special-dark-blue-0 txt-c2-regular flex items-center"
              >
                <div className="flex h-[36px] w-[40px] min-w-[40px] shrink-0 items-center justify-center px-2">
                  <span
                    className={`txt-c2-bold flex size-[16px] items-center justify-center rounded-full text-white ${getAreaBgClass(score.currentScore, score.targetScore)}`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="txt-c2-bold flex h-[36px] w-[90px] min-w-[90px] shrink-0 items-center justify-center px-2 text-center">
                  {EXEC_COMPETENCY_NAMES[score.competencyCode]}
                </div>
                <div className="txt-c2-regular flex h-[36px] w-[40px] min-w-[40px] shrink-0 items-center justify-center px-2 text-center">
                  {score.currentScore.toFixed(0)}
                </div>
                <div className="txt-c2-regular flex h-[36px] w-[40px] min-w-[40px] shrink-0 items-center justify-center px-2 text-center">
                  {score.targetScore.toFixed(0)}
                </div>
                <div className="txt-c2-bold flex h-[36px] w-[40px] min-w-[40px] shrink-0 items-center justify-center px-2 text-center">
                  {Number(score.gap) >= 0 ? `+${score.gap.toFixed(0)}` : `${score.gap.toFixed(0)}`}
                </div>
                <div className="txt-c2-regular flex h-[36px] w-[90px] min-w-[90px] shrink-0 items-center justify-center px-2 text-center">
                  {score.improvementPriority}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[8px] leading-[140%] text-gray-500">
            ※ Gap = 목표 수준 - 현재 수준 (값이 클수록 개선 필요도가 높음)
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
