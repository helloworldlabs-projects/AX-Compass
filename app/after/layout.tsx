import type { Metadata } from 'next';

import '../admin/admin.css';

export const metadata: Metadata = {
  title: 'AX Compass 사후검사',
  robots: { index: false, follow: false },
};

/** 공개 응시 화면 틀. (main) 바깥이라 공개 사이트 Header/Footer 가 붙지 않는다. 관리자 토큰·스타일(.admin-root)을 같이 쓴다. */
export default function AfterLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root bg-gray-0 min-h-screen flex-1 text-gray-700">{children}</div>;
}
