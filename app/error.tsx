'use client';

import Link from 'next/link';

import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="min-h-[60vh] justify-center gap-6!">
      <CompassIcon className="h-32 w-32 lg:h-48 lg:w-48" aria-hidden="true" />
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="txt-t2 text-black">오류가 발생했습니다.</p>
        <p className="txt-b-regular text-gray-400">
          잠시 후 다시 시도하거나 메인으로 이동해 주세요.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="gray" onClick={reset}>
          다시 시도
        </Button>
        <Button render={<Link href="/" />} nativeButton={false} variant="purple">
          메인으로
        </Button>
      </div>
    </Container>
  );
}
