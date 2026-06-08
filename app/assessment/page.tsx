'use client';

import { useState } from 'react';
import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import Link from 'next/link';
import { InstitutionStartModal } from '@/components/modals/InstitutionStartModal';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useLogin';
import {
  Building2,
  UserRound,
  Gift,
  CircleCheck,
  Clock,
  Info,
  Lock,
  ChartColumnIncreasing,
  SquarePen,
  UserStar,
  Users,
} from 'lucide-react';

type InstitutionType = 'executive' | 'member' | null;

export default function AssessmentPage() {
  const router = useRouter();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const [institutionType, setInstitutionType] = useState<InstitutionType>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  function handleConfirm(code: string, name: string) {
    if (!institutionType) return;
    const role = institutionType === 'executive' ? 'EXECUTIVE' : 'MEMBER';

    login(
      { institutionCode: code, name, role },
      {
        onSuccess: () => {
          setInstitutionType(null);
          router.push(`/assessment/${institutionType}`);
        },
      },
    );
  }

  return (
    <Container>
      <CompassIcon className="absolute top-[100px] left-1/2 h-[300px] w-[272px] -translate-x-1/2 lg:h-[600px] lg:w-[543px]" />

      <SectionHeader
        title={
          <>
            어떻게 <span className="text-purple-700">AX 진단</span>을 시작하시겠어요?
          </>
        }
        description="개인 역량을 빠르게 확인하거나, 기관 인증코드를 통해 조직 단위의 AX 성숙도·역량 진단을 진행할 수 있습니다."
        as="h2"
      />

      <div>
        <div className="flex w-full flex-wrap gap-4 lg:gap-6 lg:px-[50px]">
          <div className="relative flex h-fit min-w-[340px] flex-1 flex-col py-[40px] lg:min-w-[300px]">
            <div className="absolute top-[40px] left-1/2 flex h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow">
              <UserRound className="size-10 text-purple-700" />
            </div>
            <div className="bg-gray-0 flex w-full flex-1 flex-col items-center gap-[50px] rounded-[30px] px-4 pt-[75px] pb-[50px] shadow">
              <div className="flex flex-col gap-4 text-center">
                <div className="txt-t2 text-black">
                  <span className="text-purple-700">개인 </span> AX 역량 검사
                </div>
                <div className="txt-b-regular flex h-[84px] flex-col justify-center break-keep text-black">
                  회원가입 없이 바로 시작할 수 있는 무료 진단입니다.
                  <br />
                  AI 이해, 활용, 평가·개선, 책임 있는 사용 역량을 기반으로 현재 AX 역량 수준과
                  프로필 유형을 확인합니다.
                </div>
              </div>

              <div className="border-special-dark-blue-300 flex w-full max-w-[600px] flex-col items-center gap-4 rounded-[20px] border bg-white px-3 py-4 shadow lg:py-6">
                <div className="flex items-center gap-2.5">
                  <UserRound className="text-special-dark-blue-500 size-7 lg:size-10" />
                  <Button
                    render={<Link href="/assessment/general" />}
                    nativeButton={false}
                    variant="navy"
                    className="w-[200px]"
                  >
                    개인 검사 시작 →
                  </Button>
                </div>
                <div className="txt-c1-regular text-black">
                  개인의 AX 역량 수준과 프로필 유형을 진단합니다.
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow lg:px-3">
                  <UserRound className="size-4 text-purple-700 lg:size-4" strokeWidth={3} />
                  <span className="txt-c1-regular text-black">회원가입 없이</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow lg:px-3">
                  <Gift className="size-4 text-purple-700 lg:size-4" strokeWidth={3} />
                  <span className="txt-c1-regular text-black">무료 검사</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow lg:px-3">
                  <CircleCheck className="size-4 text-purple-700 lg:size-4" strokeWidth={3} />
                  <span className="txt-c1-regular text-black">즉시 결과 확인</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow lg:px-3">
                  <Clock className="size-4 text-purple-700 lg:size-4" strokeWidth={3} />
                  <span className="txt-c1-regular text-black">약 15분</span>
                </div>
              </div>

              <div className="mt-auto w-full">
                <div className="w-full border-t border-gray-400"></div>

                <div className="mt-4 flex w-full items-center justify-center gap-1.5 text-gray-500">
                  <Info className="size-4 shrink-0" strokeWidth={3} />
                  <span className="txt-c1-regular">
                    개인 검사는 기관 통계에 포함되지 않으며, 개인 결과 확인용으로 제공됩니다.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex min-w-[340px] flex-1 flex-col py-[40px] lg:min-w-[300px]">
            <div className="absolute top-[40px] left-1/2 flex h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow">
              <Building2 className="size-10 text-purple-700" />
            </div>
            <div className="flex w-full flex-1 flex-col items-center gap-[50px] rounded-[30px] bg-white px-4 pt-[75px] pb-[50px] shadow">
              <div className="flex flex-col gap-4 text-center">
                <div className="txt-t2 text-black">
                  <span className="text-purple-700">기관 </span> AX 진단 참여
                </div>
                <div className="txt-b-regular flex h-[84px] flex-col justify-center break-keep text-black">
                  기관에서 발급받은 인증코드를 입력한 뒤, 임원진 또는 구성원 유형에 맞는 검사를
                  진행합니다.
                  <br />
                  검사 결과는 기관 단위 통계와 결과 보고서 분석에 활용됩니다.
                </div>
              </div>

              <div className="flex w-full flex-wrap gap-4">
                <div className="bg-purple-0 flex w-full min-w-[300px] flex-1 flex-col items-center gap-4 rounded-[20px] border border-purple-300 px-2 py-4 shadow lg:min-w-auto lg:px-3 lg:py-6">
                  <div className="flex items-center gap-2.5">
                    <UserStar className="size-7 text-purple-700 lg:size-10" />
                    <Button
                      variant="purple"
                      className="w-[180px] lg:w-[200px]"
                      onClick={() => setInstitutionType('executive')}
                    >
                      임원진 검사 시작 →
                    </Button>
                  </div>
                  <div className="txt-c1-regular text-center text-black">
                    기업의 현재 AX 수준과 목표 AX 수준을 진단합니다.
                  </div>
                </div>
                <div className="border-special-dark-blue-300 bg-special-navy-0 flex w-full min-w-[300px] flex-1 flex-col items-center gap-4 rounded-[20px] border px-2 py-4 shadow lg:min-w-auto lg:px-3 lg:py-6">
                  <div className="flex items-center gap-2.5">
                    <Users className="text-special-navy-500 size-7 lg:size-10" />
                    <Button
                      variant="navy"
                      className="w-[180px] lg:w-[200px]"
                      onClick={() => setInstitutionType('member')}
                    >
                      구성원 검사 시작 →
                    </Button>
                  </div>
                  <div className="txt-c1-regular text-center text-black">
                    구성원의 AX 역량 수준과 프로필 유형을 진단합니다.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                <div className="flex items-center gap-2 rounded-[12px] bg-white p-2 shadow lg:px-3">
                  <Lock className="size-4 text-purple-700 lg:size-4" strokeWidth={3} />
                  <span className="txt-c1-regular text-black">기관코드</span>
                </div>
                <div className="flex items-center gap-2 rounded-[12px] bg-white p-2 shadow lg:px-3">
                  <ChartColumnIncreasing
                    className="size-4 text-purple-700 lg:size-4"
                    strokeWidth={3}
                  />
                  <span className="txt-c1-regular text-black">기관 통계</span>
                </div>
                <div className="flex items-center gap-2 rounded-[12px] bg-white p-2 shadow lg:px-3">
                  <SquarePen className="size-4 text-purple-700 lg:size-4" strokeWidth={3} />
                  <span className="txt-c1-regular text-black">결과 보고서</span>
                </div>
                <div className="flex items-center gap-2 rounded-[12px] bg-white p-2 shadow lg:px-3">
                  <CircleCheck className="size-4 text-purple-700 lg:size-4" strokeWidth={3} />
                  <span className="txt-c1-regular text-black">즉시 결과 확인</span>
                </div>
                <div className="flex items-center gap-2 rounded-[12px] bg-white p-2 shadow lg:px-3">
                  <Clock className="size-4 text-purple-700 lg:size-4" strokeWidth={3} />
                  <span className="txt-c1-regular text-black">약 30분 (임원진 5분)</span>
                </div>
              </div>

              <div className="mt-auto w-full">
                <div className="w-full border-t border-gray-400"></div>

                <div className="mt-4 flex w-full items-center justify-center gap-1.5 text-gray-500">
                  <Info className="size-4 shrink-0" strokeWidth={3} />
                  <span className="txt-c1-regular">
                    기관 인증코드가 없다면, 기관 검사 문의를 통해 안내받을 수 있습니다.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-0 lg:px-[50px]">
          <Button render={<Link href="/" />} nativeButton={false} variant="gray">
            ← 메인으로 돌아가기
          </Button>
          <div className="relative">
            <div className="animate-bounce-up absolute top-full right-0 mt-2.5">
              <div className="border-b-special-pink-600 ml-5.5 h-0 w-0 border-r-8 border-b-10 border-l-8 border-r-transparent border-l-transparent" />
              <div className="txt-c2-bold bg-special-pink-600 flex h-[45px] w-[120px] shrink-0 items-center justify-center rounded-[20px] text-center text-white lg:w-[140px]">
                기관 검사는 문의 후
                <br />
                무료로 시작해 보세요.
              </div>
            </div>
            <Button variant="purple" onClick={() => setInquiryOpen(true)}>
              기관 검사 문의하기 →
            </Button>
          </div>
        </div>
      </div>

      <InstitutionStartModal
        open={institutionType !== null}
        onClose={() => setInstitutionType(null)}
        onConfirm={handleConfirm}
        isLoading={isLoggingIn}
      />
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Container>
  );
}
