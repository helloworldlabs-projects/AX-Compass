import { NotepadText } from 'lucide-react';
import { AxMultiFacetRadarChart } from '../AxMultiFacetRadarChart';
import {
  getAxInsightContent,
  type AxMemberCompetencyMultiFacetSection,
} from '../../../types/ax-report';

function getGapSrMessage(gapSr: number): string {
  if (gapSr >= 10)
    return '자신의 역량을 실제 판단보다 높게 인식하는 경향이 있습니다. 자기 인식과 판단력 간 조정이 필요합니다.';
  if (gapSr >= 3)
    return '자기평가가 실제 판단 역량보다 다소 높게 나타났습니다. 객관적 역량 점검이 필요합니다.';
  if (gapSr > -3)
    return '자기인식과 실제 판단 역량이 비교적 균형적으로 형성된 상태입니다.';
  if (gapSr > -10)
    return '실제 판단 역량이 자기평가보다 높게 나타났습니다. 역량에 대한 자신감 제고가 필요합니다.';
  return '실제 판단 역량이 자기평가를 크게 상회합니다. 보유 역량의 적극적 활용이 필요합니다.';
}

function getGapSbMessage(gapSb: number): string {
  if (gapSb >= 10)
    return '판단 역량은 높으나 실제 활용은 제한적입니다. 실행 경험 확대가 필요합니다.';
  if (gapSb >= 3)
    return '판단 역량 대비 실제 활용 빈도가 다소 낮게 나타났습니다. 활용 확대가 필요합니다.';
  if (gapSb > -3)
    return '판단 역량과 실제 활용 행동이 비교적 균형적으로 나타났습니다.';
  if (gapSb > -10)
    return '실제 활용 행동이 판단 역량보다 높게 나타났습니다. 활용 기준 정립이 필요합니다.';
  return '행동 빈도는 높으나 판단 역량은 상대적으로 낮습니다. 사례 기반 판단 학습이 필요합니다.';
}

interface AxMultiDimensionPageProps {
  data: AxMemberCompetencyMultiFacetSection;
}

export function AxMultiDimensionPage({ data }: AxMultiDimensionPageProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">09</div>
        <div className="txt-b-bold">구성원 AX 역량 - 다면 평가</div>
        <div className="txt-c2-regular">
          자기평가, 상황판단, 행동빈도 결과를 비교하여 구성원의 인식·판단·실행
          간 균형과 차이를 분석합니다.
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-3">
          <div className="txt-c1-bold">다면 평가 결과</div>
          <div className="flex flex-col gap-2 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <div className="txt-c1-bold bg-special-orange-100 text-special-orange-700 w-fit rounded-[20px] px-1 py-0.5">자기평가 (SE)</div>
            <div className="txt-b-bold text-center">{data.seAvg.toFixed(1)}</div>
          </div>
          <div className="flex flex-col gap-2 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <div className="txt-c1-bold bg-special-dark-blue-100 text-special-dark-blue-700 w-fit rounded-[20px] px-1 py-0.5">상황판단 (SJ)</div>
            <div className="txt-b-bold text-center">{data.sjAvg.toFixed(1)}</div>
          </div>
          <div className="flex flex-col gap-2 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <div className="txt-c1-bold w-fit rounded-[20px] bg-green-100 px-1 py-0.5 text-green-700">행동빈도 (BH)</div>
            <div className="txt-b-bold text-center">{data.bhAvg.toFixed(1)}</div>
          </div>
        </div>
        <div className="h-[282px] min-h-[282px] w-[282px] min-w-[282px] shrink-0">
          <AxMultiFacetRadarChart se={data.seAvg} sj={data.sjAvg} bh={data.bhAvg} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="txt-c1-bold">GAP 분석</div>
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <div className="flex gap-3">
              <div className="txt-c1-bold bg-special-orange-100 text-special-orange-700 w-fit rounded-[20px] px-1 py-0.5">Gap_SR</div>
              <div className="txt-b-bold">{data.gapSrAvg.toFixed(1)}</div>
            </div>
            <div className="txt-c2-bold">자기평가 {data.gapSrAvg >= 0 ? '>' : '<'} 상황판단</div>
            <div className="txt-c2-regular">{getGapSrMessage(data.gapSrAvg)}</div>
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <div className="flex gap-3">
              <div className="txt-c1-bold w-fit rounded-[20px] bg-green-100 px-1 py-0.5 text-green-700">Gap_SB</div>
              <div className="txt-b-bold">{data.gapSbAvg.toFixed(1)}</div>
            </div>
            <div className="txt-c2-bold">상황판단 {data.gapSbAvg >= 0 ? '>' : '<'} 행동빈도</div>
            <div className="txt-c2-regular">{getGapSbMessage(data.gapSbAvg)}</div>
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
