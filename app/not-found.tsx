import Link from 'next/link';

import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Container className="min-h-[60vh] justify-center gap-6!">
      <CompassIcon className="h-32 w-32 lg:h-48 lg:w-48" aria-hidden="true" />
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="txt-t2 text-black">페이지를 찾을 수 없습니다.</p>
        <p className="txt-b-regular text-gray-400">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>
      <Button render={<Link href="/" />} nativeButton={false} variant="purple">
        메인으로
      </Button>
    </Container>
  );
}
