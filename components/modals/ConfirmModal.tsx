'use client';

import { Button } from '@/components/ui/button';
import { Modal, ModalDescription, ModalFooter, ModalTitle } from '@/components/ui/Modal';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'purple' | 'pink' | 'navy' | 'dark-blue';
  isLoading?: boolean;
}

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  confirmVariant = 'purple',
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalTitle>{title}</ModalTitle>
      {description && <ModalDescription>{description}</ModalDescription>}
      <ModalFooter>
        <Button variant="gray" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} disabled={isLoading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export { ConfirmModal };
