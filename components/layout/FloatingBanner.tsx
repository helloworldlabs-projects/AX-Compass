'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  PanelRightOpen,
  PanelRightClose,
  CircleCheck,
  PanelTopCloseIcon,
  PanelBottomClose,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const BannerContent = ({ onClose }: { onClose: () => void }) => (
  <div className="relative z-10 flex flex-col gap-3">
    {/* Card 1 */}
    <div className="flex flex-col gap-4 rounded-[12px] border border-purple-700 bg-black/20 px-5 py-4">
      <div className="flex flex-col gap-2">
        <div className="txt-st-bold text-white">
          AX 역량 검사 <span className="text-special-pink-600">무료</span> 제공
        </div>
        <p className="txt-c1-regular text-white">
          역량 검사 후 교육 컨설팅까지{' '}
          <span className="text-special-pink-600 font-semibold">모두 무료로</span> 받아보세요.
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-full border border-purple-200 px-2 py-1">
            <CircleCheck className="size-4 text-purple-200" strokeWidth={3} />
            <span className="txt-c2-bold text-white">결과 즉시 확인</span>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-purple-200 px-2 py-1">
            <CircleCheck className="size-4 text-purple-200" strokeWidth={3} />
            <span className="txt-c2-bold text-white">교육 컨설팅 연계</span>
          </div>
        </div>
      </div>
      <Button
        render={<Link href="/assessment" />}
        variant="purple"
        className="txt-b-bold h-[40px] w-fit lg:h-[60px]"
        onClick={onClose}
      >
        AX 역량 검사 시작 →
      </Button>
    </div>

    {/* Card 2 */}
    <div className="relative flex flex-col gap-4 rounded-[12px] border border-purple-700 bg-black/20 px-5 py-4">
      <div className="flex flex-col gap-2">
        <div className="txt-st-bold text-white">
          최대 <span className="text-special-pink-600">95% 환급</span> AX 교육 제공
        </div>
        <p className="txt-c1-regular text-white">환급 가능한 AX 교육 과정을 확인해 보세요.</p>
        <div className="flex flex-wrap gap-2">
          <div className="border-special-dark-blue-200 flex items-center gap-1 rounded-full border px-2 py-1">
            <CircleCheck className="text-special-dark-blue-200 size-4" strokeWidth={3} />
            <span className="txt-c2-bold text-white">기업 맞춤 설계</span>
          </div>
          <div className="border-special-dark-blue-200 flex items-center gap-1 rounded-full border px-2 py-1">
            <CircleCheck className="text-special-dark-blue-200 size-4" strokeWidth={3} />
            <span className="txt-c2-bold text-white">환급 과정 안내</span>
          </div>
        </div>
      </div>
      <Button
        render={
          <Link href="https://ax.helloworldlabs.kr" target="_blank" rel="noopener noreferrer" />
        }
        variant="dark-blue"
        className="txt-b-bold h-[40px] w-fit lg:h-[60px]"
        onClick={onClose}
      >
        AX 혁신 센터 확인 →
      </Button>

      <div className="absolute right-2.5 bottom-2.5 h-[100px] w-[78px] rotate-[-5deg] opacity-90">
        <Image src="/images/img_sidebanner.png" fill alt="" priority />
      </div>
    </div>
  </div>
);

export default function FloatingBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const id = setTimeout(() => setIsOpen(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !desktopRef.current?.contains(e.target as Node) &&
        !mobileRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div ref={desktopRef} className="hidden pr-5 lg:flex">
        {isOpen ? (
          <div className="relative flex h-[500px] w-[360px] flex-col gap-3 overflow-hidden rounded-[20px] border-2 border-white p-4 shadow">
            <Image src="/images/img_bg_sidebanner.png" alt="" fill className="absolute inset-0 object-cover" />
            <div className="relative z-10 flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="relative h-[20px] w-[90px]">
                  <Image
                    src="/images/logo/img_logo.png"
                    fill
                    alt=""
                    className="h-[26px] w-auto brightness-0 invert"
                    priority
                  />
                </div>
                <span className="txt-c2-bold text-purple-200">진단부터 교육까지</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="size-7 text-white">
                <PanelRightClose className="size-7 text-white" />
              </button>
            </div>

            <BannerContent onClose={() => setIsOpen(false)} />
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex h-[500px] w-[60px] flex-col items-center gap-6 overflow-hidden rounded-[20px] border-2 border-white px-2.5 py-4 shadow"
          >
            <Image src="/images/img_bg_sidebanner.png" alt="" fill className="absolute inset-0 object-cover object-right-top" />
            <PanelRightOpen className="relative z-10 size-7 text-white" />
            <div className="border-special-dark-blue-700 txt-st2-bold relative z-10 flex h-[416px] w-[40px] flex-col items-center justify-center rounded-[12px] border bg-black/20 text-white">
              <span>최</span>
              <span>대</span>
              <span className="text-[#FF2366]">9</span>
              <span className="text-[#FF2366]">5</span>
              <span className="text-[#FF2366]">%</span>
              <span className="text-[#FF2366]">환</span>
              <span className="text-[#FF2366]">급</span>
              <span>A</span>
              <span>X</span>
              <span>교</span>
              <span>육</span>
              <span>제</span>
              <span>공</span>
            </div>
          </button>
        )}
      </div>

      <div ref={mobileRef} className="flex w-full lg:hidden">
        {isOpen ? (
          <div className="relative flex w-full flex-col gap-3 overflow-hidden rounded-[20px] border-2 border-white p-4 shadow">
            <Image src="/images/img_bg_sidebanner.png" alt="" fill className="absolute inset-0 object-cover" />
            <div className="relative z-10 flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="relative h-[16px] w-[70px]">
                  <Image
                    src="/images/logo/img_logo.png"
                    fill
                    alt=""
                    className="h-[26px] w-auto brightness-0 invert"
                    priority
                  />
                </div>
                <span className="txt-c2-bold text-purple-200">진단부터 교육까지</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="size-7 text-white">
                <PanelBottomClose className="size-7 text-white" />
              </button>
            </div>

            <BannerContent onClose={() => setIsOpen(false)} />
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-[20px] border-2 border-white px-2.5 py-4 shadow"
          >
            <Image src="/images/img_bg_sidebanner.png" alt="" fill className="absolute inset-0 object-cover object-right-top" />
            <span className="border-special-dark-blue-700 txt-st2-bold relative z-10 flex h-[40px] w-full items-center justify-center gap-1.5 rounded-[12px] border bg-black/20 text-white">
              최대 <span className="text-special-pink-600">95% 환급</span> AX 교육 확인
            </span>
            <PanelTopCloseIcon className="relative z-10 size-7 text-white" />
          </button>
        )}
      </div>
    </>
  );
}
