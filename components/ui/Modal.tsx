'use client';

import { Dialog } from '@base-ui/react/dialog';
import { CircleX } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

interface ModalTitleProps {
  children: React.ReactNode;
}

interface ModalDescriptionProps {
  children: React.ReactNode;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

interface FieldLabelProps {
  required?: boolean;
  children: React.ReactNode;
}

function Modal({ open, onClose, children, className }: ModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-60 bg-black/50 duration-150" />
        <Dialog.Popup className={cn('data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 bg-special-navy-0 rounded-card fixed top-1/2 left-1/2 z-60 flex max-h-[90vh] w-[calc(100%-20px)] max-w-[600px] min-w-[340px] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-hidden p-5 duration-150 lg:p-[30px]', className)}>
          <Dialog.Close
            aria-label="닫기"
            className="absolute top-[20px] right-[20px] flex size-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100 lg:top-[30px] lg:right-[30px]"
          >
            <CircleX className="size-[30px] text-gray-800 lg:size-9" aria-hidden />
          </Dialog.Close>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ModalTitle({ children }: ModalTitleProps) {
  return <Dialog.Title className="txt-t2 pr-10 text-black">{children}</Dialog.Title>;
}

function ModalDescription({ children }: ModalDescriptionProps) {
  return <Dialog.Description className="txt-c1-bold text-black">{children}</Dialog.Description>;
}

/** 바디 영역만 세로 스크롤되게 하려면 이 컴포넌트로 감싸세요. */
function ModalContent({ children, className }: ModalContentProps) {
  return <div className={cn('flex flex-col gap-6 overflow-y-auto', className)}>{children}</div>;
}

function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div
      className={cn(
        'rounded-card flex flex-col gap-4 bg-white p-5 shadow lg:gap-6 lg:p-[30px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function ModalFooter({ children }: ModalFooterProps) {
  return <div className="flex justify-center gap-3">{children}</div>;
}

function FieldLabel({ required, children }: FieldLabelProps) {
  return (
    <p className="txt-c1-bold flex items-center gap-1">
      <span className={required ? 'text-red-500' : 'text-special-dark-blue-500'}>
        {required ? '[필수]' : '[선택]'}
      </span>
      <span className="text-gray-500">{children}</span>
    </p>
  );
}

export { Modal, ModalTitle, ModalDescription, ModalContent, ModalBody, ModalFooter, FieldLabel };
