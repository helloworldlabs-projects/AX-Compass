import { StarGlyph, type StarState } from '@/components/StarGlyph';

type StarRatingDisplayProps = {
  value: number;
  /** 생략 시 모바일 40px · lg 52px (`StarGlyph` 기본) */
  size?: number;
  color?: string;
};

function getStarState(index: number, clampedValue: number): StarState {
  const floor = Math.floor(clampedValue);
  const frac = clampedValue % 1;

  if (index < floor) return 'full';
  if (index === floor && frac >= 0.5) return 'half';
  return 'empty';
}

function StarRatingDisplay({ value, size, color = 'currentColor' }: StarRatingDisplayProps) {
  const clampedValue = Math.min(5, Math.max(0, value || 0));
  const labelText = `5점 중 ${clampedValue}점`;

  return (
    <div
      role="img"
      aria-label={labelText}
      className="inline-flex gap-2"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <StarGlyph
          key={index}
          state={getStarState(index, clampedValue)}
          size={size}
          color={color}
        />
      ))}
    </div>
  );
}

export { StarRatingDisplay };

/*
사용 예시:

import { StarRatingDisplay } from '@/components/StarRatingDisplay';

<StarRatingDisplay value={3.5} color="#ea580c" />
<StarRatingDisplay value={0} />
*/
