import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'bg-special-navy-0 relative flex w-full flex-col items-center gap-[50px] rounded-[20px] px-2.5 pt-[50px] pb-[100px] lg:gap-[75px] lg:rounded-[50px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
