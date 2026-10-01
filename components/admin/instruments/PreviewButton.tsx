'use client';

const PREVIEW_PATH = '/after/preview';

/**
 * 검사 미리보기를 별도 창으로 띄운다 — 문항 목록과 실제 화면을 나란히 비교하려고.
 * 같은 창 이름을 써서 여러 번 눌러도 창이 늘어나지 않는다.
 */
export function PreviewButton() {
  function open() {
    const w = 1180;
    const h = 900;
    const left = Math.max(0, Math.round((window.screen.availWidth - w) / 2));
    const top = Math.max(0, Math.round((window.screen.availHeight - h) / 2));

    // features 에 noopener 를 넣으면 window.open 이 항상 null 을 돌려줘 팝업 차단과 구분되지 않는다.
    // 그래서 열고 나서 opener 를 끊는다.
    const opened = window.open(
      PREVIEW_PATH,
      'ax-exam-preview',
      `width=${w},height=${h},left=${left},top=${top}`,
    );
    if (opened) opened.opener = null;
    // 팝업이 막힌 경우에는 새 탭으로 연다.
    else window.open(PREVIEW_PATH, '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      type="button"
      onClick={open}
      className="txt-c1-bold hover:bg-gray-0 focus-visible:outline-adm-brand h-11 shrink-0 rounded-[10px] border border-gray-100 bg-white px-5 text-gray-900 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      검사 미리보기
    </button>
  );
}
