'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldLabel, Modal, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/Modal';

interface ResultCodeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (code: string) => void;
}

function ResultCodeModal({ open, onClose, onConfirm }: ResultCodeModalProps) {
  const [code, setCode] = useState('');

  function handleClose() {
    setCode('');
    onClose();
  }

  function handleConfirm() {
    onConfirm(code);
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalTitle>결과 조회 코드 입력</ModalTitle>

      <ModalBody>
        <div className="flex flex-col gap-2">
          <FieldLabel required>결과 조회 코드</FieldLabel>
          <Input placeholder="결과 조회 코드를 입력해 주세요" value={code} onChange={setCode} />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="gray" onClick={handleClose}>
          닫기
        </Button>
        <Button variant="purple" onClick={handleConfirm}>
          확인
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export { ResultCodeModal };
