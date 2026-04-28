import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CtaSection() {
  return (
    <div className="flex justify-center gap-4 lg:gap-6">
      <Button render={<Link href="/" />} variant="gray">
        메인으로
      </Button>
      <Button variant="purple">문의하기</Button>
    </div>
  );
}
