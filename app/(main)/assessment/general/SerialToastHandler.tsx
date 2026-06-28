'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function SerialToastHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('serial')?.toUpperCase() === 'HELLOAX') {
      toast.success('카카오 채널 쿠폰이 자동 적용 되었습니다.', {
        description: '개인 AX 역량 검사를 시작합니다.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
