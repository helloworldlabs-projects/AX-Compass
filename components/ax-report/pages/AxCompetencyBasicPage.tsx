import { NotepadText, ShieldAlert, ShieldCheck } from 'lucide-react';
import { AxRadarChart, type RadarDataPoint } from '../AxRadarChart';
import { AxGaugeMeter } from '../AxGaugeMeter';

import {
  getAxInsightContent,
  type AxMemberCompetencyAnalysisSection,
  type AxMemberCompetencyCode,
  type AxMemberCompetencyScore,
} from '../../../types/ax-report';

const MEMBER_COMPETENCY_LABELS: Record<AxMemberCompetencyCode, string> = {
  UNDERSTAND: '이해',
  USE_AND_APPLY: '활용',
  EVALUATE: '평가·개선',
  RESPONSIBLE: '책임·거버넌스',
};

const MEMBER_COMPETENCY_COLORS: Record<AxMemberCompetencyCode, string> = {
  UNDERSTAND: '#FF566A',
  USE_AND_APPLY: '#F6B646',
  EVALUATE: '#35D39A',
  RESPONSIBLE: '#565656',
};

const GAUGE_ORDER: AxMemberCompetencyCode[] = [
  'UNDERSTAND',
  'USE_AND_APPLY',
  'EVALUATE',
  'RESPONSIBLE',
];

const RADAR_ORDER: AxMemberCompetencyCode[] = [
  'UNDERSTAND',
  'RESPONSIBLE',
  'EVALUATE',
  'USE_AND_APPLY',
];

const RANK_BG_CLASSES = [
  'bg-red-400',
  'bg-special-orange-400',
  'bg-gray-600',
  'bg-green-400',
] as const;

function getRankBgClass(rank: number): string {
  return RANK_BG_CLASSES[rank] ?? 'bg-gray-400';
}

function getGapValue(score: AxMemberCompetencyScore): number {
  if (score.gap != null) return score.gap;
  if (score.targetScore != null) return score.targetScore - score.currentScore;
  return 0;
}

function formatGap(score: AxMemberCompetencyScore): string {
  const gap = getGapValue(score);
  if (score.gap == null && score.targetScore == null) return '-';
  return gap >= 0 ? `+${gap.toFixed(0)}` : `${gap.toFixed(0)}`;
}

function getCompetencyScore(
  competencies: AxMemberCompetencyScore[],
  code: AxMemberCompetencyCode,
): AxMemberCompetencyScore | undefined {
  return competencies.find((competency) => competency.competencyCode === code);
}

interface AxCompetencyBasicPageProps {
  data: AxMemberCompetencyAnalysisSection;
}

export function AxCompetencyBasicPage({ data }: AxCompetencyBasicPageProps) {
  const radarData: RadarDataPoint[] = RADAR_ORDER.map((code) => {
    const score = getCompetencyScore(data.competencies, code);
    return {
      label: MEMBER_COMPETENCY_LABELS[code],
      current: score?.currentScore ?? 0,
      target: score?.targetScore ?? 0,
    };
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">06</div>
        <div className="txt-b-bold">구성원 AX 역량 분석</div>
        <div className="txt-c2-regular">
          구성원의 이해, 활용, 평가·개선, 책임·거버넌스 역량을 비교하여 전반적인
          역량 수준과 주요 강점·보완 영역을 확인합니다.
        </div>
      </div>
      <div className="flex gap-3">
        {GAUGE_ORDER.map((code, index) => {
          const score = getCompetencyScore(data.competencies, code);
          return (
            <div
              key={code}
              className="flex flex-1 flex-col gap-1 rounded-[12px] p-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]"
            >
              <AxGaugeMeter
                label={MEMBER_COMPETENCY_LABELS[code]}
                rank={index + 1}
                accentColor={MEMBER_COMPETENCY_COLORS[code]}
                current={score?.currentScore ?? 0}
                target={score?.targetScore ?? 0}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-b-bold">영역별 요약</div>
          <div className="txt-c2-bold flex flex-col overflow-hidden rounded-[8px]">
            <div className="bg-special-dark-blue-100 flex items-center">
              <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">순서</div>
              <div className="flex-1 px-2 py-1.5 text-center">영역</div>
              <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">현재</div>
              <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">목표</div>
              <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">Gap</div>
            </div>
            {GAUGE_ORDER.map((code, index) => {
              const score = getCompetencyScore(data.competencies, code);
              return (
                <div key={code} className="bg-special-dark-blue-0 txt-c2-regular flex items-center">
                  <div className="flex h-[28px] w-[40px] min-w-[40px] shrink-0 items-center justify-center px-2">
                    <span className={`txt-c2-bold flex size-[16px] items-center justify-center rounded-full text-white ${getRankBgClass(index)}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="txt-c2-regular flex h-[28px] flex-1 items-center justify-center px-2 text-center">
                    {MEMBER_COMPETENCY_LABELS[code]}
                  </div>
                  <div className="txt-c2-regular flex h-[28px] w-[40px] min-w-[40px] shrink-0 items-center justify-center px-2 text-center">
                    {score ? score.currentScore.toFixed(0) : '-'}
                  </div>
                  <div className="txt-c2-regular flex h-[28px] w-[40px] min-w-[40px] shrink-0 items-center justify-center px-2 text-center">
                    {score?.targetScore?.toFixed(0) ?? '-'}
                  </div>
                  <div className="txt-c2-bold flex h-[28px] w-[40px] min-w-[40px] shrink-0 items-center justify-center px-2 text-center">
                    {score ? formatGap(score) : '-'}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-[8px] text-gray-500">
            ※ Gap = 목표 수준 - 현재 수준 (값이 클수록 개선 필요도가 높음)
          </div>
        </div>
        <div className="flex items-center justify-center rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <AxRadarChart size={189} data={radarData} />
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">주요 강점</div>
          <div className="txt-c2-regular text-special-dark-blue-700">{getAxInsightContent(data.insights, 0)}</div>
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <ShieldAlert className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">보완 필요 영역</div>
          <div className="txt-c2-regular text-special-dark-blue-700">{getAxInsightContent(data.insights, 1)}</div>
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <NotepadText className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">핵심 권고사항</div>
          <div className="txt-c2-regular text-special-dark-blue-700">{getAxInsightContent(data.insights, 2)}</div>
        </div>
      </div>
    </div>
  );
}
