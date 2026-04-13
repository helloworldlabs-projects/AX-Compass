'use client';

import { useState } from 'react';
import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import Link from 'next/link';
import { InstitutionStartModal } from '@/components/modals/InstitutionStartModal';
import { InquiryModal } from '@/components/modals/InquiryModal';

type InstitutionType = 'executive' | 'member' | null;

export default function AssessmentPage() {
  const [institutionType, setInstitutionType] = useState<InstitutionType>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  function handleConfirm(code: string, name: string) {
    // TODO: 기관 코드·이름으로 검사 시작 라우팅
    console.log(institutionType, code, name);
    setInstitutionType(null);
  }

  return (
    <Container>
      <CompassIcon className="absolute top-[100px] left-1/2 h-[300px] w-[272px] -translate-x-1/2 lg:h-[600px] lg:w-[543px]" />
      <SectionHeader
        title={
          <>
            <span className="text-purple-700">AX 역량</span>을 지금 바로 진단하세요.
          </>
        }
        description="AX 역량을 빠르게 진단하고, 역량 프로필 기반으로 필요한 AI 학습 방향을 확인하세요."
        as="h2"
      />
      <div className="mx-auto flex w-full max-w-[675px] justify-between">
        <div className="flex w-[300px] flex-col gap-1.5 lg:gap-2.5">
          <div className="bg-special-navy-700 rounded-card border-special-navy-100 relative flex h-full flex-col items-center justify-center gap-2.5 border-3 py-[50px] lg:gap-[20px]">
            <div className="txt-c2-bold bg-special-pink-600 absolute top-2.5 left-0 flex items-center rounded-l-[4px] py-1.5 pr-6 pl-3 text-white [clip-path:polygon(0_0,100%_0,calc(100%-14px)_50%,100%_100%,0_100%)] lg:top-5">
              빠른 검사
            </div>
            <div className="txt-st-bold text-white">일반 검사</div>
            <div className="flex flex-col items-center justify-center gap-1.5">
              <Button
                render={<Link href="/assessment/general" />}
                variant="navy"
                className="h-15 lg:h-20"
              >
                시작하기 →
              </Button>
              <div className="txt-c2-regular text-white">* 개인용 AX 역량 검사</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:gap-6">
            <div className="flex justify-center gap-1 lg:gap-2.5">
              <span className="txt-c2-bold flex items-center rounded-[12px] bg-red-200 px-1 py-0.5 text-white lg:px-1.5">
                회원가입 없이
              </span>
              <span className="txt-c2-bold flex items-center rounded-[12px] bg-red-200 px-1 py-0.5 text-white lg:px-1.5">
                개인 역량
              </span>
              <span className="txt-c2-bold flex items-center rounded-[12px] bg-red-200 px-1 py-0.5 text-white lg:px-1.5">
                빠른 분석
              </span>
            </div>
            <div className="text-center">
              * 개인용 검사로 현재 AX 역량을 확인합니다.
              <br />* 회원가입 없이 무료로 즉시 시작할 수 있습니다.
            </div>
          </div>
        </div>
        <div className="flex w-[300px] flex-col gap-1.5 lg:gap-2.5">
          <div className="bg-special-navy-700 rounded-card border-special-navy-100 relative flex flex-col items-center justify-center gap-2.5 border-3 py-[50px] lg:gap-[20px]">
            <div className="txt-c2-bold absolute top-2.5 left-0 flex items-center rounded-l-[4px] bg-purple-800 py-1.5 pr-6 pl-3 text-white [clip-path:polygon(0_0,100%_0,calc(100%-14px)_50%,100%_100%,0_100%)] lg:top-5">
              정밀 검사
            </div>
            <div className="txt-st-bold text-white">기관 검사</div>
            <div className="flex flex-wrap justify-center gap-2.5 lg:gap-5">
              <div className="flex flex-col items-center justify-center gap-1.5">
                <Button
                  variant="purple"
                  className="h-15 lg:h-20"
                  onClick={() => setInstitutionType('executive')}
                >
                  임원진
                  <br />
                  시작하기 →
                </Button>
                <div className="txt-c2-regular text-white">* 기관용 AX 성숙도 검사</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5">
                <Button
                  variant="purple"
                  className="h-15 lg:h-20"
                  onClick={() => setInstitutionType('member')}
                >
                  구성원
                  <br />
                  시작하기 →
                </Button>
                <div className="txt-c2-regular text-white">* 구성원 AX 역량 검사</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:gap-6">
            <div className="flex justify-center gap-1 lg:gap-2.5">
              <span className="txt-c2-bold flex items-center rounded-[12px] bg-red-200 px-1 py-0.5 text-white lg:px-1.5">
                기관 인증코드
              </span>
              <span className="txt-c2-bold flex items-center rounded-[12px] bg-red-200 px-1 py-0.5 text-white lg:px-1.5">
                기관 역량
              </span>
              <span className="txt-c2-bold flex items-center rounded-[12px] bg-red-200 px-1 py-0.5 text-white lg:px-1.5">
                정밀 분석
              </span>
            </div>
            <div className="text-center">
              * 기관용 정밀 분석과 결과 리포트를 제공합니다.
              <br />* 기관 인증코드 입력 후 시작할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-center gap-4 lg:gap-6">
        <Button render={<Link href="/" />} variant="gray">
          메인으로
        </Button>
        <Button variant="purple" onClick={() => setInquiryOpen(true)}>
          검사 문의
        </Button>
      </div>
      <InstitutionStartModal
        open={institutionType !== null}
        onClose={() => setInstitutionType(null)}
        onConfirm={handleConfirm}
      />
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Container>
  );
}
