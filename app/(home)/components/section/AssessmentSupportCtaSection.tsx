'use client';

import Section from '@/components/layout/Section';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function AssessmentSupportCtaSection() {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  return (
    <>
      <InquiryModal open={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} />
      <Section>
        <div className="flex w-full max-w-[1416px] flex-wrap gap-4">
          <div className="rounded-card relative min-w-[340px] flex-1 overflow-hidden rounded-[12px] p-6 lg:min-w-[500px] lg:gap-6 lg:px-[75px] lg:py-[50px]">
            <Image src="/images/main/img_cta_1.png" alt="" fill className="object-cover" />
            <div className="relative flex flex-col gap-6">
              <div className="flex w-fit items-center gap-2 rounded-[12px] bg-purple-700 px-4 py-1 text-white lg:px-6 lg:py-3">
                <Gift className="size-6" />
                <span className="txt-b-bold">검사 비용 지원 안내</span>
              </div>
              <div className="txt-t2 text-white">
                AX 역량 검사 부담없이,
                <br />
                <span className="txt-t1 text-purple-500">무료</span>로 이용하세요.
              </div>
              <div className="flex flex-col gap-4 text-white">
                <div className="txt-st2-bold">
                  <span className="text-purple-200">헬로월드랩스</span>가 AX 역량 검사 비용을{' '}
                  <span className="text-purple-200">전액 지원</span>합니다.
                </div>
                <div className="txt-st2-regular">
                  조직의 현재 수준을 확인하고 다음 성장 방향을 설계해 보세요.
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-card relative min-w-[340px] flex-1 overflow-hidden rounded-[12px] p-6 lg:min-w-[500px] lg:gap-6 lg:px-[75px] lg:py-[50px]">
            <Image src="/images/main/img_cta_2.png" alt="" fill className="object-cover" />
            <div className="relative flex w-fit flex-col gap-2 text-center">
              <div className="relative mx-auto h-[28px] w-[180px]">
                <Image
                  src="/images/main/img_cta_description.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-gray-100">
                <div className="txt-b-bold">정상가(1인)</div>
                <div className="txt-st-regular line-through">27,900원</div>
              </div>
              <div className="relative mx-auto h-[73px] w-[94px] lg:h-[104px] lg:w-[134px]">
                <Image src="/images/main/img_cta_price.png" alt="" fill className="object-cover" />
              </div>
              <Button
                variant="purple"
                className="txt-st2-bold h-[60px] w-[180px] lg:w-[216px]"
                onClick={() => {
                  setIsInquiryModalOpen(true);
                }}
              >
                검사 비용 지원 문의 →
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
