import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type TextDisplayProps = {
  className?: string;
  id?: string;
  /** 줄바꿈(`\n`) 포함 문자열. `children`이 있으면 무시됨 */
  text?: string;
  children?: ReactNode;
};

/**
 * Input과 동일한 카드 룩의 읽기 전용 다줄 표시(편집 불가, `<input>`/`<textarea>` 아님).
 */
function TextDisplay({ className, id, text, children }: TextDisplayProps) {
  const content = children ?? text ?? '';

  return (
    <div
      id={id}
      data-slot="text-display"
      className={cn(
        'txt-b-regular w-full rounded-[12px] bg-white p-3 text-gray-700 shadow',
        'min-h-12 min-w-0 wrap-break-word whitespace-pre-wrap lg:min-h-[46px]',
        className,
      )}
    >
      {content}
    </div>
  );
}

export { TextDisplay };
