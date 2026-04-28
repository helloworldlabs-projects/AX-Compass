'use client';

import { useId } from 'react';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';

import {
  radioGroupItemDotClassName,
  radioGroupItemIndicatorClassName,
  radioGroupItemRootInteractiveClassName,
  radioGroupItemRootLayoutClassName,
} from '@/components/ui/radio-appearance';
import { cn } from '@/lib/utils';

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('grid w-full gap-2', className)}
      {...props}
    />
  );
}

interface RadioGroupItemProps extends RadioPrimitive.Root.Props {
  label?: string;
  labelClassName?: string;
}

function RadioGroupItem({ className, label, id, labelClassName, ...props }: RadioGroupItemProps) {
  const generatedId = useId();
  const resolvedId = id ?? generatedId;

  const radio = (
    <RadioPrimitive.Root
      id={resolvedId}
      data-slot="radio-group-item"
      className={cn(
        radioGroupItemRootLayoutClassName,
        radioGroupItemRootInteractiveClassName,
        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={radioGroupItemIndicatorClassName}
      >
        <span className={radioGroupItemDotClassName} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );

  if (!label) return radio;

  return (
    <div className={cn('flex items-center gap-3', labelClassName)}>
      {radio}
      <label
        htmlFor={resolvedId}
        className={cn(
          'txt-c1-bold cursor-pointer text-gray-500',
          props.disabled && 'cursor-not-allowed',
        )}
      >
        {label}
      </label>
    </div>
  );
}

export { RadioGroup, RadioGroupItem };
