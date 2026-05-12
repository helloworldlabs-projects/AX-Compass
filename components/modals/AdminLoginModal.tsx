'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldLabel, Modal, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/Modal';

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (code: string, password: string) => void;
}

function AdminLoginModal({ open, onClose, onConfirm }: AdminLoginModalProps) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  function reset() {
    setCode('');
    setPassword('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    onConfirm(code, password);
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalTitle>기관 관리자 로그인</ModalTitle>

      <form onSubmit={handleConfirm} className="flex flex-col gap-4">
        <ModalBody>
          <div className="flex flex-col gap-2">
            <FieldLabel required>기관 코드</FieldLabel>
            <Input placeholder="기관 코드를 입력해 주세요." value={code} onChange={setCode} />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel required>비밀번호</FieldLabel>
            <Input
              type="password"
              placeholder="관리자 비밀번호를 입력해 주세요."
              value={password}
              onChange={setPassword}
            />
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

export { AdminLoginModal };
