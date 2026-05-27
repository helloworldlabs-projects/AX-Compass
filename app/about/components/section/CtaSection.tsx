'use client';

import { InquiryModal } from '@/components/modals/InquiryModal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export function CtaSection() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  return (
    <>
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
      <div className="flex justify-center gap-4 lg:gap-6">
        <Button render={<Link href="/" />} variant="gray">
          메인으로
        </Button>
        <Button variant="purple" onClick={() => setInquiryOpen(true)}>
          문의하기
        </Button>
      </div>
    </>
  );
}
