import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function Section({ children, className, ...props }: SectionProps) {
  return (
    <div
      className={cn('relative flex w-full flex-col items-center gap-[50px] py-[50px]', className)}
      {...props}
    >
      {children}
    </div>
  );
}
