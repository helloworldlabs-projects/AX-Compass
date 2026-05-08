import { roundScore } from '@/lib/utils';

interface GapMsChartProps {
  currentScore: number;
  currentStageLabel: string;
  targetScore: number;
  targetStageLabel: string;
  gap: number;
}

export function GapMsChart({
  currentScore,
  currentStageLabel,
  targetScore,
  targetStageLabel,
  gap,
}: GapMsChartProps) {
  const current = roundScore(currentScore);
  const target = roundScore(targetScore);

  return (
    <div className="flex w-full flex-col gap-[30px]">
      <div className="mx-auto w-full max-w-[340px] lg:max-w-[900px]">
        <div className="flex items-end justify-center gap-2.5">
          <div className="relative flex h-[200px] w-[100px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
            <span className="txt-b-bold text-center">{current}</span>
            <div
              className="flex w-full items-center justify-center rounded-t-[12px] border-3 border-b-0 border-purple-300 bg-purple-700 lg:rounded-t-[20px]"
              style={{ height: `${current}%` }}
            >
              {/* <span className="txt-st2-bold text-white">{currentStageLabel}</span> */}
            </div>
          </div>
          <div className="w-[50px] lg:w-[120px]">
            <div
              className={`txt-b-bold flex h-[100px] flex-col text-center ${gap > 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              <span>Gap_MS</span>
              <span>
                ({gap > 0 ? '+' : ''} {gap})
              </span>
              <div className="flex w-full items-center">
                <div className="h-px flex-1 bg-current" />
                <div className="h-0 w-0 border-y-[5px] border-l-8 border-y-transparent border-l-current" />
              </div>
            </div>
          </div>
          <div className="relative flex h-[200px] w-[100px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
            <span className="txt-b-bold text-center">{target}</span>
            <div
              className="bg-special-pink-600 border-special-pink-200 flex w-full items-center justify-center rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
              style={{ height: `${target}%` }}
            >
              {/* <span className="txt-st2-bold text-white">{targetStageLabel}</span> */}
            </div>
          </div>
        </div>
        <div className="h-[3px] w-full rounded-full bg-gray-500" />
        <div className="txt-st2-bold mt-5 flex items-center justify-center gap-[50px] text-center lg:gap-[120px] lg:px-6">
          <div>
            현재 성숙도(CMS)
            <br />
            (종합)
          </div>
          <div>
            목표 성숙도(TMS)
            <br />
            (종합)
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[700px]">
        <div className="txt-st-bold">
          <span className="text-purple-700">* </span>
          Gap_MS (CMS − TMS)
        </div>
        <div>
          현재 성숙도(Current Maturity Stage)와 목표 성숙도(Target Maturity Stage)의 차이입니다.
          <br />
          <span className="txt-b-bold text-green-600">[양수(+)]</span> 현재 성숙도가 목표 성숙도보다
          높아, 현재 수준 대비 보수적인 목표를 두거나 향후 추진 방향을 낮게 설정하는 경향이
          있습니다.
          <br />
          <span className="txt-b-bold text-red-500">[음수(−)]</span> 현재 성숙도가 목표 성숙도보다
          낮아, 현재 수준을 넘어 더 높은 단계로의 성장과 고도화를 기대하는 경향이 있습니다.
        </div>
      </div>
    </div>
  );
}
