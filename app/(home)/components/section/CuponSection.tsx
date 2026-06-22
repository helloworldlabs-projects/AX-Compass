'use client';

import Section from '@/components/layout/Section';
import { Gift } from 'lucide-react';
import Image from 'next/image';

export function CuponSection() {
  function handleAddChannel() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kakao = (window as any).Kakao;
    if (!kakao) return;
    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    }
    kakao.Channel.addChannel({ channelPublicId: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID });
  }

  return (
    <Section>
      <div className="rounded-card relative h-[425px] w-[340px] overflow-hidden p-6 lg:h-[625px] lg:w-[500px] lg:p-[50px]">
        <Image src="/images/main/img_cupon.png" alt="" fill className="object-cover" />
        <div className="relative flex flex-col gap-3 lg:gap-6">
          <div className="flex w-fit items-center gap-2 rounded-[12px] bg-purple-700 px-4 py-1 text-white lg:px-6 lg:py-3">
            <Gift className="size-6" />
            <span className="txt-b-bold">채널 추가 혜택</span>
          </div>
          <div className="txt-t2 text-white">
            카카오채널 추가하고
            <br />
            <span className="txt-t1 text-purple-500">무료 쿠폰</span> 받기
          </div>
        </div>
        <button
          onClick={handleAddChannel}
          className="txt-st2-bold text-shadow absolute bottom-6 left-1/2 flex w-fit -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-[20px] bg-yellow-500 px-4 py-2 text-gray-900 transition-colors hover:bg-yellow-400"
        >
          <div className="relative h-[24px] w-[38px]">
            <Image
              src="/images/main/img_kakao_channel.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          채널 추가
        </button>
      </div>
    </Section>
  );
}
