'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { LoginForm } from '@/components/admin/LoginForm';
import { useOpsToken } from '@/hooks/useOpsToken';

/**
 * 관리자 로그인. (guarded) 바깥이라 사이드바가 붙지 않는다.
 * 이미 토큰이 있으면 관리자 화면으로 보낸다(토큰이 죽었으면 가드가 다시 로그인 길을 준다).
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const token = useOpsToken();

  useEffect(() => {
    if (token) router.replace('/admin');
  }, [token, router]);

  return (
    <div className="min-h-screen bg-white">
      <div className="grid lg:min-h-[900px] lg:grid-cols-2">
        {/* 왼쪽 — 브랜드 영역 */}
        <section className="bg-special-blue-900 relative overflow-hidden px-6 py-12 text-white lg:px-12 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 -right-24 size-[420px] rounded-full bg-purple-500 opacity-45 blur-[90px]"
          />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3">
              <Image
                src="/images/report/logo_axcompass_black.png"
                alt="AX Compass"
                width={210}
                height={24}
                preload
                className="h-6 w-auto invert"
              />
              <span className="txt-c2-bold bg-adm-point/20 text-adm-point rounded-full px-3 py-1">
                ADMIN
              </span>
            </div>

            <div className="mt-auto pt-12 lg:pt-20">
              <p className="txt-c1-bold text-purple-300">사후검사 관리자</p>
              <h2 className="txt-t2 mt-3">
                교육 전과 후,
                <br />
                무엇이 달라졌는지
              </h2>
              <p className="txt-c1-regular text-special-navy-200 mt-5">
                사후검사 진행부터 사전 결과와의 비교, 기업 보고서까지
                <br />한 곳에서 관리합니다.
              </p>
              <p className="txt-c1-regular text-special-navy-200 mt-3">
                계속하려면 SafariOn 관리자 계정으로 로그인해 주세요.
              </p>
            </div>

            <p className="txt-c2-regular text-special-navy-200 mt-12 lg:mt-16">
              Copyright 2026. HelloworldLabs · AX Compass 사후검사 관리자
            </p>
          </div>
        </section>

        {/* 오른쪽 — 로그인 폼 */}
        <section className="bg-special-blue-0 flex items-center justify-center px-6 py-16 lg:px-12">
          <Suspense>
            <LoginForm />
          </Suspense>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    // <div className="border-t border-gray-100 bg-white px-6 py-14 lg:px-12">
    //   <div className="mx-auto max-w-[1200px]">
    //     <nav aria-label="약관" className="flex items-center gap-4">
    //       <a href="#" className="txt-c1-regular text-gray-700 underline underline-offset-4">
    //         이용약관
    //       </a>
    //       <span aria-hidden="true" className="text-gray-200">
    //         |
    //       </span>
    //       <a href="#" className="txt-c1-regular text-gray-700 underline underline-offset-4">
    //         개인정보처리방침
    //       </a>
    //     </nav>

    //     <div className="txt-c1-regular mt-6 space-y-1 text-gray-500">
    //       <p className="txt-c1-bold text-gray-900">(주)헬로월드랩스</p>
    //       <p>대표 ｜ 김진호</p>
    //       <p>문의 ｜ MAIL : contact@helloworldlabs.kr</p>
    //       <p>전화 ｜ 070-8833-7771</p>
    //       <p>경기도 안양시 동안구 학의로 282 (관양동) 금강펜테리움 IT타워 A동 708호</p>
    //     </div>
    //   </div>
    // </div>
    <footer className="border-line bg-surface border-t px-6 py-14 sm:px-12">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <nav className="flex items-center gap-4">
            <a href="#" className="text-c1 text-body underline underline-offset-4">
              이용약관
            </a>
            <span aria-hidden="true" className="text-g-200">
              |
            </span>
            <a href="#" className="text-c1 text-body underline underline-offset-4">
              개인정보처리방침
            </a>
          </nav>

          <div className="text-c1 text-subtext mt-6 space-y-1">
            <p className="text-ink font-bold">(주)헬로월드랩스</p>
            <p>대표 ｜ 김진호</p>
            <p>문의 ｜ MAIL : contact@helloworldlabs.kr</p>
            <p>전화 ｜ 070-8833-7771</p>
            <p>경기도 안양시 동안구 학의로 282 (관양동) 금강펜테리움 IT타워 A동 708호</p>
          </div>
        </div>

        {/* 회사 로고. 원본 비율 10:1 이라 가로가 길다.
            좁은 화면에서는 폭에 맞춰 줄어들게 둔다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/admin/company-logo.svg"
          alt="HelloworldLabs"
          className="h-[30px] w-auto max-w-full self-start lg:mt-10"
        />
      </div>
    </footer>
  );
}
