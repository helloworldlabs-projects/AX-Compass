const SIZE = 150;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 68;
const INNER_R = 30;
const LABEL_R = (OUTER_R + INNER_R) / 2;
const GAP_DEG = 3;

function polarToCartesian(
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arcPath(startDeg: number, sweepDeg: number): string {
  const endDeg = startDeg + sweepDeg;
  const os = polarToCartesian(OUTER_R, startDeg);
  const oe = polarToCartesian(OUTER_R, endDeg);
  const ie = polarToCartesian(INNER_R, endDeg);
  const is_ = polarToCartesian(INNER_R, startDeg);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M ${os.x} ${os.y} A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${oe.x} ${oe.y} L ${ie.x} ${ie.y} A ${INNER_R} ${INNER_R} 0 ${large} 0 ${is_.x} ${is_.y} Z`;
}

interface AxResponseDonutChartProps {
  executiveCount: number;
  memberCount: number;
}

export function AxResponseDonutChart({
  executiveCount,
  memberCount,
}: AxResponseDonutChartProps) {
  const total = executiveCount + memberCount;
  if (total === 0) return null;

  const memberAngleFull = (memberCount / total) * 360;
  const execAngleFull = (executiveCount / total) * 360;

  const memberStart = GAP_DEG / 2;
  const memberSweep = memberAngleFull - GAP_DEG;

  const execStart = memberAngleFull + GAP_DEG / 2;
  const execSweep = execAngleFull - GAP_DEG;

  const memberMid = polarToCartesian(LABEL_R, memberStart + memberSweep / 2);
  const execMid = polarToCartesian(LABEL_R, execStart + execSweep / 2);

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
    >
      <path
        d={arcPath(memberStart, memberSweep)}
        fill="var(--color-special-orange-400)"
      />
      <path
        d={arcPath(execStart, execSweep)}
        fill="var(--color-special-dark-blue-400)"
      />
      <text
        x={memberMid.x}
        y={memberMid.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="13"
        fontWeight="700"
      >
        {memberCount}
      </text>
      <text
        x={execMid.x}
        y={execMid.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="11"
        fontWeight="700"
      >
        {executiveCount}
      </text>
    </svg>
  );
}
