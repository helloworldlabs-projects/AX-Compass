'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import ResultSearchButton from './ResultSearchButton';
import InstitutionLoginButton from './InstitutionLoginButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-special-dark-blue-900 sticky top-0 z-50 w-full">
      <div className="mx-auto px-[30px] py-[15px] lg:px-[50px]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex cursor-pointer items-center justify-start">
            <Image
              src="/images/logo/img_logo.png"
              width={162}
              height={36}
              alt=""
              className="h-[24px] w-[108px] lg:h-[36px] lg:w-[162px]"
              priority
            />
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/assessment" className="flex items-center gap-1.5 text-white">
              <span className="txt-b-bold">검사 시작</span>
            </Link>
            <Link href="/about" className="flex items-center gap-1.5 text-white">
              <span className="txt-b-bold">검사 소개</span>
            </Link>
            <Link href="/pricing" className="flex items-center gap-1.5 text-white">
              <span className="txt-b-bold">이용 요금</span>
            </Link>
            <ResultSearchButton />
            <InstitutionLoginButton />
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`size-6 transition-colors lg:hidden ${isMenuOpen ? 'text-purple-500' : 'text-white'}`}
            aria-label="메뉴 열기"
          >
            <Menu className="size-6 group-hover:text-purple-500" />
          </button>
        </div>

        {/* 모바일 네비게이션 메뉴 */}
        {isMenuOpen && (
          <nav className="border-t border-white/5 pt-[14.5px] lg:hidden">
            <div className="flex items-center justify-end gap-4">
              <Link href="/assessment" className="flex items-center gap-1.5 text-white">
                <span className="txt-b-bold">검사 시작</span>
              </Link>
              <Link href="/about" className="flex items-center text-white">
                <span className="txt-b-bold">검사 소개</span>
              </Link>
              <Link href="/pricing" className="flex items-center gap-1.5 text-white">
                <span className="txt-b-bold">이용 요금</span>
              </Link>
              <ResultSearchButton />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
