'use client';

import { useId, useState } from 'react';

import { StarGlyph } from '@/components/StarGlyph';

export type StarRatingValue = 1 | 2 | 3 | 4 | 5;

type StarRatingInputProps = {
  value: StarRatingValue | 0;
  onChange: (value: StarRatingValue) => void;
  /** 생략 시 모바일 40px · lg 52px (`StarGlyph` 기본) */
  size?: number;
  color?: string;
  disabled?: boolean;
};

function StarRatingInput({
  value,
  onChange,
  size,
  color = 'currentColor',
  disabled = false,
}: StarRatingInputProps) {
  const groupName = useId();
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  return (
    <fieldset
      disabled={disabled}
      className="m-0 min-w-0 border-0 p-0"
      onMouseLeave={() => setHoverValue(null)}
    >
      <legend className="sr-only">평점</legend>
      <div className={`flex gap-2 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <label
            key={n}
            htmlFor={`${groupName}-${n}`}
            className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            onMouseEnter={() => {
              if (!disabled) setHoverValue(n);
            }}
          >
            <input
              id={`${groupName}-${n}`}
              type="radio"
              name={groupName}
              value={String(n)}
              checked={value === n}
              disabled={disabled}
              className="sr-only"
              onChange={() => onChange(n)}
              aria-label={`${n}점`}
            />
            <StarGlyph state={displayValue >= n ? 'full' : 'empty'} size={size} color={color} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export { StarRatingInput };
