'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';

import { useOpsLogout } from '@/hooks/useOpsAuth';
import { cn } from '@/lib/utils';

const GROUPS: { label?: string; items: { href: string; name: string }[] }[] = [
  { items: [{ href: '/admin', name: '운영 대시보드' }] },
  { label: '사후검사 운영', items: [{ href: '/admin/sessions', name: '사후검사 발송' }] },
  {
    label: '분석 · 산출',
    items: [
      { href: '/admin/satisfaction', name: '교육 만족도 연동' },
      { href: '/admin/pre', name: '사전검사 연동' },
      { href: '/admin/post', name: '사후검사 조회' },
      { href: '/admin/reports', name: '기업 보고서' },
    ],
  },
  {
    label: '설정',
    items: [{ href: '/admin/instruments', name: '사후 검사 문항' }],
  },
];

/** PC 에서는 왼쪽에 고정, 모바일에서는 상단 바 + 펼침 메뉴. */
export function Sidebar() {
  const pathname = usePathname();
  const logout = useOpsLogout();
  const [open, setOpen] = useState(false);

  return (
    <aside className="no-print sticky top-0 z-40 flex w-full shrink-0 flex-col border-b border-gray-100 bg-white lg:h-screen lg:w-[264px] lg:border-r lg:border-b-0">
      <div className="flex h-16 items-center gap-2 px-5 lg:h-[76px] lg:px-6">
        <Image
          src="/images/report/logo_axcompass_black.png"
          alt="AX Compass"
          width={210}
          height={24}
          preload
          className="h-6 w-auto"
        />
        <span className="txt-c2-bold bg-green-0 rounded-full px-2 py-0.5 text-green-700">
          ADMIN
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-nav"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          className="hover:bg-adm-line-soft ml-auto flex size-10 items-center justify-center rounded-full text-gray-700 lg:hidden"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      <div
        id="admin-nav"
        className={cn(
          'max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto lg:flex lg:max-h-none lg:flex-1 lg:overflow-hidden',
          open ? 'flex' : 'hidden',
        )}
      >
        <nav aria-label="관리자 메뉴" className="flex-1 px-4 pt-2 pb-8 lg:overflow-y-auto">
          {GROUPS.map((group, i) => (
            <div key={group.label ?? i} className="mb-6">
              {group.label && (
                <p className="txt-c2-bold px-3 pb-2 tracking-wide text-gray-500">{group.label}</p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                  const dot = (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'size-1.5 rounded-full',
                        active ? 'bg-adm-brand' : 'bg-gray-400',
                      )}
                    />
                  );
                  const shape =
                    'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 transition-colors duration-200';

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          shape,
                          active
                            ? 'txt-c1-bold bg-special-blue-100 text-adm-brand'
                            : 'txt-c1-regular hover:bg-adm-line-soft text-gray-900',
                        )}
                      >
                        {dot}
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* 로그아웃 — 계정 정보는 SafariOn 에서 관리한다. */}
        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={logout}
            className="txt-c1-regular hover:bg-adm-line-soft flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-gray-500 transition-colors duration-200 hover:text-red-600"
          >
            <LogOut className="size-[18px]" aria-hidden />
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
}
