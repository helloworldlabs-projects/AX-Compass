import { NotepadText } from 'lucide-react';
import {
  getAxInsightContent,
  type AxMemberCompetencyCode,
  type AxMemberCompetencyDetailSection,
  type AxSkillLevel,
  type AxTagRanking,
} from '../../../types/ax-report';

const TAG_CODE_TO_COMPETENCY: Record<string, AxMemberCompetencyCode> = {
  a: 'UNDERSTAND',
  b: 'UNDERSTAND',
  c: 'UNDERSTAND',
  d: 'USE_AND_APPLY',
  e: 'USE_AND_APPLY',
  f: 'USE_AND_APPLY',
  g: 'EVALUATE',
  h: 'EVALUATE',
  i: 'EVALUATE',
  j: 'RESPONSIBLE',
  k: 'RESPONSIBLE',
  l: 'RESPONSIBLE',
};

const COMPETENCY_ORDER: AxMemberCompetencyCode[] = [
  'UNDERSTAND',
  'USE_AND_APPLY',
  'EVALUATE',
  'RESPONSIBLE',
];

const COMPETENCY_LABELS: Record<AxMemberCompetencyCode, string> = {
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

function groupTagsByCompetency(
  tagRankings: AxTagRanking[],
): Record<AxMemberCompetencyCode, AxTagRanking[]> {
  const groups: Record<AxMemberCompetencyCode, AxTagRanking[]> = {
    UNDERSTAND: [],
    USE_AND_APPLY: [],
    EVALUATE: [],
    RESPONSIBLE: [],
  };
  for (const tag of tagRankings) {
    const competency = TAG_CODE_TO_COMPETENCY[tag.tagCode.toLowerCase()];
    if (competency) groups[competency].push(tag);
  }
  for (const code of COMPETENCY_ORDER) {
    groups[code].sort((a, b) =>
      a.tagCode.toLowerCase().localeCompare(b.tagCode.toLowerCase()),
    );
  }
  return groups;
}

function calcGroupAvg(tags: AxTagRanking[]): number {
  if (tags.length === 0) return 0;
  return tags.reduce((sum, t) => sum + t.score, 0) / tags.length;
}

function getBarColorClass(level: AxSkillLevel): string {
  if (level === 'BEGINNER') return 'bg-red-400';
  if (level === 'ELEMENTARY') return 'bg-special-orange-300';
  return 'bg-green-400';
}

function formatDeviation(deviation: number | null): string {
  if (deviation === null) return '-';
  return deviation >= 0 ? `+${deviation.toFixed(1)}` : deviation.toFixed(1);
}

interface AxDetailCompetencyPageProps {
  data: AxMemberCompetencyDetailSection;
}

export function AxDetailCompetencyPage({ data }: AxDetailCompetencyPageProps) {
  const groupedTags = groupTagsByCompetency(data.tagRankings);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">08</div>
        <div className="txt-b-bold">구성원 AX 역량 - 세부 역량</div>
        <div className="txt-c2-regular">
          12개 세부 역량의 평균과 편차를 비교하여 조직의 강점과 보완 역량을
          구체적으로 확인하고, 우선 교육 방향을 살펴봅니다.
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="txt-c1-bold">4대 핵심 역량별 세부 역량 현황</div>
        <div className="flex gap-3">
          {COMPETENCY_ORDER.map((code) => {
            const tags = groupedTags[code];
            const avg = calcGroupAvg(tags);
            return (
              <div
                key={code}
                className="flex flex-1 flex-col gap-1 rounded-[10px] p-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]"
              >
                <div className="flex items-center justify-between">
                  <div className="txt-c2-bold">{COMPETENCY_LABELS[code]}</div>
                  <div className="text-[8px]">
                    평균: <span className="font-bold">{avg.toFixed(0)}</span>
                  </div>
                </div>
                {tags.map((tag) => (
                  <div key={tag.tagCode} className="flex flex-col gap-1 py-[3px]">
                    <div className="text-[8px] font-bold">
                      {tag.tagCode.toUpperCase()}. {tag.tagName}
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex h-full flex-1 items-center">
                        <div
                          className={`${getBarColorClass(tag.level)} h-[16px] min-w-[16px] rounded-[10px]`}
                          style={{ width: `${tag.score}%` }}
                        />
                      </div>
                      <div className="shrink-0 text-[8px] font-bold">
                        {tag.score.toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex w-[190px] min-w-[190px] shrink-0 flex-col gap-3">
          <div className="txt-c1-bold">상·하위 역량 TOP3</div>
          <div className="flex flex-col gap-2 rounded-[12px] p-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <div className="txt-c1-bold bg-green-0 rounded-[4px] px-2 py-0.5 text-green-500">
              강점 역량 TOP3
            </div>
            {data.top3StrengthTags.map((tag, index) => (
              <div key={tag.tagCode} className="flex items-center gap-2">
                <div className="txt-c2-bold flex size-4 items-center justify-center rounded-full bg-gray-600 text-white">
                  {index + 1}
                </div>
                <div className="txt-c2-regular flex-1">{tag.tagName.slice(0, -3)}</div>
                <div className="txt-c2-bold shrink-0">{tag.avgScore.toFixed(0)}점</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-[12px] p-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <div className="txt-c1-bold bg-red-0 rounded-[4px] px-2 py-0.5 text-red-500">
              보완 필요 역량 TOP3
            </div>
            {data.top3WeaknessTags.map((tag, index) => (
              <div key={tag.tagCode} className="flex items-center gap-2">
                <div className="txt-c2-bold flex size-4 items-center justify-center rounded-full bg-gray-600 text-white">
                  {index + 1}
                </div>
                <div className="txt-c2-regular flex-1">{tag.tagName.slice(0, -3)}</div>
                <div className="txt-c2-bold shrink-0">{tag.avgScore.toFixed(0)}점</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="txt-c1-bold">세부 역량 순위</div>
          <div className="txt-c2-bold flex flex-col overflow-hidden rounded-[8px]">
            <div className="bg-special-dark-blue-100 flex items-center">
              <div className="w-[38px] min-w-[38px] shrink-0 px-2 py-1.5 text-center">순위</div>
              <div className="w-[38px] min-w-[38px] shrink-0 px-2 py-1.5 text-center">Tag</div>
              <div className="w-[180px] min-w-[180px] shrink-0 px-2 py-1.5 text-center">세부 역량</div>
              <div className="w-[38px] min-w-[38px] shrink-0 px-2 py-1.5 text-center">평균</div>
              <div className="w-[38px] min-w-[38px] shrink-0 px-2 py-1.5 text-center">등급</div>
              <div className="w-[38px] min-w-[38px] shrink-0 px-2 py-1.5 text-center">편차</div>
            </div>
            {data.tagRankings.map((tag, index) => (
              <div
                key={tag.tagCode}
                className={`flex items-center ${index % 2 === 0 ? 'bg-special-dark-blue-0' : 'bg-white'}`}
              >
                <div className="txt-c2-regular flex h-[24px] w-[38px] min-w-[38px] shrink-0 items-center justify-center px-2">{tag.rank}</div>
                <div className="txt-c2-regular flex h-[24px] w-[38px] min-w-[38px] shrink-0 items-center justify-center px-2">{tag.tagCode.toUpperCase()}</div>
                <div className="txt-c2-regular flex h-[24px] w-[180px] min-w-[180px] shrink-0 items-center justify-center px-2 text-center">{tag.tagName.slice(0, -3)}</div>
                <div className="txt-c2-regular flex h-[24px] w-[38px] min-w-[38px] shrink-0 items-center justify-center px-2">{tag.score.toFixed(0)}</div>
                <div className="txt-c2-regular flex h-[24px] w-[38px] min-w-[38px] shrink-0 items-center justify-center px-2">{SKILL_LEVEL_LABEL[tag.level]}</div>
                <div className="txt-c2-regular flex h-[24px] w-[38px] min-w-[38px] shrink-0 items-center justify-center px-2">{formatDeviation(tag.deviation)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <NotepadText className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">인사이트 요약</div>
          <div className="txt-c2-regular text-special-dark-blue-700">{getAxInsightContent(data.insights, 0)}</div>
        </div>
      </div>
    </div>
  );
}
