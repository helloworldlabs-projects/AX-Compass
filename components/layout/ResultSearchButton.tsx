'use client';

import { ResultCodeModal } from '../modals/ResultCodeModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { examService } from '@/api/services/exam.service';
import type { ExamType } from '@/types/exam';

const EXAM_TYPE_PATH: Record<ExamType, string> = {
  STANDARD: 'general',
  PRECISION: 'member',
  EXECUTIVE: 'executive',
};

export default function ResultSearchButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleConfirm(code: string) {
    try {
      // 임원
      if (code.length === 5) {
        await examService.getExecutiveResult(code);
        router.push(`/result/executive/${code}`);
      } else {
        const result = await examService.getExamResult(code);
        router.push(`/result/${EXAM_TYPE_PATH[result.examType]}/${code}`);
      }
    } catch {
      toast.error('결과를 찾을 수 없습니다. 코드를 다시 확인해주세요.');
    } finally {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        className="flex cursor-pointer items-center gap-1.5 text-white"
        onClick={() => setOpen(true)}
      >
        <span className="txt-b-bold">결과 조회</span>
      </button>
      <ResultCodeModal open={open} onClose={() => setOpen(false)} onConfirm={handleConfirm} />
    </>
  );
}
