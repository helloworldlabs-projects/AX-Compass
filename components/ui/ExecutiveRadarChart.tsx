interface ExecutiveRadarChartProps {
  strategyScore: number;
  governanceScore: number;
  adoptionScore: number;
  dataSystemScore: number;
  strokeColor: string;
}

const CX = 200;
const CY = 200;
const MAX_R = 140;
const GRID_LEVELS = [25, 50, 75, 100];

const AXES = [
  { label: '운영체계·확산', angle: 0, anchor: 'middle' as const },
  { label: '업무·적용', angle: 90, anchor: 'end' as const },
  { label: '데이터·시스템 기반', angle: 180, anchor: 'middle' as const },
  { label: '전략·리더십', angle: 270, anchor: 'start' as const },
];

function polarToPoint(score: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  const r = MAX_R * (score / 100);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function axisEdge(angleDeg: number) {
  return polarToPoint(100, angleDeg);
}

function labelPosition(angleDeg: number) {
  const edge = axisEdge(angleDeg);
  // const offset = 22;
  const offset = 20;
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: edge.x + offset * Math.cos(rad),
    y: edge.y + offset * Math.sin(rad),
  };
}

export function ExecutiveRadarChart({
  strategyScore,
  governanceScore,
  adoptionScore,
  dataSystemScore,
  strokeColor,
}: ExecutiveRadarChartProps) {
  const scores = [governanceScore, adoptionScore, dataSystemScore, strategyScore];

  const dataPoints = AXES.map((axis, i) => polarToPoint(scores[i], axis.angle));
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      aria-label="임원 역량 레이더 차트"
      role="img"
    >
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

      {/* grid 레이블 (top 축 오른쪽) */}
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

      {/* 십자형 4개 축선 */}
      <line x1={CX} y1={CY} x2={CX} y2={CY - MAX_R} stroke="#898989" strokeWidth={0.7} />
      <line x1={CX} y1={CY} x2={CX + MAX_R} y2={CY} stroke="#898989" strokeWidth={0.7} />
      <line x1={CX} y1={CY} x2={CX} y2={CY + MAX_R} stroke="#898989" strokeWidth={0.7} />
      <line x1={CX} y1={CY} x2={CX - MAX_R} y2={CY} stroke="#898989" strokeWidth={0.7} />

      {/* 데이터 폴리곤 */}
      <polygon
        points={polygonPoints}
        fill={strokeColor}
        fillOpacity={0.2}
        stroke={strokeColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* 축 레이블 */}
      {AXES.map((axis) => {
        const { x, y } = labelPosition(axis.angle);
        return (
          <text
            key={axis.angle}
            x={x}
            y={y}
            fontSize={14}
            fontWeight="700"
            fill="#111827"
            textAnchor={axis.anchor}
            dominantBaseline="middle"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
