'use client';

import { ChevronUp, Printer, Send } from 'lucide-react';
import { InquiryModal } from '../modals/InquiryModal';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import FloatingBanner from './FloatingBanner';

function ScrollTopButton({ handleClick }: { handleClick: () => void }) {
  return (
    <button
      className="flex size-[50px] cursor-pointer items-center justify-center rounded-[30px] bg-purple-900 shadow transition-colors duration-200 hover:bg-purple-700 lg:size-[60px]"
      onClick={handleClick}
    >
      <ChevronUp className="size-8 text-white lg:size-9" />
    </button>
  );
}

function InquiryButton({ handleClick }: { handleClick: () => void }) {
  return (
    <button className="group flex cursor-pointer flex-col items-center gap-1" onClick={handleClick}>
      <div className="flex size-[50px] items-center justify-center rounded-[30px] bg-purple-900 shadow transition-colors duration-200 group-hover:bg-purple-700 lg:size-[60px]">
        <Send className="size-8 text-white lg:size-9" />
      </div>
      <p className="txt-c1-bold rounded-[15px] bg-purple-200 px-1 text-purple-900 shadow lg:px-1.5">
        문의하기
      </p>
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
      className="group flex cursor-pointer flex-col items-center gap-1"
      onClick={handlePrint}
      disabled={preparing}
    >
      <div className="bg-special-pink-600 group-hover:bg-special-pink-400 flex h-[120px] w-[50px] items-center justify-center rounded-[30px] shadow transition-colors duration-200 lg:w-[60px]">
        {preparing ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Printer className="size-8 text-white lg:size-9" />
        )}
      </div>
      <p className="txt-c1-bold bg-special-pink-200 rounded-[15px] px-1 text-purple-900 shadow lg:px-1.5">
        {preparing ? '준비 중...' : '복사·저장'}
      </p>
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
        <div className="pointer-events-auto mb-5 ml-auto flex flex-col gap-4 pr-2.5 lg:ml-0 lg:gap-6 lg:pr-5">
          {showScrollAndInquiry && (
            <ScrollTopButton handleClick={() => window.scrollTo({ top: 0 })} />
          )}
          {showScrollAndInquiry && <InquiryButton handleClick={() => setOpen(true)} />}
          {showPrintAndDownload && <PrintAndDownloadButton />}
        </div>
      </div>

      <InquiryModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
