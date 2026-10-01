import type { Metadata } from 'next';

import './admin.css';

export const metadata: Metadata = {
  title: 'AX Compass 사후검사 관리자',
  robots: { index: false, follow: false },
};

/** 운영 관리자 최상위 틀. (main) 바깥이라 공개 사이트 Header/Footer 가 붙지 않는다. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root min-h-screen flex-1 bg-gray-0 text-gray-700">{children}</div>
  );
}
