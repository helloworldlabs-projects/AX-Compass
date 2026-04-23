'use client';

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { InstitutionCompetencyStat, InstitutionLevel } from '@/types/institution';
import { INSTITUTION_LEVEL_LABEL_MAP } from '@/constants/levelConfig';
import { COMPETENCY_NAME_MAP } from '@/constants/competencyConfig';

const COMPETENCY_COLORS: Record<string, string[]> = {
  UNDERSTAND: ['#FFBDC7', '#F97190', '#D43F5A', '#8B1A2B'],
  USE_AND_APPLY: ['#B8D4F5', '#6B9FD4', '#2D66A8', '#1A3D6B'],
  EVALUATE: ['#E8D4F5', '#C4A0E8', '#7B35C4', '#4A1A8A'],
  RESPONSIBLE: ['#E0E0E0', '#A0A0A0', '#606060', '#303030'],
};

const COMPETENCY_BORDER: Record<string, string> = {
  UNDERSTAND: '#FFDEE6',
  USE_AND_APPLY: '#D5E3F5',
  EVALUATE: '#E9DBFF',
  RESPONSIBLE: '#E1E1E1',
};

const LEVELS: InstitutionLevel[] = ['BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED'];

const AXIS_TICK_STYLE = { fill: '#6b6b6b', fontSize: 16, fontWeight: 700 } as const;

const RoundedBar = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
}) => {
  const { x = 0, y = 0, width = 0, height = 0, fill, stroke } = props;
  if (!height || height <= 0) return null;
  const r = Math.min(width / 2, height, 16);
  return (
    <path
      d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth={stroke ? 3 : 0}
    />
  );
};

export interface CompetencyLevelChartProps {
  stat: InstitutionCompetencyStat;
}

export function CompetencyLevelChart({ stat }: CompetencyLevelChartProps) {
  const colors = COMPETENCY_COLORS[stat.competencyCode] ?? COMPETENCY_COLORS['RESPONSIBLE'];
  const border = COMPETENCY_BORDER[stat.competencyCode] ?? COMPETENCY_BORDER['RESPONSIBLE'];
  const title = COMPETENCY_NAME_MAP[stat.competencyCode];

  const data = LEVELS.map((level, i) => ({
    name: INSTITUTION_LEVEL_LABEL_MAP[level],
    value: stat.levelRatios[level] ?? 0,
    fill: colors[i],
    stroke: border,
  }));

  return (
    <div className="w-full max-w-[500px]">
      <p className="txt-st-bold mb-4 text-center">{title}</p>
      <div className="relative">
        <span className="txt-b-bold absolute top-0 left-4.5 text-gray-500">%</span>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 30, right: 16, left: 16, bottom: 4 }}>
            <XAxis dataKey="name" tickLine={false} tick={AXIS_TICK_STYLE} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(v) => String(v)}
              tickLine={false}
              width={30}
              tick={AXIS_TICK_STYLE}
            />
            <Bar dataKey="value" barSize={54} shape={<RoundedBar />} isAnimationActive={false}>
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => `${Math.round(v as number)}%`}
                style={{ fill: '#6b6b6b', fontSize: 16, fontWeight: 700 }}
              />
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} stroke={entry.stroke} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
