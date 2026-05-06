'use client';

import { Button } from '@/components/ui/button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import type { BulkUploadResult } from '@/types/institution';

interface BulkUploadResultDialogProps {
  result: BulkUploadResult | null;
  onClose: () => void;
}

export default function BulkUploadResultDialog({ result, onClose }: BulkUploadResultDialogProps) {
  return (
    <Modal open={result !== null} onClose={onClose}>
      <div className="flex flex-col gap-3 pt-2">
        {result?.status === 'SUCCESS' && (
          <p className="txt-st2-bold text-gray-900">
            일괄 등록 업로드가 정상적으로 완료 되었습니다.
          </p>
        )}

        {result?.status === 'PARTIAL' && (
          <>
            <p className="txt-st2-bold text-gray-900">
              일부 검사자를 제외하고 일괄 등록 업로드가 완료 되었습니다.
            </p>
            <p className="txt-b-regular text-gray-600">다음 번호의 검사자를 확인해 주세요.</p>
            <p className="txt-b-bold text-purple-700">
              No. {result.failedNos.join(', ')}
            </p>
          </>
        )}

        {result?.status === 'ALL_FAILED' && (
          <>
            <p className="txt-st2-bold text-gray-900">
              일괄 등록 업로드를 완료하지 못했습니다.
            </p>
            <p className="txt-b-regular text-gray-600">
              업로드한 파일의 내용을 확인한 뒤 다시 등록해 주세요.
            </p>
          </>
        )}

        {result?.status === 'INVALID_FORMAT' && (
          <>
            <p className="txt-st2-bold text-gray-900">양식이 올바르지 않습니다.</p>
            <p className="txt-b-regular text-gray-600">
              일괄 등록 양식을 다시 다운로드한 뒤 등록해 주세요.
            </p>
          </>
        )}

        {result?.status === 'SYSTEM_ERROR' && (
          <>
            <p className="txt-st2-bold text-gray-900">
              일괄 등록 업로드 중 오류가 발생했습니다.
            </p>
            <p className="txt-b-regular text-gray-600">
              잠시 후 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해 주세요.
            </p>
          </>
        )}
      </div>

      <ModalFooter>
        <Button variant="purple" onClick={onClose} aria-label="닫기">
          확인
        </Button>
      </ModalFooter>
    </Modal>
  );
}
