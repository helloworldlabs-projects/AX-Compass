import type { AxProfileType } from '../../types/ax-report';
import { PROFILE_TYPE_CONFIG } from './AxProfileDonutChart';

const RADAR_AXIS_ORDER: AxProfileType[] = [
  'BALANCED',
  'OVERCONFIDENT',
  'DOER',
  'CAUTIOUS',
  'ANALYST',
  'LEARNER',
];

const CX = 75;
const CY = 68;
const MAX_R = 42;
const LABEL_R = 54;
const SIZE = 150;
const GRID_LEVELS = 4;
const N = RADAR_AXIS_ORDER.length;
const LEGEND_Y = 140;
const MIN_RENDER_R = 0.5;

function polarToCartesian(r: number, angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function getTextAnchor(angleDeg: number): 'middle' | 'start' | 'end' {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a === 0 || a === 180) return 'middle';
  return a < 180 ? 'start' : 'end';
}

function getDominantBaseline(
  angleDeg: number,
): 'auto' | 'hanging' | 'middle' {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a === 0) return 'auto';
  if (a === 180) return 'hanging';
  return 'middle';
}

interface AxProfileRadarChartProps {
  profileCounts: Partial<Record<AxProfileType, number>>;
  targetCounts?: Record<AxProfileType, number>;
}

export function AxProfileRadarChart({
  profileCounts,
  targetCounts,
}: AxProfileRadarChartProps) {
  const scaleValues = targetCounts
    ? RADAR_AXIS_ORDER.map((t) => targetCounts[t])
    : RADAR_AXIS_ORDER.map((t) => profileCounts[t] ?? 0);
  const maxCount = Math.max(...scaleValues, 1);
  const maxScale = Math.ceil(maxCount / 2) * 2;

  const toRatio = (count: number): number => (count / maxScale) * 100;

  const axes = RADAR_AXIS_ORDER.map((type, i) => ({
    type,
    angle: i * (360 / N),
    currentRatio: toRatio(profileCounts[type] ?? 0),
    targetRatio: targetCounts ? toRatio(targetCounts[type]) : 0,
  }));

  const gridRings = Array.from({ length: GRID_LEVELS }, (_, i) => {
    const ratio = (i + 1) / GRID_LEVELS;
    const r = MAX_R * ratio;
    const label = Math.round(maxScale * ratio);
    const points = axes
      .map(({ angle }) => {
        const { x, y } = polarToCartesian(r, angle);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
    return { r, label, points };
  });

  const buildPolygon = (ratioKey: 'currentRatio' | 'targetRatio'): string =>
    axes
      .map((a) => {
        const ratio = a[ratioKey] / 100;
        const r = ratio === 0 ? MIN_RENDER_R : ratio * MAX_R;
        const { x, y } = polarToCartesian(r, a.angle);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');

  const currentPolygon = buildPolygon('currentRatio');
  const targetPolygon = targetCounts ? buildPolygon('targetRatio') : null;

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ display: 'block' }}
    >
      {gridRings.map(({ points }, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#818181"
          strokeWidth={0.5}
        />
      ))}
      {axes.map(({ angle, type }) => {
        const { x, y } = polarToCartesian(MAX_R, angle);
        return (
          <line
            key={type}
            x1={CX}
            y1={CY}
            x2={x.toFixed(2)}
            y2={y.toFixed(2)}
            stroke="#818181"
            strokeWidth={0.5}
          />
        );
      })}
      <polygon
        points={currentPolygon}
        fill="rgba(100,116,139,0.25)"
        stroke="#383649"
        strokeWidth={1.5}
      />
      {targetPolygon && (
        <polygon
          points={targetPolygon}
          fill="none"
          stroke="#ef4444"
          strokeWidth={1.5}
          strokeDasharray="4 2"
        />
      )}
      {axes.map(({ angle, type }) => {
        const { x, y } = polarToCartesian(LABEL_R, angle);
        const { label } = PROFILE_TYPE_CONFIG[type];
        return (
          <text
            key={type}
            x={x.toFixed(2)}
            y={y.toFixed(2)}
            textAnchor={getTextAnchor(angle)}
            dominantBaseline={getDominantBaseline(angle)}
            fontSize={8}
            fontWeight={700}
            fill="#374151"
          >
            {label}
          </text>
        );
      })}
      <text
        x={CX + 3}
        y={CY}
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={6}
        fill="#9ca3af"
      >
        0
      </text>
      {gridRings.map(({ r, label }, i) => (
        <text
          key={i}
          x={CX + 3}
          y={(CY - r).toFixed(2)}
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={6}
          fill="#9ca3af"
        >
          {label}
        </text>
      ))}
      <circle cx={47} cy={LEGEND_Y} r={4} fill="#475569" />
      <text x={54} y={LEGEND_Y} dominantBaseline="middle" fontSize={8} fill="#374151">
        현재
      </text>
      <circle cx={82} cy={LEGEND_Y} r={4} fill="#ef4444" />
      <text x={89} y={LEGEND_Y} dominantBaseline="middle" fontSize={8} fill="#374151">
        목표
      </text>
    </svg>
  );
}
