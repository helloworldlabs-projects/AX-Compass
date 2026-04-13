'use client';

import { ResultCodeModal } from '../modals/ResultCodeModal';
import { useState } from 'react';

export default function ResultSearchButton() {
  const [open, setOpen] = useState(false);

  function handleConfirm(code: string) {
    // TODO: 결과 조회 코드로 결과 조회 라우팅
    console.log(code);
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleResultConfirm(code: string) {
    handleConfirm(code);
    setOpen(false);
  }

  return (
    <>
      <button
        className="flex cursor-pointer items-center gap-1.5 text-white"
        onClick={() => setOpen(true)}
      >
        <span className="txt-b-bold">결과 조회</span>
      </button>
      <ResultCodeModal open={open} onClose={handleClose} onConfirm={handleResultConfirm} />
    </>
  );
}
