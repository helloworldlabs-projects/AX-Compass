import {
  radioGroupItemDotClassName,
  radioGroupItemRootLayoutClassName,
  radioMarkerOuterSelectedClassName,
  radioMarkerOuterUnselectedClassName,
} from '@/components/ui/radio-appearance';
import { cn } from '@/lib/utils';

type ResultDotProps = {
  selected: boolean;
  className?: string;
};

/** 폼 라디오와 동일한 룩의 정적 마커(결과 표시 등). 상호작용 없음. */
function ResultDot({ selected, className }: ResultDotProps) {
  return (
    <span
      data-slot="result-dot"
      className={cn(
        radioGroupItemRootLayoutClassName,
        selected ? radioMarkerOuterSelectedClassName : radioMarkerOuterUnselectedClassName,
        className,
      )}
      aria-hidden
    >
      {selected ? <span className={radioGroupItemDotClassName} /> : null}
    </span>
  );
}

export { ResultDot, type ResultDotProps };
