'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[12px] border-2 border-transparent bg-clip-padding txt-b-bold whitespace-nowrap transition-all outline-none select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 shadow",
  {
    variants: {
      variant: {
        navy: 'bg-special-navy-500 text-white hover:bg-special-navy-300 border-special-navy-100  transition-colors duration-200',
        gray: 'bg-gray-500 text-white hover:bg-gray-300 border-gray-100  transition-colors duration-200',
        'dark-blue':
          'bg-special-dark-blue-500 text-white hover:bg-special-dark-blue-300 border-special-dark-blue-100  transition-colors duration-200',
        purple:
          'bg-purple-800 text-white hover:bg-purple-600 border-purple-100  transition-colors duration-200',
        pink: 'bg-special-pink-600 text-white hover:bg-special-pink-400 border-special-pink-100 transition-colors duration-200',
      },
      size: {
        default: 'h-[60px] gap-2 px-6',
        icon: 'size-6 rounded-[4px]',
        pill: 'h-10 gap-2 px-5 rounded-[30px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'navy',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
