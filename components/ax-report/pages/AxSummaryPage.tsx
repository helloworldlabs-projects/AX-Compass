import {
  getAxInsightContent,
  type AxCoreSummarySection,
  type AxMaturityStage,
  type AxProfileType,
} from '../../../types/ax-report';

const MATURITY_STAGE_LABEL: Record<AxMaturityStage, string> = {
  INITIATION: '도입',
  UTILIZATION: '활용',
  INTEGRATION: '통합',
  INNOVATION: '혁신',
};

const PROFILE_TYPE_LABEL: Record<AxProfileType, string> = {
  BALANCED: '균형형',
  OVERCONFIDENT: '과신형',
  DOER: '실행형',
  ANALYST: '판단형',
  CAUTIOUS: '조심형',
  LEARNER: '이해형',
};

interface AxSummaryPageProps {
  data: AxCoreSummarySection;
}

export function AxSummaryPage({ data }: AxSummaryPageProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">01</div>
        <div className="txt-b-bold">핵심 요약 (Executive Summary)</div>
        <div className="txt-c2-regular">
          기관의 AX 성숙도와 구성원 역량 진단 결과를 종합하여 현재 수준과 목표
          대비 격차를 한눈에 확인할 수 있도록 정리합니다. 주요 강점과 보완 영역,
          대표 프로필 및 향후 AX 고도화를 위해 검토해야 할 핵심 의사결정 사항을
          함께 제시합니다.
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-1 rounded-[12px] px-2 py-3 text-center shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-b-bold">
            {MATURITY_STAGE_LABEL[data.avgCurrentMaturityStage]}
          </div>
          <div className="txt-c2-regular">현재 AX 성숙도</div>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-[12px] px-2 py-3 text-center shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-b-bold">
            {MATURITY_STAGE_LABEL[data.avgTargetMaturityStage]}
          </div>
          <div className="txt-c2-regular">목표 AX 성숙도</div>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-[12px] px-2 py-3 text-center shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-b-bold">{data.memberAxAvg}</div>
          <div className="txt-c2-regular">구성원 AX 평균</div>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-[12px] px-2 py-3 text-center shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-b-bold">
            {data.memberAxGap != null
              ? data.memberAxGap >= 0
                ? `+${data.memberAxGap}점`
                : `${data.memberAxGap}점`
              : '-'}
          </div>
          <div className="txt-c2-regular">목표 대비 Gap</div>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">핵심 진단 결과</div>
        <div className="txt-c2-bold flex flex-col overflow-hidden rounded-[8px]">
          <div className="bg-special-dark-blue-100 flex items-center">
            <div className="w-[160px] min-w-[160px] shrink-0 px-2 py-1.5 text-center">
              구분
            </div>
            <div className="flex-1 px-2 py-1.5 text-center">결과</div>
          </div>
          <div className="bg-special-dark-blue-0 flex items-center">
            <div className="w-[160px] min-w-[160px] shrink-0 px-2 py-1.5 text-center">
              강점 영역
            </div>
            <div className="txt-c2-regular flex-1 px-2 py-1.5 text-center">
              {data.top3StrengthTags
                .slice(0, 2)
                .map((tag) => tag.tagName)
                .join(', ')}
            </div>
          </div>
          <div className="bg-special-dark-blue-0 flex items-center">
            <div className="w-[160px] min-w-[160px] shrink-0 px-2 py-1.5 text-center">
              보완 영역
            </div>
            <div className="txt-c2-regular flex-1 px-2 py-1.5 text-center">
              {data.top3WeaknessTags
                .slice(0, 2)
                .map((tag) => tag.tagName)
                .join(', ')}
            </div>
          </div>
          <div className="bg-special-dark-blue-0 flex items-center">
            <div className="w-[160px] min-w-[160px] shrink-0 px-2 py-1.5 text-center">
              대표 프로필
            </div>
            <div className="txt-c2-regular flex-1 px-2 py-1.5 text-center">
              {data.top3ProfileTypes
                .map((profile) => PROFILE_TYPE_LABEL[profile])
                .join('·')}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">의사 결정 포인트</div>
        <div className="bg-special-dark-blue-0 border-special-dark-blue-100 txt-c2-regular rounded-[8px] border p-3 whitespace-pre-wrap">
          {getAxInsightContent(data.insights, 0)}
        </div>
      </div>
      <div className="bg-special-navy-500 flex flex-col gap-3 rounded-[12px] p-3 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">종합 요약</div>
        <div className="txt-c2-regular">
          {getAxInsightContent(data.insights, 1)}
        </div>
      </div>
    </div>
  );
}
