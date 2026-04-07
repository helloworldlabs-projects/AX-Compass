'use client';

import { useId, useMemo } from 'react';

import { cn } from '@/lib/utils';

export type StarState = 'empty' | 'half' | 'full';

/** Lucide `star`와 동일한 24×24 경로 */
const STAR_PATH =
  'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z';

type StarGlyphProps = {
  state: StarState;
  /** 지정 시 고정 픽셀 크기. 생략 시 모바일 40px · lg 이상 52px */
  size?: number;
  color?: string;
  className?: string;
};

function StarGlyph({ state, size, color = 'currentColor', className }: StarGlyphProps) {
  const reactId = useId();
  const clipId = useMemo(() => `star-half-${reactId.replace(/:/g, '')}`, [reactId]);

  const strokeWidth = 3;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...(size != null ? { width: size, height: size } : {})}
      className={cn('shrink-0', size == null && 'size-10 lg:size-[52px]', className)}
      aria-hidden
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect x={0} y={0} width={12} height={24} />
        </clipPath>
      </defs>

      {state === 'full' && (
        <path d={STAR_PATH} fill={color} stroke="none" vectorEffect="non-scaling-stroke" />
      )}

      {state === 'empty' && (
        <path
          d={STAR_PATH}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      )}

      {state === 'half' && (
        <>
          <path
            d={STAR_PATH}
            fill={color}
            stroke="none"
            clipPath={`url(#${clipId})`}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={STAR_PATH}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
}

export { StarGlyph };

/*
사용 예시:

import { StarGlyph } from '@/components/StarGlyph';

<StarGlyph state="full" color="#ea580c" />
<StarGlyph state="half" color="#ea580c" />
<StarGlyph state="empty" color="#ea580c" />
고정 크기: size prop 숫자 지정
*/
