const BAR_MAX_H = 90;
const ANNOTATION_W = 50;

interface AxGapBarChartProps {
  currentValue: number;
  targetValue: number;
  groupLabel: string;
}

export function AxGapBarChart({
  currentValue,
  targetValue,
  groupLabel,
}: AxGapBarChartProps) {
  const max = Math.max(currentValue, targetValue);
  const currentBarH = (currentValue / max) * BAR_MAX_H;
  const targetBarH = (targetValue / max) * BAR_MAX_H;
  const gapValue = currentValue - targetValue;
  const gapDisplay =
    gapValue >= 0 ? `+${gapValue.toFixed(1)}` : `${gapValue.toFixed(1)}`;

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-end" style={{ height: BAR_MAX_H + 24 }}>
        {/* 현재 성숙도 바 */}
        <div className="flex flex-1 flex-col items-center justify-end gap-1 pl-[10px]">
          <span className="txt-c2-bold">{currentValue.toFixed(1)}</span>
          <div
            className="w-full rounded-t-[12px] border border-b-0 border-purple-300 bg-purple-700"
            style={{ height: currentBarH }}
          />
        </div>

        {/* Gap 어노테이션 */}
        <div
          className="flex shrink-0 flex-col items-center gap-1.5 self-center px-1 text-red-500"
          style={{ width: ANNOTATION_W }}
        >
          <div className="flex flex-col items-center">
            <span className="txt-c2-bold">Gap_MS</span>
            <span className="txt-c2-bold">({gapDisplay})</span>
          </div>
          <div className="flex w-full items-center">
            <div className="h-px flex-1 bg-red-500" />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '7px solid #EF4444',
              }}
            />
          </div>
        </div>

        {/* 목표 성숙도 바 */}
        <div className="flex flex-1 flex-col items-center justify-end gap-1 pr-[10px]">
          <span className="txt-c2-bold">{targetValue.toFixed(1)}</span>
          <div
            className="bg-special-pink-600 border-special-pink-200 w-full rounded-t-[12px] border border-b-0"
            style={{ height: targetBarH }}
          />
        </div>
      </div>

      {/* 기준선 */}
      <div className="h-px bg-gray-300" />

      {/* 레이블 */}
      <div className="mt-2 flex items-start">
        <div className="txt-c2-bold flex flex-1 flex-col items-center pl-[8px] text-center">
          <span>현재 성숙도(CMS)</span>
          <span>({groupLabel})</span>
        </div>
        <div style={{ width: ANNOTATION_W }} />
        <div className="txt-c2-bold flex flex-1 flex-col items-center pr-[8px] text-center">
          <span>목표 성숙도(TMS)</span>
          <span>({groupLabel})</span>
        </div>
      </div>
    </div>
  );
}
