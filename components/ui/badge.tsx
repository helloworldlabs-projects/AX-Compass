import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] px-1.5 py-0.5 txt-c2-bold text-white',
  {
    variants: {
      variant: {
        beginner: 'bg-special-orange-500',
        elementary: 'bg-special-orange-600',
        intermediate: 'bg-special-orange-700',
        advanced: 'bg-special-orange-800',
        main: 'bg-special-navy-400',
        extended: 'bg-special-navy-700',
        supplementary: 'bg-special-navy-200',
      },
    },
  },
);

function Badge({
  className,
  variant,
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge, badgeVariants };
