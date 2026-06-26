const W = 120;
const H = 60;
const CX = W / 2;
const CY = H - 3;
const OUTER_R = 50;
const INNER_R = 34;

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: parseFloat((CX + r * Math.cos(rad)).toFixed(3)),
    y: parseFloat((CY + r * Math.sin(rad)).toFixed(3)),
  };
}

function buildArc(startDeg: number, endDeg: number): string {
  const delta = endDeg - startDeg;
  if (Math.abs(delta) < 0.001) return '';
  const p1 = polar(OUTER_R, startDeg);
  const p2 = polar(OUTER_R, endDeg);
  const p3 = polar(INNER_R, endDeg);
  const p4 = polar(INNER_R, startDeg);
  const large = Math.abs(delta) > 180 ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

export interface AxGaugeMeterProps {
  label: string;
  rank: number;
  current: number;
  target: number;
  accentColor?: string;
}

export function AxGaugeMeter({
  label,
  rank,
  current,
  target,
  accentColor = '#f87171',
}: AxGaugeMeterProps) {
  const rate = target > 0 ? Math.min(current / target, 1) : 0;
  const pct = rate * 100;

  return (
    <div className="flex flex-col gap-0.5">
      {/* Rank badge + label */}
      <div className="txt-c2-bold flex items-center gap-1">
        <div
          className="flex size-4 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          {rank}
        </div>
        <span className="text-black">{label}</span>
      </div>

      {/* Gauge */}
      <div className="relative" style={{ width: W, height: H }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {/* gray background arc */}
          <path d={buildArc(-90, 90)} fill="#E1E1E1" />
          {/* target arc */}
          {target > 0 && (
            <path
              d={buildArc(-90, -90 + (target / 100) * 180)}
              fill="#C4C4C4"
            />
          )}
          {/* current arc */}
          {current > 0 && (
            <path
              d={buildArc(-90, -90 + (current / 100) * 180)}
              fill={accentColor}
            />
          )}
        </svg>

        {/* Center text overlay */}
        <div
          className="absolute inset-x-0 flex items-center justify-center"
          style={{ bottom: 6 }}
        >
          <span className="txt-b-bold" style={{ color: accentColor }}>
            {current.toFixed(0)}
          </span>
        </div>

        {/* Target value badge */}
        <div
          className="bg-special-dark-blue-100 absolute rounded-full px-1 py-0.5 text-[8px] leading-[140%] font-bold text-gray-700"
          style={{ top: 12, right: 2 }}
        >
          목표: {target.toFixed(0)}
        </div>
      </div>

      {/* Achievement rate */}
      <div className="txt-c2-bold text-center" style={{ color: accentColor }}>
        달성률 {pct.toFixed(0)}%
      </div>
    </div>
  );
}
