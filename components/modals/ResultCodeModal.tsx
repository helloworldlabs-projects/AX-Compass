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

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    onConfirm(code);
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalTitle>결과 조회 코드 입력</ModalTitle>

      <form onSubmit={handleConfirm}>
        <ModalBody>
          <div className="flex flex-col gap-2">
            <FieldLabel required>결과 조회 코드</FieldLabel>
            <Input placeholder="결과 조회 코드를 입력해 주세요" value={code} onChange={setCode} />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="gray" onClick={handleClose}>
            닫기
          </Button>
          <Button type="submit" variant="purple">
            확인
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export { ResultCodeModal };
