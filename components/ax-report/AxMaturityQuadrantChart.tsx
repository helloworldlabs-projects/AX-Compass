export interface MaturityPerspective {
  name: string;
  current: number;
  target: number;
}

interface AxMaturityQuadrantChartProps {
  perspectives: MaturityPerspective[];
}

export function getAreaBgClass(current: number, target: number): string {
  if (current < 50 && target >= 50) return 'bg-red-400';
  if (current >= 50 && target >= 50) return 'bg-special-orange-400';
  if (current < 50 && target < 50) return 'bg-gray-600';
  return 'bg-green-400';
}

const CHART_W = 480;
const CHART_H = 240;
const DOT_R = 10;

function clampDotPos(
  current: number,
  target: number,
): { left: number; bottom: number } {
  return {
    left: Math.max(DOT_R, Math.min(CHART_W - DOT_R, (current / 100) * CHART_W)),
    bottom: Math.max(
      DOT_R,
      Math.min(CHART_H - DOT_R, (target / 100) * CHART_H),
    ),
  };
}

export function AxMaturityQuadrantChart({
  perspectives,
}: AxMaturityQuadrantChartProps) {
  return (
    <div
      className="grid gap-x-2 gap-y-1"
      style={{
        gridTemplate:
          '"y-title y-scale chart" auto ". . x-axis" auto / auto auto 1fr',
      }}
    >
      {/* Y-axis title */}
      <div
        className="flex flex-col items-center justify-center text-gray-600"
        style={{ gridArea: 'y-title' }}
      >
        {[...'목표 AX 성숙도 수준'].map((char, index) =>
          char === ' ' ? (
            <span key={index} className="h-0.5" aria-hidden />
          ) : (
            <span
              key={index}
              className="block text-[8px] leading-[140%] font-bold"
            >
              {char}
            </span>
          ),
        )}
      </div>

      {/* Y-axis scale */}
      <div
        style={{ gridArea: 'y-scale' }}
        className="flex flex-col items-end justify-between text-[8px] leading-[140%] text-gray-500"
      >
        <div className="flex flex-col items-end">
          <span className="text-green-500">높음</span>
          <span>100</span>
        </div>
        <span>50</span>
        <div className="flex flex-col items-end">
          <span>0</span>
          <span className="text-red-400">낮음</span>
        </div>
      </div>

      {/* Chart area */}
      <div
        style={{ gridArea: 'chart' }}
        className="relative h-[240px] w-[480px]"
      >
        {/* Quadrant backgrounds */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="bg-red-0 flex h-[120px] w-[240px] flex-col items-start justify-start p-2">
            <span className="text-[8px] leading-[140%] font-bold text-red-400">
              집중 개선 영역 (Top Priority)
            </span>
            <span className="text-[8px] leading-[140%] text-gray-400">
              현재 수준은 낮고, 목표 수준은 높은 영역
            </span>
          </div>
          <div className="bg-special-orange-0 flex h-[120px] w-[240px] flex-col items-end justify-start p-2">
            <span className="text-right text-[8px] leading-[140%] font-bold text-amber-500">
              점진 개선 영역 (Medium Priority)
            </span>
            <span className="text-right text-[8px] leading-[140%] text-gray-400">
              현재 수준은 높고, 목표 수준도 높은 영역
            </span>
          </div>
          <div className="bg-gray-0 flex h-[120px] w-[240px] flex-col items-start justify-end p-2">
            <span className="text-[8px] leading-[140%] font-bold text-gray-400">
              모니터링 영역 (Monitor)
            </span>
            <span className="text-[8px] leading-[140%] text-gray-400">
              현재 수준과 목표 수준 모두 낮은 영역
            </span>
          </div>
          <div className="bg-green-0 flex h-[120px] w-[240px] flex-col items-end justify-end p-2">
            <span className="text-right text-[8px] leading-[140%] font-bold text-teal-500">
              유지 강화 영역 (Low Priority)
            </span>
            <span className="text-right text-[8px] leading-[140%] text-gray-400">
              현재 수준은 높고, 목표 수준은 낮은 영역
            </span>
          </div>
        </div>

        {/* Data points */}
        {perspectives.map((p, i) => {
          const { left, bottom } = clampDotPos(p.current, p.target);
          return (
            <div
              key={p.name}
              className="absolute size-5"
              style={{
                left: left,
                bottom: bottom,
                transform: 'translate(-50%, 50%)',
                zIndex: perspectives.length - i,
              }}
            >
              <div
                className={`txt-c2-bold flex size-5 items-center justify-center rounded-full text-white ${getAreaBgClass(p.current, p.target)}`}
              >
                {i + 1}
              </div>
              <span className="absolute left-full top-1/2 ml-1 -translate-y-1/2 whitespace-nowrap text-[8px] leading-[140%] font-bold text-gray-800">
                {p.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* X-axis */}
      <div
        style={{ gridArea: 'x-axis' }}
        className="flex w-[480px] flex-col gap-0.5"
      >
        <div className="flex justify-between text-[8px] leading-[140%] text-gray-500">
          <div className="flex flex-col">
            <span className="text-red-400">낮음</span>
            <span>0</span>
          </div>
          <span className="self-end">50</span>
          <div className="flex flex-col items-end">
            <span className="text-green-500">높음</span>
            <span>100</span>
          </div>
        </div>
        <div className="text-center text-[8px] leading-[140%] font-bold text-gray-600">
          현재 AX 성숙도 수준
        </div>
      </div>
    </div>
  );
}
