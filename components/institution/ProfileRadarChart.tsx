import type { ProfileType } from '@/types/exam';

interface ProfileRadarChartProps {
  profileRatios: Record<ProfileType, number>;
}

const CX = 250;
const CY = 250;
const MAX_R = 170;
const GRID_LEVELS = [25, 50, 75, 100];

const AXES = [
  { key: 'BALANCED' as ProfileType, label: '균형형', angle: 330 },
  { key: 'LEARNER' as ProfileType, label: '이해형', angle: 30 },
  { key: 'CAUTIOUS' as ProfileType, label: '조심형', angle: 90 },
  { key: 'ANALYST' as ProfileType, label: '판단형', angle: 150 },
  { key: 'DOER' as ProfileType, label: '실행형', angle: 210 },
  { key: 'OVERCONFIDENT' as ProfileType, label: '과신형', angle: 270 },
] as const;

function polarToPoint(score: number, angleDeg: number, cx: number, cy: number, maxR: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  const r = maxR * (score / 100);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function getLabelAnchor(angle: number): {
  anchor: 'start' | 'middle' | 'end';
  baseline: 'auto' | 'middle' | 'hanging';
} {
  const norm = ((angle % 360) + 360) % 360;
  const anchor: 'start' | 'middle' | 'end' =
    norm > 180 ? 'end' : norm === 0 || norm === 180 ? 'middle' : 'start';
  let baseline: 'auto' | 'middle' | 'hanging' = 'middle';
  if (norm >= 300 || norm <= 60) baseline = 'auto';
  else if (norm > 120 && norm < 240) baseline = 'hanging';
  return { anchor, baseline };
}

export function ProfileRadarChart({ profileRatios }: ProfileRadarChartProps) {
  const dataPoints = AXES.map((axis) =>
    polarToPoint(profileRatios[axis.key], axis.angle, CX, CY, MAX_R),
  );
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      viewBox="0 0 500 500"
      className="h-full w-full"
      aria-label="프로필 유형 레이더 차트"
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
          strokeWidth={0.8}
        />
      ))}

      {/* grid 값 레이블 (25, 50, 75) — 중앙 위쪽 축(0° 방향) 근처 */}
      {[25, 50, 75].map((level) => (
        <text
          key={level}
          x={CX - 8}
          y={CY - MAX_R * (level / 100) + 4}
          fontSize={16}
          fill="#6B6B6B"
          textAnchor="start"
        >
          {level}
        </text>
      ))}

      {/* % 와 100 레이블 — 최상단 중앙 */}
      <text
        x={CX}
        y={CY - MAX_R - 16}
        fontSize={16}
        fontWeight={700}
        fill="#6B6B6B"
        textAnchor="middle"
        dominantBaseline="auto"
      >
        %
      </text>
      <text
        x={CX - 14}
        y={CY - MAX_R + 4}
        fontSize={16}
        fontWeight={700}
        fill="#6B6B6B"
        textAnchor="start"
      >
        100
      </text>

      {/* 6개 축선 */}
      {AXES.map((axis) => {
        const edge = polarToPoint(100, axis.angle, CX, CY, MAX_R);
        return (
          <line
            key={axis.key}
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
        fill="#2d3a4a"
        fillOpacity={0.15}
        stroke="#344151"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* 축 레이블 */}
      {AXES.map((axis) => {
        const edge = polarToPoint(100, axis.angle, CX, CY, MAX_R);
        const rad = (axis.angle - 90) * (Math.PI / 180);
        const offset = 22;
        const lx = edge.x + offset * Math.cos(rad);
        const ly = edge.y + offset * Math.sin(rad);
        const { anchor, baseline } = getLabelAnchor(axis.angle);
        return (
          <text
            key={axis.key}
            x={lx}
            y={ly}
            fontSize={14}
            fontWeight={700}
            fill="#000000"
            textAnchor={anchor}
            dominantBaseline={baseline}
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
