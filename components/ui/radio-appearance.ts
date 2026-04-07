/**
 * 라디오 아이템과 동일한 룩을 쓰는 UI에서 클래스를 한곳에서 맞추기 위한 문자열.
 * (실제 폼 라디오는 `radio-group`의 RadioPrimitive 조합을 그대로 둔다.)
 */

/** RadioPrimitive.Root — 레이아웃·히트 영역 등 공통 골격 */
export const radioGroupItemRootLayoutClassName =
  'relative flex aspect-square size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 lg:size-6';

/**
 * RadioPrimitive.Root — peer / data-checked 기반 선택 상태 스타일
 * (Base UI가 `data-checked`를 붙일 때의 외곽 링)
 */
export const radioGroupItemRootInteractiveClassName =
  'peer border-transparent bg-gray-100 data-checked:border-special-orange-500 data-checked:bg-white';

export const radioGroupItemIndicatorClassName = 'flex items-center justify-center';

export const radioGroupItemDotClassName =
  'bg-special-orange-500 size-3 rounded-full lg:size-4';

/** 결과 표시 등 정적 마커 — 선택됨일 때 외곽 (interactive와 시각 동일) */
export const radioMarkerOuterSelectedClassName =
  'border-special-orange-500 bg-white';

/** 결과 표시 등 정적 마커 — 미선택일 때 외곽 (interactive와 시각 동일) */
export const radioMarkerOuterUnselectedClassName =
  'border-transparent bg-gray-100';
