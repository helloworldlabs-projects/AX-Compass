'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';

import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1', className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('txt-b-regular flex min-w-0 flex-1 text-left text-gray-900', className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = 'default',
  variant = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: 'sm' | 'default';
  /** searchable `ASelect` 필드와 동일한 시각 스타일 */
  variant?: 'default' | 'field';
}) {
  if (variant === 'field') {
    return (
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-variant="field"
        className={cn(
          'group relative flex h-[41px] w-full min-w-0 items-center justify-start rounded-[12px] border-2 border-solid border-transparent py-4 pr-12 pl-4 lg:h-[54px] lg:rounded-[14px]',
          'txt-b-regular shadow-elevation text-gray-700',
          'ring-0 transition-colors outline-none select-none focus:outline-none',
          'data-popup-open:border-special-dark-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:truncate *:data-[slot=select-value]:text-left',
          /* 트리거 색이 자식에 안 묻는 경우·placeholder 상태 대비 */
          '[&_[data-slot=select-value]]:text-gray-900 [&_[data-slot=select-value][data-placeholder]]:text-gray-500',
          className,
        )}
        {...props}
      >
        {children}
        <span
          className="group-data-[popup-open]:bg-special-dark-blue-100 group-data-[popup-open]:text-special-dark-blue-500 group-data-[popup-open]:hover:bg-special-dark-blue-100 pointer-events-none absolute top-1/2 right-4 flex h-[21px] w-[21px] -translate-y-1/2 items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200 lg:h-7 lg:w-7"
          aria-hidden
        >
          <ChevronDownIcon className="size-[21px] group-data-[popup-open]:hidden lg:size-7" />
          <ChevronUpIcon className="hidden size-[21px] group-data-[popup-open]:block lg:size-7" />
        </span>
      </SelectPrimitive.Trigger>
    );
  }

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // layout & base
        'group flex w-fit min-w-0 items-center justify-between gap-2 bg-white px-4',
        'text-base font-normal whitespace-nowrap text-neutral-800',
        // shape & shadow
        'shadow-elevation rounded-2xl',
        // outline (not border) — matches spec: outline outline-2 outline-offset-[-2px] outline-gray-700
        'outline outline-2 -outline-offset-2 outline-gray-700',
        // states
        'transition-colors select-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-placeholder:text-neutral-400',
        // size variants
        'data-[size=default]:h-14',
        'data-[size=sm]:h-9 data-[size=sm]:rounded-xl data-[size=sm]:px-3',
        // value slot
        '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center',
        className,
      )}
      {...props}
    >
      {children}
      {/* arrow box — size-7 bg-slate-200 rounded-sm */}
      <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-slate-200">
        <ChevronUpIcon className="pointer-events-none size-3.5 text-gray-700 transition-transform duration-200 group-data-[popup-open]:rotate-180" />
      </div>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = true,
  variant = 'default',
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  > & {
    variant?: 'default' | 'field';
  }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-variant={variant}
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            'text-foreground bg-white',
            variant === 'field' && 'shadow-elevation max-h-60 rounded-[12px] lg:rounded-[14px]',
            variant === 'default' && [
              // animations
              'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2',
              'data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
              'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
              'shadow-elevation rounded-2xl',
            ],
            // layout
            'relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36',
            'origin-(--transform-origin) overflow-hidden',
            'duration-100 data-[align-trigger=true]:animate-none',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('text-muted-foreground px-4 py-1 text-xs', className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  variant = 'default',
  ...props
}: SelectPrimitive.Item.Props & {
  variant?: 'default' | 'field';
}) {
  if (variant === 'field') {
    return (
      <SelectPrimitive.Item
        data-slot="select-item"
        className={cn(
          'group/item relative flex h-[30px] w-full cursor-pointer items-center justify-center border-b border-gray-100 px-4 py-3 text-gray-500 outline-hidden transition-colors select-none lg:h-[35px]',
          'data-[highlighted]:bg-special-dark-blue-100 data-[selected]:bg-special-dark-blue-100',
          'data-disabled:pointer-events-none data-disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ItemText className="txt-c1-regular group-data-[highlighted]/item:txt-c1-bold group-data-[selected]/item:txt-c1-bold w-full text-center">
          {children}
        </SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="hidden" />
      </SelectPrimitive.Item>
    );
  }

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // layout: h-9, full width, centered
        'group/item relative flex h-9 w-full cursor-default items-center',
        // bg: white by default, slate-200 when selected
        'bg-white data-[selected]:bg-slate-200',
        // states
        'outline-hidden select-none',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {/* inner wrapper with border-b, centered content */}
      <div className="flex flex-1 flex-col items-center justify-center self-stretch overflow-hidden border-b border-neutral-200">
        <SelectPrimitive.ItemText
          className={cn(
            'text-sm whitespace-nowrap text-black/20',
            // normal: font-normal; selected: font-bold (via group)
            'font-normal group-data-[selected]/item:font-bold',
          )}
        >
          {children}
        </SelectPrimitive.ItemText>
      </div>
      {/* hide checkmark indicator */}
      <SelectPrimitive.ItemIndicator className="hidden" />
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-white py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-white py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
