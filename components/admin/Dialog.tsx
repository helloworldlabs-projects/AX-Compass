'use client';

import { Dialog } from '@base-ui/react/dialog';

import { cn } from '@/lib/utils';

export interface AdminDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** 기본 520px. 표가 들어가는 창은 넓힌다. */
  size?: 'md' | 'lg';
  /** 바깥을 눌러 닫을지. 입력 중인 폼은 false(기본). Esc 는 늘 닫힌다. */
  dismissible?: boolean;
}

/**
 * 관리자용 모달. 원본의 "fixed inset-0 bg-ink/40" 창을 옮긴 것이다.
 * 초점 가두기·Esc·aria 는 base-ui Dialog(호스트 components/ui/Modal 과 같은 기반)가 맡는다.
 */
export function AdminDialog({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  dismissible = false,
}: AdminDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      disablePointerDismissal={!dismissible}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-gray-900/40" />
        <Dialog.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[16px] bg-white px-6 py-7 shadow-sm lg:px-8',
            size === 'md' ? 'max-w-[520px]' : 'max-w-[720px]',
          )}
        >
          <Dialog.Title className="txt-t3 text-gray-900">{title}</Dialog.Title>
          {description && (
            <Dialog.Description className="txt-c1-regular mt-2 text-gray-500">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
