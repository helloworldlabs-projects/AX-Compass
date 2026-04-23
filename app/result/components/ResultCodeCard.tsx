'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ResultCodeCardProps {
  resultCode: string;
}

export function ResultCodeCard({ resultCode }: ResultCodeCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(resultCode);
    toast.success('결과 조회 코드가 복사되었습니다.');
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      toast.error('카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY ?? '');
    }
    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text: `AX Compass 역량 진단 결과를 확인해보세요!\n결과 코드: ${resultCode}`,
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
    });
  };

  return (
    <div className="bg-gray-0 flex flex-col items-center gap-2.5 rounded-[12px] border-2 border-purple-800 p-4">
      <div className="txt-b-bold rounded-[14px] border border-purple-100 bg-purple-800 px-3 text-white">
        결과 조회 코드
      </div>
      <div className="txt-c1-regular text-gray-700">
        코드를 복사해 두면 나중에 결과를 다시 확인할 수 있습니다.
      </div>
      <div className="flex items-center gap-2.5">
        <button className="flex cursor-pointer items-center gap-2.5" onClick={handleCopy}>
          <div className="txt-b-bold text-purple-800">{resultCode}</div>
          <div className="rounded-[4px] border-purple-100 bg-purple-800 p-1">
            <CopyIcon className="size-4 text-white" strokeWidth={3} />
          </div>
        </button>
        <button
          onClick={handleKakaoShare}
          className="txt-c2-bold flex cursor-pointer items-center gap-1 rounded-[4px] border border-[#3B1C1C] bg-[#F9E000] px-1 text-[#3B1C1C]"
        >
          <Image src="/images/logo/img_logo_kakao.png" alt="" width={20} height={20} />
          <span>링크 공유</span>
        </button>
      </div>
    </div>
  );
}
