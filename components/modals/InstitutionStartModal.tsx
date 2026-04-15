'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldLabel, Modal, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/Modal';

interface InstitutionStartModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (code: string, name: string) => void;
  isLoading?: boolean;
}

function InstitutionStartModal({ open, onClose, onConfirm, isLoading }: InstitutionStartModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  function reset() {
    setCode('');
    setName('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleConfirm() {
    onConfirm(code, name);
    reset();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalTitle>기관 검사 시작하기</ModalTitle>

      <ModalBody>
        <div className="flex flex-col gap-2">
          <FieldLabel required>기관 코드</FieldLabel>
          <Input placeholder="기관 코드를 입력해 주세요" value={code} onChange={setCode} />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel required>이름</FieldLabel>
          <Input placeholder="이름을 입력해 주세요" value={name} onChange={setName} />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="gray" onClick={handleClose}>
          닫기
        </Button>
        <Button variant="purple" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? '확인 중...' : '확인'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export { InstitutionStartModal };
