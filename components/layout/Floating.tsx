'use client';

import { ChevronUp, Printer, Send, SquarePen } from 'lucide-react';
import { InquiryModal } from '../modals/InquiryModal';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

function ExamStartButton() {
  return (
    <Link
      href="/assessment"
      className="group hidden cursor-pointer flex-col items-center gap-1 lg:flex"
    >
      <div className="bg-special-pink-600 group-hover:bg-special-pink-400 flex h-[120px] w-[50px] items-center justify-center rounded-[30px] shadow transition-colors duration-200 lg:w-[60px]">
        <SquarePen className="size-8 text-white lg:size-9" />
      </div>
      <p className="txt-c1-bold bg-special-pink-200 rounded-[15px] px-1 text-purple-900 shadow lg:px-1.5">
        검사시작
      </p>
    </Link>
  );
}

function PrintAndDownloadButton() {
  return (
    <button
      className="group flex cursor-pointer flex-col items-center gap-1"
      onClick={() => window.print()}
    >
      <div className="bg-special-pink-600 group-hover:bg-special-pink-400 flex h-[120px] w-[50px] items-center justify-center rounded-[30px] shadow transition-colors duration-200 lg:w-[60px]">
        <Printer className="size-8 text-white lg:size-9" />
      </div>
      <p className="txt-c1-bold bg-special-pink-200 rounded-[15px] px-1 text-purple-900 shadow lg:px-1.5">
        복사·저장
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
  const showExamStart = pathname === '/';
  const showPrintAndDownload = isResult || pathname === '/institution';

  if (!showScrollAndInquiry && !showExamStart && !showPrintAndDownload) return null;

  return (
    <>
      <div data-print-hidden className="fixed right-5 bottom-5 z-50 flex flex-col gap-4 lg:gap-6">
        {showScrollAndInquiry && (
          <ScrollTopButton handleClick={() => window.scrollTo({ top: 0 })} />
        )}
        {showScrollAndInquiry && <InquiryButton handleClick={() => setOpen(true)} />}
        {showExamStart && <ExamStartButton />}
        {/* {showPrintAndDownload && <PrintAndDownloadButton />} */}
      </div>
      <InquiryModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
