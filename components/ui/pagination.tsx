import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex items-center gap-2.5', className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<'a'>;

function PaginationLink({ className, isActive, children, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'txt-b-bold inline-flex h-[50px] min-w-[50px] items-center justify-center rounded-[12px] shadow transition-colors',
        'bg-gray-0 text-gray-700',
        isActive && 'bg-special-dark-blue-500 text-white',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

function PaginationPrevious(props: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" className="px-0" {...props}>
      <ChevronLeft className="size-4" />
    </PaginationLink>
  );
}

function PaginationNext(props: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" className="px-0" {...props}>
      <ChevronRight className="size-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] bg-white text-gray-500',
        className,
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
