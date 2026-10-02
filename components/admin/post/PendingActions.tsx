'use client';

/**
 * 아직 백엔드가 없는 응답 관리 버튼.
 *
 * 사전검사 연결을 손으로 고치거나 잘못 들어온 응답을 집계에서 빼는 일은
 * 둘 다 DB 에 쓰는 동작이라, 다음 엔드포인트가 생겨야 움직인다.
 *
 *   POST /ops/responses/{responseId}/pre-link   { preUserId: number | null }
 *   POST /ops/responses/{responseId}/exclude    { exclude: boolean }
 *
 * 그때까지는 눌리지 않게 둔다. 눌러도 아무 일이 없으면 담당자는 처리된 줄
 * 알고 넘어간다 — 잘못 이어진 응답이 그대로 보고서에 들어가는 쪽이, 버튼이
 * 비활성인 쪽보다 훨씬 나쁘다.
 *
 * 붙일 때는 disabled 를 떼고 onClick 에 호출을 넣으면 된다.
 */
const PILL =
  'txt-c2-bold h-7 shrink-0 cursor-not-allowed rounded-full border border-gray-200 px-2.5 whitespace-nowrap text-gray-300';

export function PendingActions({ matched }: { matched: boolean }) {
  return (
    <span className="flex flex-wrap items-center justify-end gap-1.5">
      {matched && (
        <button type="button" disabled title="준비 중입니다" className={PILL}>
          연결 풀기
        </button>
      )}
      <button type="button" disabled title="준비 중입니다" className={PILL}>
        제외
      </button>
    </span>
  );
}
