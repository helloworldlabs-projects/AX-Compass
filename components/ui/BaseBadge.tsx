interface BaseBadgeProps {
  stars: number; // 0 ~ 2
  bars: number; // 1 ~ 4
  label: string;
}

export const BaseBadge = ({ stars, bars, label }: BaseBadgeProps) => {
  return (
    <div className="flex w-16 flex-col items-center">
      {/* 별 영역 */}
      <div className="mb-1 flex h-8 justify-center">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={`star-${i}`} className="text-2xl text-purple-700">
            ★
          </span>
          // 실제 환경에서는 SVG 아이콘 컴포넌트 사용 권장
        ))}
      </div>

      {/* 스택 바 영역 */}
      <div className="mb-1 flex w-full flex-col-reverse gap-0.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`bar-${i}`}
            className={`h-2 w-full rounded-full ${i < bars ? 'bg-purple-500' : 'bg-transparent'}`}
            // 투명한 바를 깔아두어 높이를 고정시킬 수도 있고, 조건부 렌더링을 할 수도 있습니다.
          />
        ))}
      </div>

      {/* 라벨 영역 */}
      <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-bold text-white">
        {label}
      </span>
    </div>
  );
};
