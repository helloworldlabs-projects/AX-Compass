import React from 'react';
import { Star } from 'lucide-react';

import { LEVEL_CONFIG, type Level } from '@/constants/levelConfig';

interface LevelBadgeProps {
  level: Level;
  className?: string;
}

export const LevelBadge = React.memo(function LevelBadge({ level, className }: LevelBadgeProps) {
  const { starColor, barColors } = LEVEL_CONFIG[level];

  return (
    <div
      className={`flex w-[50px] flex-col items-center gap-1 ${className ? ` ${className}` : ''}`}
    >
      <Star className={`h-10 w-10 fill-current ${starColor}`} aria-hidden="true" />
      <div className="flex w-full flex-col-reverse">
        {barColors.map((color, index) => (
          <div key={index} className={`h-2 w-full rounded-[4px] ${color}`} />
        ))}
      </div>
      <span className="txt-c2-bold w-10 rounded-[8px] border border-gray-100 bg-gray-700 text-center whitespace-nowrap text-white">
        {level}
      </span>
    </div>
  );
});
