interface AxMultiFacetRadarChartProps {
  se: number;
  sj: number;
  bh: number;
  size?: number;
}

const TICKS = [25, 50, 75, 100] as const;
const TICK_LABELS = [25, 50, 75] as const;
const AXIS_CONFIG = [
  { label: '자기평가 (SE)', key: 'se' as const },
  { label: '행동빈도 (BH)', key: 'bh' as const },
  { label: '상황판단 (SJ)', key: 'sj' as const },
];
const LABEL_FONT_SIZE = 8;
const LABEL_PAD = 4;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function polygonPoints(
  values: number[],
  cx: number,
  cy: number,
  maxR: number,
  axisCount: number,
): string {
  return values
    .map((value, index) => {
      const angle = (360 / axisCount) * index;
      const r = (value / 100) * maxR;
      const { x, y } = polar(cx, cy, r, angle);
      return `${x},${y}`;
    })
    .join(' ');
}

export function AxMultiFacetRadarChart({
  se,
  sj,
  bh,
  size = 282,
}: AxMultiFacetRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 28;
  const axisCount = 3;
  const valueByKey = { se, sj, bh };
  const values = AXIS_CONFIG.map(({ key }) => valueByKey[key]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="mx-auto"
      style={{ overflow: 'visible' }}
    >
      {TICKS.map((tick) => {
        const r = (tick / 100) * maxR;
        return (
          <circle
            key={tick}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#9ca3af"
            strokeWidth={0.75}
          />
        );
      })}

      {values.map((_, index) => {
        const angle = (360 / axisCount) * index;
        const end = polar(cx, cy, maxR, angle);
        return (
          <line
            key={index}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#d1d5db"
            strokeWidth={0.75}
          />
        );
      })}

      {TICK_LABELS.map((tick) => {
        const r = (tick / 100) * maxR;
        return (
          <text
            key={tick}
            x={cx + 3}
            y={cy - r + 1}
            fontSize={8}
            fill="#9ca3af"
            dominantBaseline="auto"
          >
            {tick}
          </text>
        );
      })}

      <polygon
        points={polygonPoints(values, cx, cy, maxR, axisCount)}
        fill="rgba(89,100,113,0.45)"
        stroke="#596471"
        strokeWidth={1.5}
      />

      {AXIS_CONFIG.map(({ label }, index) => {
        const angle = (360 / axisCount) * index;
        const normAngle = ((angle % 360) + 360) % 360;
        const labelR = maxR + LABEL_PAD;
        let { x, y } = polar(cx, cy, labelR, angle);

        let anchor: 'middle' | 'start' | 'end' = 'middle';
        let baseline: 'auto' | 'hanging' | 'middle' = 'middle';

        if (normAngle === 0) {
          baseline = 'auto';
          y -= 2;
        } else if (normAngle === 120) {
          anchor = 'start';
          baseline = 'hanging';
          y += 2;
        } else {
          anchor = 'end';
          baseline = 'hanging';
          y += 2;
        }

        return (
          <text
            key={label}
            x={x}
            y={y}
            fontSize={LABEL_FONT_SIZE}
            fontWeight={700}
            fill="#374151"
            textAnchor={anchor}
            dominantBaseline={baseline}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
