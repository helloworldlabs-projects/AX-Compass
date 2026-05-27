'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, ChartColumnIncreasing, CircleCheck, Map, SquarePen } from 'lucide-react';
import Image from 'next/image';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { useState } from 'react';

export function ReportHeroSection() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  return (
    <>
      <div className="relative overflow-hidden rounded-t-[20px] px-[10px] py-[50px] lg:rounded-t-[50px] lg:px-[100px]">
        <Image
          src="/images/main/img_bg_report.png"
          alt=""
          fill
          className="absolute inset-0 object-cover"
        />
        <div className="relative flex flex-col gap-y-[40px]">
          <div className="flex w-full flex-wrap items-center justify-between gap-y-[40px]">
            <div className="mx-auto flex w-[340px] shrink-0 flex-col gap-6 lg:w-[500px] lg:min-w-[500px]">
              <div className="text-shadow txt-h2 items-center text-white">
                <span className="mr-1 bg-linear-to-b from-purple-200 to-[#533799] bg-clip-text text-transparent">
                  무료 AX 역량 진단
                </span>
                <br className="block lg:hidden" />
                부터 결과 분석까지
              </div>
              <div className="txt-b-regular text-white">
                AX Compass로 AX 역량을 진단하고,
                <br />
                기관 통계 분석을 기반으로 맞춤형 컨설팅과 교육을 연계하세요.
                <br />
                교육 이후에는 결과 보고서로 변화 수준과 향후 전략 방향까지 확인할 수 있습니다.
              </div>
              <div className="flex items-center gap-6">
                <Button
                  variant={'purple'}
                  className="h-[60px] w-[140px]"
                  onClick={() => setInquiryOpen(true)}
                >
                  무료 진단 문의 →
                </Button>
                <Button
                  render={<Link href="/assessment" />}
                  variant={'navy'}
                  className="h-[60px] w-[140px]"
                >
                  검사 유형 선택 →
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-200">
                  <CircleCheck className="size-4.5" strokeWidth={3} />
                  <span>AX 역량 진단</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-200">
                  <CircleCheck className="size-4.5" strokeWidth={3} />
                  <span>AX 성숙도 진단</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-200">
                  <CircleCheck className="size-4.5" strokeWidth={3} />
                  <span>기관 분석</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-200">
                  <CircleCheck className="size-4.5" strokeWidth={3} />
                  <span>사전·사후 분석</span>
                </div>
              </div>
            </div>
            <div className="relative mx-auto aspect-760/600 w-full max-w-[500px] min-w-[340px] flex-1 lg:max-w-[760px] lg:min-w-[500px]">
              <Image src="/images/main/img_report.png" alt="" fill className="object-cover" />
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 2xl:grid-cols-4">
            <div className="border-special-dark-blue-0 bg-special-dark-blue-500/70 rounded-card flex items-center justify-center gap-4 border p-3 lg:p-4">
              <div className="from-special-dark-blue-700 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-linear-to-b to-[#617997] lg:h-[60px] lg:w-[60px]">
                <SquarePen className="size-6 text-white lg:size-8" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="txt-b-bold text-special-dark-blue-200">Step 1</div>
                <div className="txt-st2-bold break-keep text-white">무료 역량 진단</div>
                <div className="txt-c1-regular break-keep text-white">
                  체계적인 AX 역량 검사를 통해
                  <br />
                  기관과 구성원의 수준을 진단합니다.
                </div>
              </div>
            </div>
            <div className="border-special-dark-blue-0 bg-special-dark-blue-500/70 rounded-card flex items-center justify-center gap-4 border p-3 lg:p-4">
              <div className="from-special-dark-blue-700 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-linear-to-b to-[#617997] lg:h-[60px] lg:w-[60px]">
                <Map className="size-6 text-white lg:size-8" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="txt-b-bold text-special-dark-blue-200">Step 2</div>
                <div className="txt-st2-bold break-keep text-white">기관·구성원 통계 제공</div>
                <div className="txt-c1-regular break-keep text-white">
                  기관 단위 분석 통계 자료로
                  <br />
                  전략 수립과 의사결정을 지원합니다.
                </div>
              </div>
            </div>
            <div className="border-special-dark-blue-0 bg-special-dark-blue-500/70 rounded-card flex items-center justify-center gap-4 border p-3 lg:p-4">
              <div className="from-special-dark-blue-700 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-linear-to-b to-[#617997] lg:h-[60px] lg:w-[60px]">
                <ChartColumnIncreasing className="size-6 text-white lg:size-8" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="txt-b-bold text-special-dark-blue-200">Step 3</div>
                <div className="txt-st2-bold break-keep text-white">맞춤형 컨설팅·교육 연계</div>
                <div className="txt-c1-regular break-keep text-white">
                  결과를 바탕으로 최적의 컨설팅과
                  <br />
                  교육 프로그램을 제공합니다.
                </div>
              </div>
            </div>
            <div className="border-special-dark-blue-0 bg-special-dark-blue-500/70 rounded-card flex items-center justify-center gap-4 border p-3 lg:p-4">
              <div className="from-special-dark-blue-700 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-linear-to-b to-[#617997] lg:h-[60px] lg:w-[60px]">
                <BookOpen className="size-6 text-white lg:size-8" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="txt-b-bold text-special-dark-blue-200">Step 4</div>
                <div className="txt-st2-bold break-keep text-white">기관 결과 분석 보고서</div>
                <div className="txt-c1-regular break-keep text-white">
                  사전·사후 비교 및 결과 분석을 담은
                  <br />
                  상세 결과 보고서를 제공합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
