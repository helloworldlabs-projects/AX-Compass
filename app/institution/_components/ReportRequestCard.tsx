'use client';

import { useState } from 'react';
import { CircleCheck, ClipboardCheck, Clock3 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ReportRequestConfirmModal } from './ReportRequestConfirmModal';

type ReportStatus = 'NOT_STARTED' | 'REQUESTED' | 'COMPLETED';

const REPORT_STATUS_CONFIG = {
  NOT_STARTED: {
    icon: CircleCheck,
    iconClass: 'text-purple-700',
    titleClass: 'text-purple-700',
    title: 'AX 역량 리포트 요청 가능',
    description: '검사 완료 데이터가 충분히 확보되어 리포트를 신청할 수 있습니다.',
    buttonLabel: '리포트 신청하기',
    buttonVariant: 'purple' as const,
    buttonDisabled: false,
  },
  REQUESTED: {
    icon: Clock3,
    iconClass: 'text-purple-700',
    titleClass: 'text-purple-700',
    title: 'AX 역량 리포트 처리 중',
    description: '신청하신 데이터를 기준으로 리포트를 작성하고 있습니다. 2~3일 정도 소요됩니다.',
    buttonLabel: '리포트 처리 중',
    buttonVariant: 'purple600' as const,
    buttonDisabled: false,
  },
  COMPLETED: {
    icon: ClipboardCheck,
    iconClass: 'text-purple-700',
    titleClass: 'text-purple-700',
    title: 'AX 역량 리포트 확인 가능',
    description: '신청하신 리포트의 작성이 완료되었습니다. 지금 바로 결과를 확인할 수 있습니다.',
    buttonLabel: '리포트 확인하기',
    buttonVariant: 'pink' as const,
    buttonDisabled: false,
  },
} as const;

interface Props {
  institutionName: string;
  executiveExamCount: number;
  executiveCount: number;
  memberExamCount: number;
  memberCount: number;
  status: ReportStatus;
}

export function ReportRequestCard({
  institutionName,
  executiveExamCount,
  executiveCount,
  memberExamCount,
  memberCount,
  status,
}: Props) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const config = REPORT_STATUS_CONFIG[status];
  const Icon = config.icon;

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
      setModalOpen(false);
    } catch {
      toast.error('신청 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsRequesting(false);
    }
  }

  function handleButtonClick() {
    if (status === 'NOT_STARTED') setModalOpen(true);
    // COMPLETED: 리포트 확인 팝업 (추후 구현)
  }

  return (
    <>
      <div className="border-special-navy-300 flex max-w-[700px] items-stretch gap-4 rounded-[20px] border bg-white p-3">
        <div className={`flex shrink-0 items-center gap-3 ${config.iconClass}`}>
          <Icon className="size-7" />
          <div className={`txt-b-bold ${config.titleClass}`}>{config.title}</div>
        </div>
        <div className="bg-special-navy-100 w-px shrink-0 self-stretch" />
        <div className="txt-b-regular flex flex-1 items-center">{config.description}</div>
        <div className="bg-special-navy-100 w-px shrink-0 self-stretch" />
        <Button
          variant={config.buttonVariant}
          className="h-[60px] w-[140px]"
          onClick={handleButtonClick}
          disabled={config.buttonDisabled || isRequesting}
        >
          {config.buttonLabel}
        </Button>
      </div>

      <ReportRequestConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleRequest}
        isConfirming={isRequesting}
        executiveExamCount={executiveExamCount}
        executiveCount={executiveCount}
        memberExamCount={memberExamCount}
        memberCount={memberCount}
      />
    </>
  );
}
