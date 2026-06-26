'use client';

import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

interface Props {
  institutionName: string;
}

export function ReportRequestCard({ institutionName }: Props) {
  const [isRequesting, setIsRequesting] = useState(false);

  async function handleRequest() {
    setIsRequesting(true);
    try {
      const res = await fetch('/api/report-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionName }),
      });
      if (!res.ok) throw new Error();
      toast.success('리포트 신청이 완료되었습니다.');
    } catch {
      toast.error('신청 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <div className="border-special-navy-300 flex max-w-[700px] items-stretch gap-4 rounded-[20px] border bg-white p-3">
      <div className="flex shrink-0 items-center gap-3 text-purple-700">
        <CircleCheck className="size-7" />
        <div className="txt-b-bold">AX 역량 리포트 요청 가능</div>
      </div>
      <div className="bg-special-navy-100 w-px shrink-0 self-stretch" />
      <div className="txt-b-regular flex flex-1 items-center">
        검사 완료 데이터가 충분히 확보되어 리포트를 신청할 수 있습니다.
      </div>
      <div className="bg-special-navy-100 w-px shrink-0 self-stretch" />
      <Button
        variant="purple"
        className="self-center"
        onClick={handleRequest}
        disabled={isRequesting}
      >
        {isRequesting ? '신청 중...' : '리포트 신청하기'}
      </Button>
    </div>
  );
}
