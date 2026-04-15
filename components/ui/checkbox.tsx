'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  label?: string | React.ReactNode;
  labelClassName?: string;
}

function Checkbox({ className, label, id, labelClassName, ...props }: CheckboxProps) {
  const checkbox = (
    <CheckboxPrimitive.Root
      id={id}
      data-slot="checkbox"
      className={cn(
        'peer data-checked:border-special-orange-500 data-checked:text-special-orange-500 relative flex size-6 shrink-0 items-center justify-center rounded-[4px] border border-transparent bg-gray-100 transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-checked:bg-white lg:size-7',
        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-4 lg:[&>svg]:size-5"
      >
        <CheckIcon className="size-4 lg:size-5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) return checkbox;

  return (
    <div className={cn('flex items-center gap-3', labelClassName)}>
      {checkbox}
      <label
        htmlFor={id}
        className={cn(
          'txt-c1-bold cursor-pointer text-gray-500',
          props.disabled && 'cursor-not-allowed',
        )}
      >
        {typeof label === 'string' ? <span className="text-gray-500">{label}</span> : label}
      </label>
    </div>
  );
}

export { Checkbox };
