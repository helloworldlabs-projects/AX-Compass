import { cn } from '@/lib/utils';

interface ShieldBadgeProps {
  children: React.ReactNode;
  className?: string;
  color: string;
  borderColor: string;
}

export const ShieldBadge = ({ children, className, color, borderColor }: ShieldBadgeProps) => {
  return (
    <div className="relative">
      <svg
        className={cn('h-[70px] w-[50px] shrink-0 lg:h-[95px] lg:w-[75px]', className)}
        viewBox="0 0 75 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1_1173_10967" fill="white">
          <path d="M0 75V12C1.06306e-06 5.37258 5.37258 0 12 0H63C69.6274 1.06302e-06 75 5.37258 75 12V75L37.5 95L0 75Z" />
        </mask>
        <path
          d="M0 75V12C1.06306e-06 5.37258 5.37258 0 12 0H63C69.6274 1.06302e-06 75 5.37258 75 12V75L37.5 95L0 75Z"
          fill={color}
        />
        <path
          d="M0 75H-2V76.2L-0.941176 76.7647L0 75ZM0 12H-2V12H0ZM63 0V-2V-2V0ZM75 75L75.9412 76.7647L77 76.2V75H75ZM37.5 95L36.5588 96.7647L37.5 97.2667L38.4412 96.7647L37.5 95ZM0 75H2V12H0H-2V75H0ZM0 12H2C2 6.47715 6.47715 2 12 2V0V-2C4.26801 -2 -2 4.26801 -2 12H0ZM12 0V2H63V0V-2H12V0ZM63 0V2C68.5229 2 73 6.47715 73 12H75H77C77 4.26801 70.732 -2 63 -2V0ZM75 12H73V75H75H77V12H75ZM75 75L74.0588 73.2353L36.5588 93.2353L37.5 95L38.4412 96.7647L75.9412 76.7647L75 75ZM37.5 95L38.4412 93.2353L0.941176 73.2353L0 75L-0.941176 76.7647L36.5588 96.7647L37.5 95Z"
          fill={borderColor}
          mask="url(#path-1-inside-1_1173_10967)"
        />
      </svg>
      <span className="txt-t3 absolute top-2 left-1/2 -translate-x-1/2 text-white lg:top-5">
        {children}
      </span>
    </div>
  );
};
