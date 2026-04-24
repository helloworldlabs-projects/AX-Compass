'use client';

import { CompassIcon } from '@/components/icons/CompassIcon';
import Section from '@/components/layout/Section';
import { Check } from 'lucide-react';
import Image from 'next/image';

interface InstitutionNoticeBannersProps {
  executiveExamCount: number;
  memberExamCount: number;
}

export function InstitutionNoticeBanners({
  executiveExamCount,
  memberExamCount,
}: InstitutionNoticeBannersProps) {
  return (
    <>
      {executiveExamCount < 2 && (
        <Section data-print-hidden className="max-w-[1000px] shrink-0">
          <div className="bg-special-pink-0 flex w-full flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
            <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
              <Check className="size-4.5 text-white" strokeWidth={3} />
              <span className="txt-c1-bold text-white">기관 통계 안내</span>
            </div>
            <div className="txt-st2-bold text-center text-black">
              임원진 검사 응답 수가 부족하여 기관 AX 성숙도 통계를 제공할 수 없습니다.
              <br />
              <span className="text-special-pink-600">임원진 검사 2명 이상 참여 시</span> 확인할 수
              있습니다.
            </div>
            <span className="txt-c2-regular text-end">
              [임원진] 상세 보기에서 검사자를 등록 후 검사를 진행해주세요.
            </span>
          </div>
        </Section>
      )}
      {memberExamCount < 5 && (
        <Section data-print-hidden className="max-w-[1000px] shrink-0">
          <div className="bg-special-pink-0 flex w-full flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
            <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
              <Check className="size-4.5 text-white" strokeWidth={3} />
              <span className="txt-c1-bold text-white">기관 통계 안내</span>
            </div>
            <div className="txt-st2-bold text-center text-black">
              구성원 검사 응답 수가 부족하여 기관 AX 역량 통계를 제공할 수 없습니다.
              <br />
              <span className="text-special-pink-600">구성원 검사 5명 이상 참여 시</span> 확인할 수
              있습니다.
            </div>
            <span className="txt-c2-regular text-end">
              [구성원] 상세 보기에서 검사자를 등록 후 검사를 진행해주세요.
            </span>
          </div>
        </Section>
      )}
      <Section className="max-w-[1000px] shrink-0">
        <div className="bg-gray-0 flex w-full flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
          <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
            <CompassIcon className="size-4.5 text-white" fillOpacity="1" />
            <span className="txt-c1-bold text-white">기관 통계 안내</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/images/logo/img_logo_helloworldlabs.png"
              alt=""
              width={300}
              height={30}
              className="h-[30px] w-[300px] object-contain"
            />
            <div className="txt-st2-bold text-black">에서 인증하는 공식 결과입니다.</div>
          </div>
          <div className="text-center">
            본 문서는 AX Compass 진단 결과를 바탕으로 생성되었습니다.
          </div>
          <div className="txt-c2-regular flex items-center justify-end gap-2">
            <span>발급 기관: (주)헬로월드랩스</span>
          </div>
        </div>
      </Section>
    </>
  );
}
