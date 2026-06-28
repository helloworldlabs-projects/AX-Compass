import type { AxProfileType } from '../../types/ax-report';

export const PROFILE_ORDER: AxProfileType[] = [
  'BALANCED',
  'LEARNER',
  'DOER',
  'OVERCONFIDENT',
  'ANALYST',
  'CAUTIOUS',
];

export const PROFILE_TYPE_CONFIG: Record<
  AxProfileType,
  { label: string; color: string }
> = {
  BALANCED: { label: '균형형', color: '#8979FF' },
  DOER: { label: '실행형', color: '#FF928A' },
  OVERCONFIDENT: { label: '과신형', color: '#3CC3DF' },
  ANALYST: { label: '판단형', color: '#FFAE4C' },
  CAUTIOUS: { label: '조심형', color: '#537FF1' },
  LEARNER: { label: '이해형', color: '#6FD195' },
};

const CX = 75;
const CY = 75;
const OUTER_R = 65;
const INNER_R = 34;
const LABEL_R = 50;
const SIZE = 150;

function polarToCartesian(
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function buildArcPath(startAngle: number, endAngle: number): string {
  const p1 = polarToCartesian(OUTER_R, startAngle);
  const p2 = polarToCartesian(OUTER_R, endAngle);
  const p3 = polarToCartesian(INNER_R, endAngle);
  const p4 = polarToCartesian(INNER_R, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

interface AxProfileDonutChartProps {
  profileRatios: Partial<Record<AxProfileType, number>>;
  totalCount: number;
}

export function AxProfileDonutChart({
  profileRatios,
  totalCount,
}: AxProfileDonutChartProps) {
  let currentAngle = 0;
  const segments = PROFILE_ORDER.flatMap((type) => {
    const ratio = profileRatios[type] ?? 0;
    if (ratio <= 0) return [];
    const startAngle = currentAngle;
    const endAngle = currentAngle + (ratio / 100) * 360;
    currentAngle = endAngle;
    return [{ type, ratio, startAngle, endAngle }];
  });

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ display: 'block' }}
    >
      {segments.map(({ type, ratio, startAngle, endAngle }) => {
        const { color } = PROFILE_TYPE_CONFIG[type];
        const midAngle = (startAngle + endAngle) / 2;
        const labelPos = polarToCartesian(LABEL_R, midAngle);
        return (
          <g key={type}>
            <path d={buildArcPath(startAngle, endAngle)} fill={color} />
            {ratio >= 5 && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                className="txt-c2-bold"
              >
                {Math.round(ratio)}%
              </text>
            )}
          </g>
        );
      })}
      <text
        x={CX}
        y={CY - 9}
        textAnchor="middle"
        dominantBaseline="middle"
        className="txt-c2-bold"
      >
        전체 구성원
      </text>
      <text
        x={CX}
        y={CY + 9}
        textAnchor="middle"
        dominantBaseline="middle"
        className="txt-b-bold"
      >
        {totalCount}명
      </text>
    </svg>
  );
}
