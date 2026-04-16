interface RadarChartProps {
  seScore: number;
  sjScore: number;
  bhScore: number;
  strokeColor: string;
}

const CX = 200;
const CY = 200;
const MAX_R = 140;
const GRID_LEVELS = [25, 50, 75, 100];
const AXES = [
  { label: '자기 평가', score: 0, angle: 0 },
  { label: '행동 빈도', score: 0, angle: 120 },
  { label: '상황 판단', score: 0, angle: 240 },
] as const;

function polarToPoint(score: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  const r = MAX_R * (score / 100);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function axisEdge(angleDeg: number) {
  return polarToPoint(100, angleDeg);
}

function labelPosition(angleDeg: number): {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
} {
  const edge = axisEdge(angleDeg);
  const offset = 22;
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: edge.x + offset * Math.cos(rad),
    y: edge.y + offset * Math.sin(rad),
    anchor: angleDeg === 0 ? 'middle' : angleDeg === 120 ? 'start' : 'end',
  };
}

export function RadarChart({ seScore, sjScore, bhScore, strokeColor }: RadarChartProps) {
  const scores = [seScore, bhScore, sjScore];

  const dataPoints = AXES.map((axis, i) => polarToPoint(scores[i], axis.angle));
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-label="역량 레이더 차트" role="img">
      {/* 동심원 grid */}
      {GRID_LEVELS.map((level) => (
        <circle
          key={level}
          cx={CX}
          cy={CY}
          r={MAX_R * (level / 100)}
          fill="none"
          stroke="#898989"
          strokeWidth={0.7}
        />
      ))}

      {/* grid 레이블 (top 축 기준) */}
      {[25, 50, 75].map((level) => (
        <text
          key={level}
          x={CX + 4}
          y={CY - MAX_R * (level / 100) + 4}
          fontSize={11}
          fill="#9ca3af"
          textAnchor="start"
        >
          {level}
        </text>
      ))}

      {/* 3개 축선 */}
      {AXES.map((axis) => {
        const edge = axisEdge(axis.angle);
        return (
          <line
            key={axis.angle}
            x1={CX}
            y1={CY}
            x2={edge.x}
            y2={edge.y}
            stroke="#898989"
            strokeWidth={0.7}
          />
        );
      })}

      {/* 데이터 폴리곤 */}
      <polygon
        points={polygonPoints}
        fill={strokeColor}
        fillOpacity={0.2}
        stroke={strokeColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* 데이터 포인트 */}
      {/* {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={strokeColor} />
      ))} */}

      {/* 축 레이블 */}
      {AXES.map((axis) => {
        const { x, y, anchor } = labelPosition(axis.angle);
        return (
          <text
            key={axis.angle}
            x={x}
            y={y}
            fontSize={14}
            fontWeight="700"
            fill="#111827"
            textAnchor={anchor}
            dominantBaseline="middle"
            className="txt-c1-bold"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
