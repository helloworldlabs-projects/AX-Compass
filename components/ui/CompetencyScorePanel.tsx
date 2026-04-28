import { ExecutiveRadarChart } from '@/components/ui/ExecutiveRadarChart';

interface CompetencyScorePanelProps {
  title: string;
  strategy: number;
  governance: number;
  adoption: number;
  dataSystem: number;
  strokeColor: string;
  variant: 'pink' | 'blue';
}

const VARIANT_CLASSES = {
  pink: {
    accent: 'text-special-pink-500',
    border: 'border-special-pink-500',
    bg: 'bg-special-pink-500/20',
  },
  blue: {
    accent: 'text-special-blue-500',
    border: 'border-special-blue-500',
    bg: 'bg-special-blue-500/20',
  },
} as const;

export function CompetencyScorePanel({
  title,
  strategy,
  governance,
  adoption,
  dataSystem,
  strokeColor,
  variant,
}: CompetencyScorePanelProps) {
  const cls = VARIANT_CLASSES[variant];

  return (
    <div className="flex min-w-[340px] flex-1 flex-col lg:min-w-[360px]">
      <div className="txt-st-bold text-center">{title}</div>
      <div className="flex flex-col gap-5">
        <div className="aspect-square w-full">
          <ExecutiveRadarChart
            strategyScore={strategy}
            governanceScore={governance}
            adoptionScore={adoption}
            dataSystemScore={dataSystem}
            strokeColor={strokeColor}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
            <div className="txt-b-bold">
              <span className={cls.accent}>* </span>전략·리더십
            </div>
            <div
              className={`${cls.border} relative h-9 w-full overflow-hidden rounded-[12px] border-3`}
              style={{ '--progress': `${strategy}%` } as React.CSSProperties}
            >
              <div className={`${cls.bg} absolute inset-y-0 left-0 h-full w-(--progress)`} />
              <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                {strategy}점
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
            <div className="txt-b-bold">
              <span className={cls.accent}>* </span>운영체계·확산
            </div>
            <div
              className={`${cls.border} relative h-9 w-full overflow-hidden rounded-[12px] border-3`}
              style={{ '--progress': `${governance}%` } as React.CSSProperties}
            >
              <div className={`${cls.bg} absolute inset-y-0 left-0 h-full w-(--progress)`} />
              <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                {governance}점
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
            <div className="txt-b-bold">
              <span className={cls.accent}>* </span>업무 적용
            </div>
            <div
              className={`${cls.border} relative h-9 w-full overflow-hidden rounded-[12px] border-3`}
              style={{ '--progress': `${adoption}%` } as React.CSSProperties}
            >
              <div className={`${cls.bg} absolute inset-y-0 left-0 h-full w-(--progress)`} />
              <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                {adoption}점
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
            <div className="txt-b-bold">
              <span className={cls.accent}>* </span>데이터·시스템 기반
            </div>
            <div
              className={`${cls.border} relative h-9 w-full overflow-hidden rounded-[12px] border-3`}
              style={{ '--progress': `${dataSystem}%` } as React.CSSProperties}
            >
              <div className={`${cls.bg} absolute inset-y-0 left-0 h-full w-(--progress)`} />
              <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                {dataSystem}점
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
