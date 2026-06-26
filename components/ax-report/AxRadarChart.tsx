export interface RadarDataPoint {
  /** Axis label */
  label: string;
  /** Current value 0-100 */
  current: number;
  /** Target value 0-100 */
  target: number;
}

interface AxRadarChartProps {
  data: RadarDataPoint[];
  /** Outer chart size in px (default 189) */
  size?: number;
}

const LABEL_FONT_SIZE = 8;
const LABEL_PAD = 8;

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
    .map((v, i) => {
      const angle = (360 / axisCount) * i;
      const r = (v / 100) * maxR;
      const { x, y } = polar(cx, cy, r, angle);
      return `${x},${y}`;
    })
    .join(' ');
}

export function AxRadarChart({ data, size = 189 }: AxRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 24;
  const axisCount = data.length;
  const ticks = [25, 50, 75, 100];

  const currentValues = data.map((d) => d.current);
  const targetValues = data.map((d) => d.target);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      {/* Concentric circle rings */}
      {ticks.map((tick) => {
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

      {/* Axis lines (spokes) */}
      {data.map((_, i) => {
        const angle = (360 / axisCount) * i;
        const end = polar(cx, cy, maxR, angle);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#d1d5db"
            strokeWidth={0.75}
          />
        );
      })}

      {/* Tick labels on top axis */}
      {[25, 50, 75].map((tick) => {
        const r = (tick / 100) * maxR;
        return (
          <text
            key={tick}
            x={cx + 3}
            y={cy - r + 1}
            fontSize={6}
            fill="#9ca3af"
            dominantBaseline="auto"
          >
            {tick}
          </text>
        );
      })}

      {/* Current polygon */}
      <polygon
        points={polygonPoints(currentValues, cx, cy, maxR, axisCount)}
        fill="rgba(214,217,220,0.65)"
        stroke="#596471"
        strokeWidth={1.5}
      />

      {/* Target polygon */}
      <polygon
        points={polygonPoints(targetValues, cx, cy, maxR, axisCount)}
        fill="none"
        stroke="#ff2c45"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />

      {/* Axis labels */}
      {data.map((d, i) => {
        const angle = (360 / axisCount) * i;
        const normAngle = ((angle % 360) + 360) % 360;
        const isHorizontal = normAngle === 90 || normAngle === 270;
        const labelR = isHorizontal ? maxR : maxR + LABEL_PAD;
        let { x, y } = polar(cx, cy, labelR, angle);

        const anchor = 'middle';
        let baseline: 'auto' | 'hanging' | 'middle' = 'middle';

        if (normAngle === 0) {
          baseline = 'auto';
        } else if (normAngle === 180) {
          baseline = 'hanging';
        } else {
          baseline = 'hanging';
          y = y + 4;
        }

        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize={LABEL_FONT_SIZE}
            fontWeight={600}
            fill="#374151"
            textAnchor={anchor}
            dominantBaseline={baseline}
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
