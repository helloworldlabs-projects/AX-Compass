'use client';

import { forwardRef, useId, useState } from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

type InputType = 'text' | 'search' | 'password' | 'email';

export type InputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'size'
> & {
  label?: string;
  placeholder?: string;
  /** 제어 컴포넌트일 때 사용 */
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  type?: InputType;
  error?: string;
  disabled?: boolean;
};

/**
 * 단일 입력 컴포넌트: `type`으로 text / search / password / email 구분.
 * Search는 동일 룩에 좌측 검색 아이콘만 추가 (간격·크기는 breakpoint별 스펙).
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    placeholder,
    value,
    onChange,
    defaultValue,
    type = 'text',
    error,
    disabled,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const id = idProp ?? `input-${uid}`;
  const isSearch = type === 'search';
  const htmlType = type;

  const isControlled = value !== undefined;
  const [uncontrolledFilled, setUncontrolledFilled] = useState(() =>
    Boolean(defaultValue && String(defaultValue).length > 0),
  );
  const filled = isControlled ? (value?.length ?? 0) > 0 : uncontrolledFilled;

  const describedBy = error ? `${id}-error` : undefined;

  const control = (
    <div className="relative w-full">
      {isSearch ? (
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-purple-500 lg:left-4 lg:size-6"
          aria-hidden
          strokeWidth={2}
        />
      ) : null}
      <input
        ref={ref}
        id={id}
        data-slot="input"
        data-filled={filled ? true : undefined}
        type={htmlType}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={(e) => {
          const v = e.target.value;
          if (!isControlled) {
            setUncontrolledFilled(v.length > 0);
          }
          onChange?.(v);
        }}
        className={cn(
          'txt-b-regular bg-gray-0 w-full rounded-[12px] border-0 text-black caret-purple-800 shadow transition-colors',
          'h-12 px-3 lg:h-[46px] lg:px-4',
          'placeholder:text-gray-500',
          'focus:bg-white focus:text-black focus:outline-none',
          'data-filled:bg-white data-filled:text-gray-700',
          'disabled:cursor-not-allowed disabled:bg-white disabled:text-gray-700',
          isSearch && 'pr-3 pl-[44px] lg:pr-4 lg:pl-14',
          !isSearch && 'px-3 lg:px-4',
          className,
        )}
        {...rest}
      />
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-1.5 lg:gap-2">
      {label ? (
        <label htmlFor={id} className="txt-c1-bold text-gray-500 uppercase">
          {label}
        </label>
      ) : null}
      {control}
      {error ? (
        <p id={`${id}-error`} role="alert" className="txt-c1-bold text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export { Input };
