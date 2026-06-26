'use client';

import { useState } from 'react';
import { ClipboardList, Clock, Users } from 'lucide-react';
import { UserStar } from 'lucide-react';

import { Modal, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/Modal';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  executiveExamCount: number;
  executiveCount: number;
  memberExamCount: number;
  memberCount: number;
}

export function ReportRequestConfirmModal({
  open,
  onClose,
  onConfirm,
  isConfirming,
  executiveExamCount,
  executiveCount,
  memberExamCount,
  memberCount,
}: Props) {
  const [agreed, setAgreed] = useState(false);

  function handleClose() {
    setAgreed(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} className="bg-special-navy-0">
      <ModalTitle>AX 분석 리포트를 신청하시겠습니까?</ModalTitle>

      <ModalBody className="gap-6">
        {/* 안내 섹션 */}
        <div className="flex flex-col gap-6 rounded-[20px] bg-white">
          <div className="flex items-start gap-4">
            <div className="bg-purple-0 flex size-[50px] shrink-0 items-center justify-center gap-2 rounded-full text-purple-700">
              <ClipboardList className="size-8" aria-hidden />
            </div>
            <ul className="flex flex-col">
              <li className="txt-b-regular flex gap-1.5">
                <span className="mt-2.5 size-1 shrink-0 rounded-full bg-black" aria-hidden />
                현재 검사 완료 인원을 기준으로 AX 분석 리포트가 신청됩니다.
              </li>
              <li className="txt-b-regular flex gap-1.5">
                <span className="mt-2.5 size-1 shrink-0 rounded-full bg-black" aria-hidden />
                신청 후 대상 인원과 신청 내용을 변경하거나 취소가 어렵습니다.
              </li>
              <li className="txt-b-regular flex gap-1.5">
                <span className="mt-2.5 size-1 shrink-0 rounded-full bg-black" aria-hidden />
                검사를 완료한 전체 인원을 대상으로 분석된 리포트가 제공되며, 소속별 리포트를
                희망하시는 경우 별도 문의 부탁 드립니다.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-special-navy-100 h-px w-full" />

        {/* 현재 검사 완료 인원 */}
        <div className="flex flex-col gap-6">
          <p className="txt-b-bold">현재 검사 완료 인원</p>
          <div className="flex gap-3">
            {/* 임원진 카드 */}
            <div className="bg-purple-0 flex flex-1 items-center justify-center gap-4 rounded-[20px] border border-purple-700 p-3">
              <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-white text-purple-700">
                <UserStar className="size-8 shrink-0" aria-hidden />
              </div>
              <div className="flex flex-col gap-2">
                <span className="txt-b-bold text-gray-700">임원진</span>
                <p className="txt-st2-bold text-gray-700">
                  <span className="txt-st-bold text-purple-700">{executiveExamCount}</span>
                  {' / '}
                  {executiveCount}명
                </p>
              </div>
            </div>

            {/* 구성원 카드 */}
            <div className="bg-purple-0 flex flex-1 items-center justify-center gap-4 rounded-[20px] border border-purple-700 p-3">
              <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-white text-purple-700">
                <Users className="size-8 shrink-0" aria-hidden />
              </div>
              <div className="flex flex-col gap-2">
                <span className="txt-b-bold text-gray-700">구성원</span>
                <p className="txt-st2-bold text-gray-700">
                  <span className="txt-st-bold text-purple-700">{memberExamCount}</span>
                  {' / '}
                  {memberCount}명
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 소요 시간 안내 */}
        <div className="flex items-center gap-4 rounded-[20px] border border-purple-700 px-3 py-2">
          <div className="flex size-[50px] shrink-0 items-center justify-center">
            <Clock className="size-8 text-purple-700" aria-hidden />
          </div>
          <p className="txt-b-regular">
            신청된 리포트는 검토 및 작성 후 2~3일 내 확인할 수 있습니다.
          </p>
        </div>

        <div className="bg-special-navy-100 h-px w-full" />

        {/* 체크박스 */}
        <Checkbox
          id="report-request-agree"
          label="신청 기준과 변경·취소 불가 내용을 확인했습니다."
          className="size-6!"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="gray" onClick={handleClose} disabled={isConfirming}>
          취소
        </Button>
        <Button
          variant="purple"
          onClick={onConfirm}
          disabled={isConfirming || !agreed}
          aria-disabled={isConfirming || !agreed}
        >
          {isConfirming ? '신청 중...' : '리포트 신청하기'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
