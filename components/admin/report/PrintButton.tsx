'use client';

import { Button } from '@/components/admin/ui';

/**
 * 인쇄(PDF 저장).
 *
 * 따로 PDF 엔진을 두지 않는다. 화면이 곧 인쇄본이고, 브라우저의 인쇄에서
 * "PDF 로 저장"을 고르면 된다. 장마다 쪽이 나뉘고 사이드바와 버튼은
 * 빠지도록 인쇄용 규칙을 걸어 두었다(app/admin/admin.css).
 */
export function PrintButton() {
  return <Button onClick={() => window.print()}>인쇄 · PDF 저장</Button>;
}
