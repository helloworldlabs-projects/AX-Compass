'use client';

import { forwardRef, useId, useState } from 'react';

import { cn } from '@/lib/utils';

export type TextAreaProps = Omit<
  React.ComponentPropsWithoutRef<'textarea'>,
  'onChange' | 'value' | 'defaultValue' | 'size'
> & {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  error?: string;
  disabled?: boolean;
};

/**
 * TextDisplay·Input과 같은 카드 룩의 여러 줄 입력.
 * 배경·텍스트·포커스·filled·disabled 규칙은 `Input`과 동일, 고정 높이 104px.
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    placeholder,
    value,
    onChange,
    defaultValue,
    error,
    disabled,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const id = idProp ?? `textarea-${uid}`;

  const isControlled = value !== undefined;
  const [uncontrolledFilled, setUncontrolledFilled] = useState(() =>
    Boolean(defaultValue && String(defaultValue).length > 0),
  );
  const filled = isControlled ? (value?.length ?? 0) > 0 : uncontrolledFilled;

  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="flex w-full flex-col gap-2.5 lg:gap-3.5">
      {label ? (
        <label htmlFor={id} className="txt-c1-bold text-gray-500 uppercase">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={id}
        data-slot="textarea"
        data-filled={filled ? true : undefined}
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
          'txt-b-regular bg-gray-0 w-full resize-none overflow-y-auto rounded-[12px] border-0 text-black caret-purple-800 shadow transition-colors',
          'h-[104px] px-4 py-3',
          'placeholder:text-gray-500',
          'focus:bg-white focus:text-black focus:outline-none',
          'data-filled:bg-white data-filled:text-gray-700',
          'disabled:cursor-not-allowed disabled:bg-white disabled:text-gray-700',
          className,
        )}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="txt-c1-bold mt-1.5 text-red-500 lg:mt-2">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export { TextArea };
