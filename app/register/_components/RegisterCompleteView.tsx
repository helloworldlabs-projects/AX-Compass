'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, CircleCheck, Gift, KeyRound, UserPlus, Users, UserStar } from 'lucide-react';

import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/SectionHeader';

const MANUAL_URL =
  'https://helloworldlabs-1.gitbook.io/helloworldlabs-manual/IEjzBMwL1CRDQtU4u05j/ax-compass';
const KAKAO_CHANNEL_ID = '_hJJnX';

const ONBOARDING_STEPS = [
  {
    step: 1,
    icon: UserPlus,
    title: '검사 대상자 등록',
    description: '기관 관리 페이지에서 구성원과 임원진을 구분해 검사 대상자로 등록합니다.',
  },
  {
    step: 2,
    icon: KeyRound,
    title: '기관 코드 안내',
    description:
      '검사 대상자에게 기관 코드를 안내합니다. 기관 코드는 기관 관리 페이지에서 확인할 수 있습니다.',
  },
  {
    step: 3,
    icon: BarChart3,
    title: '결과 및 통계 확인',
    description: '개인별 검사 결과와 기관 단위 통계 결과를 확인합니다.',
  },
  {
    step: 4,
    icon: Gift,
    title: '교육·컨설팅 문의',
    description:
      '진단 결과를 기반으로 AX 교육·컨설팅 방향을 문의하고 후속 실행 계획을 상담할 수 있습니다.',
  },
] as const;

const TEST_TYPES = [
  {
    icon: Users,
    color: 'special-dark-blue-700',
    bg: 'bg-special-dark-blue-0',
    border: 'border-special-dark-blue-100',
    title: '구성원 검사',
    description: '구성원의 AX 역량 수준과 프로필 유형을 진단합니다.',
    target: '일반 구성원',
    purpose: '개인별 AX 역량 수준 진단 및 역량 개발 ',
  },
  {
    icon: UserStar,
    color: 'purple-700',
    bg: 'bg-purple-0',
    border: 'border-special-navy-100',
    title: '임원진 검사',
    description: '기업의 현재 AX 수준과 목표 AX 수준을 진단합니다.',
    target: '임원진 및 리더급',
    purpose: '조직 AX 성숙도 진단 및 목표 수준 수립',
  },
] as const;

const ADMIN_FEATURES = [
  {
    title: '구성원 관리',
    description: 'AX 역량 검사 대상 구성원 등록, 수정, 일괄 등록, 검사 상태 확인',
  },
  {
    title: '임원진 관리',
    description: 'AX 성숙도 검사 대상 임원진 등록, 수정, 일괄 등록, 검사 상태 확인',
  },
  {
    title: '검사 운영 관리',
    description: '검사 운영 상태 확인, 검사 진행 여부 및 응답 현황 관리',
  },
  {
    title: '결과 및 통계',
    description: '구성원 검사 결과, 임원진 검사 결과, 기관 단위 통계 확인',
  },
] as const;

function handleKakaoChat() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kakao = (window as any).Kakao;
  if (kakao) {
    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    }
    kakao.Channel.chat({ channelPublicId: KAKAO_CHANNEL_ID });
    return;
  }
  window.open(`http://pf.kakao.com/${KAKAO_CHANNEL_ID}/chat`, '_blank');
}

export function RegisterCompleteView() {
  return (
    <div className="mx-auto flex w-full max-w-[1416px] flex-col gap-[50px] lg:gap-[75px]">
      <Section className="py-0 lg:py-0">
        <SectionHeader
          as="h1"
          title={
            <>
              기관·운영자 등록이 <span className="text-purple-700">완료</span>되었습니다
            </>
          }
          description="이제 AX Compass에서 검사 대상자 등록, 검사 운영, 결과 확인까지 순서대로 진행해 보세요."
        />
      </Section>

      <Section className="rounded-card mx-auto max-w-[1000px] bg-white px-6 py-[30px] shadow">
        <div className="flex w-full flex-col gap-6">
          <div className="txt-st2-bold">처음 이용 시 이렇게 진행하세요</div>
          <div className="flex w-full flex-wrap justify-center gap-6">
            {ONBOARDING_STEPS.map(({ step, icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-card border-special-dark-blue-300 flex max-w-[400px] min-w-[292px] flex-1 flex-col items-center gap-4 border bg-white px-6 py-4"
              >
                <div className="flex size-[50px] items-center justify-center gap-3 rounded-full shadow">
                  <Icon className="size-8 text-purple-700" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="txt-b-bold flex size-[30px] shrink-0 items-center justify-center rounded-full bg-purple-700 text-white">
                    {step}
                  </span>
                  <span className="txt-b-bold">{title}</span>
                </div>
                <p className="txt-b-regular text-center">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="rounded-card mx-auto mt-[30px] max-w-[1000px] bg-white px-6 py-[30px] shadow">
        <div className="absolute top-[-55px] left-1/2 -translate-x-1/2">
          <div className="relative inline-block">
            <div className="txt-b-bold border-special-pink-200 bg-special-pink-600 flex h-[68px] w-[160px] items-center justify-center rounded-[20px] border-2 text-center text-white">
              프리미엄 플랜
              <br />
              무료 지원 중!
            </div>
            <div className="border-special-pink-200 bg-special-pink-600 absolute -bottom-[10px] left-1/2 size-5 -translate-x-1/2 rotate-45 border-r-2 border-b-2" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-6">
          <div className="txt-st2-bold">검사 유형 한 눈에 보기</div>
          <div className="flex w-full flex-wrap justify-center gap-6">
            {TEST_TYPES.map(
              ({ icon: Icon, color, bg, border, title, description, target, purpose }) => (
                <div
                  key={title}
                  className="rounded-card border-special-dark-blue-100 flex max-w-[400px] min-w-[298px] flex-1 flex-col overflow-hidden border bg-white lg:max-w-none lg:min-w-[400px]"
                >
                  <div className={`flex items-center gap-6 p-6 ${bg}`}>
                    <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-white shadow lg:size-[75px]">
                      <Icon className={`size-8 lg:size-10 text-${color}`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className={`txt-st2-bold text-${color}`}>{title}</div>
                      <p className="txt-b-regular">{description}</p>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <tbody>
                      <tr className={`${border} border-t border-b`}>
                        <th scope="row" className={`txt-b-bold w-[120px] p-6 text-center ${bg}`}>
                          대상
                        </th>
                        <td className="txt-b-regular p-6 text-center">{target}</td>
                      </tr>
                      <tr>
                        <th scope="row" className={`txt-b-bold w-[120px] p-6 text-center ${bg}`}>
                          목적
                        </th>
                        <td className="txt-b-regular p-6 text-center">{purpose}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ),
            )}
          </div>
          <div className="bg-special-dark-blue-100 h-px w-full" />
          <div className="flex w-full flex-col gap-6">
            <div className="txt-st2-bold">관리자 화면에서 할 수 있는 일</div>
            <div className="mx-auto flex w-full max-w-[700px] flex-col gap-3">
              {ADMIN_FEATURES.map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-card flex items-start gap-3 border border-gray-100 bg-white p-3 shadow lg:px-[50px]"
                >
                  <div className="flex shrink-0 items-center gap-3">
                    <CircleCheck className="text-special-pink-600 size-6 shrink-0" />
                    <div className="txt-b-bold">{title}</div>
                  </div>
                  <p className="txt-b-regular text-center">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="txt-b-regular text-center text-gray-700">
            더 자세한 내용은{' '}
            <Link
              href={MANUAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="txt-b-bold text-special-pink-600 underline"
            >
              기관 관리 매뉴얼
            </Link>
            에서 확인해 주세요.
          </p>
        </div>
      </Section>

      <Section className="rounded-card mx-auto mt-[30px] max-w-[1000px] bg-white px-6 py-[30px] shadow">
        <div className="flex items-center gap-6">
          <p className="txt-b-regular">
            궁금하신 내용은 카카오 1:1 대화를 통해 언제든지 편하게 문의 주세요.
          </p>
          <button
            type="button"
            onClick={handleKakaoChat}
            className="txt-c1-bold text-shadow flex h-[32px] w-[80px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[15px] bg-yellow-500 text-gray-900 shadow"
          >
            <span className="relative block size-3">
              <Image src="/images/logo/img_union.png" alt="" fill className="object-contain" />
            </span>
            시작하기
          </button>
        </div>
      </Section>
      <Button
        render={<Link href="/institution" />}
        variant="purple"
        className="mx-auto h-[60px] w-fit"
      >
        관리자 화면으로 이동 →
      </Button>
    </div>
  );
}
