'use client';

import { ChevronUp, Mail, Printer, Send } from 'lucide-react';
import { InquiryModal } from '../modals/InquiryModal';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import FloatingBanner from './FloatingBanner';

function ScrollTopButton({ handleClick }: { handleClick: () => void }) {
  return (
    <button
      className="flex h-[32px] w-[80px] cursor-pointer items-center justify-center rounded-[30px] bg-purple-900 shadow transition-colors duration-200 hover:bg-purple-700"
      onClick={handleClick}
    >
      <ChevronUp className="size-4 text-white" strokeWidth={3} />
    </button>
  );
}

function InquiryButton({ handleClick }: { handleClick: () => void }) {
  return (
    <button className="group flex cursor-pointer flex-col items-center" onClick={handleClick}>
      <div className="flex h-[32px] w-[80px] items-center justify-center gap-1 rounded-[30px] bg-purple-900 shadow transition-colors duration-200 group-hover:bg-purple-700">
        <Mail className="size-4 text-white" strokeWidth={3} />
        <span className="txt-c1-bold text-white">문의</span>
      </div>
    </button>
  );
}

function PrintAndDownloadButton() {
  const [preparing, setPreparing] = useState(false);

  const handlePrint = async () => {
    if (document.querySelectorAll('[data-chart-capturing]').length === 0) {
      window.print();
      return;
    }
    setPreparing(true);
    const deadline = Date.now() + 5_000;
    await new Promise<void>((resolve) => {
      const check = () => {
        if (
          document.querySelectorAll('[data-chart-capturing]').length === 0 ||
          Date.now() >= deadline
        ) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      setTimeout(check, 100);
    });
    setPreparing(false);
    window.print();
  };

  return (
    <button
      className="group hidden cursor-pointer flex-col items-center gap-1 lg:flex"
      onClick={handlePrint}
      disabled={preparing}
    >
      <div className="bg-special-pink-600 group-hover:bg-special-pink-400 flex h-[32px] w-[80px] items-center justify-center gap-1 rounded-[30px] shadow transition-colors duration-200">
        {preparing ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Printer className="size-4 text-white" strokeWidth={3} />
            <span className="txt-c1-bold text-white">프린트</span>
          </>
        )}
      </div>
    </button>
  );
}

const KAKAO_CHANNEL_ID = '_hJJnX';

function KaKaoChannelButton() {
  function handleClick() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kakao = (window as any).Kakao;
    if (kakao) {
      if (!kakao.isInitialized()) {
        kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
      }
      kakao.Channel.chat({ channelPublicId: KAKAO_CHANNEL_ID });
    } else {
      window.open(`http://pf.kakao.com/${KAKAO_CHANNEL_ID}/chat`, '_blank');
    }
  }

  return (
    <button
      className="group flex cursor-pointer flex-col items-center gap-1"
      onClick={handleClick}
    >
      <div className="flex h-[32px] w-[80px] items-center justify-center gap-0.5 rounded-[30px] bg-yellow-500 shadow transition-colors duration-200 group-hover:bg-yellow-300 lg:gap-1">
        <svg className="size-4" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.88281 0C9.13165 0 11.7656 1.97546 11.7656 4.41211C11.7655 6.84869 9.13158 8.82422 5.88281 8.82422C5.6064 8.82422 5.33462 8.80794 5.06836 8.78027L1.96094 11.1113L2.70703 8.125C1.07922 7.34031 7.23263e-05 5.97121 0 4.41211C0 1.97546 2.63398 1.20803e-08 5.88281 0Z"
            fill="#151515"
          />
        </svg>
        <span className="txt-c1-bold text-gray-900">시작하기</span>
      </div>
    </button>
  );
}

const EXACT_PAGES = ['/', '/assessment', '/about', '/institution'];

export function Floating() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isExact = EXACT_PAGES.includes(pathname);
  const isResult = pathname.startsWith('/result');

  const showScrollAndInquiry = isExact || isResult;
  const showPrintAndDownload = isResult || pathname === '/institution';
  const showBanner = pathname === '/' || pathname === '/assessment' || pathname === '/about';

  if (!showScrollAndInquiry && !showPrintAndDownload && !showBanner) return null;

  return (
    <>
      <div
        data-print-hidden
        className="pointer-events-none fixed right-0 bottom-0 left-0 z-50 flex flex-wrap-reverse items-start justify-between lg:left-auto lg:flex-col lg:flex-nowrap lg:items-end lg:gap-6"
      >
        {showBanner && (
          <div className="pointer-events-auto w-[450px] max-w-full lg:w-auto lg:max-w-none">
            <FloatingBanner />
          </div>
        )}
        <div className="pointer-events-auto mb-5 ml-auto flex flex-col gap-3 pr-2.5 lg:ml-0 lg:gap-4">
          {showScrollAndInquiry && (
            <ScrollTopButton handleClick={() => window.scrollTo({ top: 0 })} />
          )}
          {showScrollAndInquiry && <KaKaoChannelButton />}
          {showScrollAndInquiry && <InquiryButton handleClick={() => setOpen(true)} />}
          {showPrintAndDownload && <PrintAndDownloadButton />}
        </div>
      </div>

      <InquiryModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
