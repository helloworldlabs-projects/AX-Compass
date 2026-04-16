import type { ReactNode } from 'react';

import { type Level } from '@/constants/levelConfig';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { cn } from '@/lib/utils';

export type LevelCompetencyCellProps = {
  level: Level;
  /** 카테고리 제목 (예: 이해(Understand)) */
  categoryTitle: string;
  /** 카테고리 공통 설명 */
  categorySummary: string;
  /** 해당 칸의 레벨별 상세 설명 */
  description: ReactNode;
  /** 좌측 배지 ↔ 우측 텍스트 블록 간격 (기본: 모바일 12px, lg 16px) */
  gapClassName?: string;
  className?: string;
};

/**
 * 역량 매트릭스 한 칸: 좌측 `LevelBadge` + 우측 텍스트(제목·요약·[레벨]·상세).
 * 제목·레벨 라벨은 `div`, 요약 문단은 `p`, 상세는 `ReactNode`를 담는 `div`.
 */
function LevelCompetencyCell({
  level,
  categoryTitle,
  categorySummary,
  description,
  gapClassName = 'gap-3 lg:gap-6',
  className,
}: LevelCompetencyCellProps) {
  return (
    <div className={cn('flex w-full items-center', gapClassName, className)}>
      <LevelBadge level={level} className="shrink-0" />
      <div className={cn('flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 text-black')}>
        <div className="txt-st-bold">{categoryTitle}</div>
        <p className="txt-b-regular">{categorySummary}</p>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-purple-700">[{level}]</div>
          <div className="txt-b-regular">{description}</div>
        </div>
      </div>
    </div>
  );
}

export { LevelCompetencyCell };
