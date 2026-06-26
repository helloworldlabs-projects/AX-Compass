'use client';

import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { Button } from '@/components/ui/button';
import { BookOpen, Building2, ChartColumnIncreasing, Check, Gem, Info, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function PricingPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <div className="relative overflow-hidden rounded-t-[20px] px-[10px] py-[75px] lg:rounded-t-[50px] lg:px-[100px]">
          <Image
            src="/images/main/img_bg_report.png"
            alt=""
            fill
            className="absolute inset-0 object-cover"
          />
          <div className="relative flex flex-col gap-6">
            <div className="txt-h2 text-shadow flex gap-1 text-white">
              이용{' '}
              <span className="bg-linear-to-b from-purple-200 to-[#533799] bg-clip-text text-transparent">
                요금
              </span>
            </div>
            <div className="text-white">
              기관의 규모와 결과 확인 방식에 따라 적합한 플랜을 선택하실 수 있습니다.
            </div>
          </div>
        </div>
        <Container className="rounded-t-none!">
          <Section>
            <div className="flex w-full max-w-[1000px]">
              <div className="flex w-full flex-wrap justify-center gap-6">
                <div className="border-special-navy-100 flex max-w-[300px] min-w-[300px] flex-1 flex-col gap-6 rounded-[12px] border bg-white px-3 py-6 lg:max-w-none lg:gap-[30px] lg:px-4 lg:py-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-0 flex size-7 shrink-0 items-center justify-center rounded-full lg:size-[50px]">
                      <ChartColumnIncreasing className="size-8 shrink-0 text-purple-700" />
                    </div>
                    <div className="txt-st2-bold">기본 플랜</div>
                  </div>
                  <div className="mx-auto flex w-fit flex-col gap-2">
                    <div className="txt-st-regular">1인당</div>
                    <div className="flex items-end gap-1">
                      <span className="txt-t1">7,900</span>
                      <span className="txt-t3">원</span>
                    </div>
                  </div>
                  <div className="bg-purple-0 txt-b-bold mx-auto w-fit rounded-[12px] border border-purple-100 px-2 py-1 text-purple-700">
                    결과 데이터 7일간 조회
                  </div>
                  <div className="h-px w-full bg-purple-300" />
                  <div className="flex flex-col gap-3 lg:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">기본 결과 통계 제공</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">간단한 현황 확인에 적합</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-pink-600">
                        <X className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">결과 분석 보고서 미제공</div>
                    </div>
                  </div>
                  <Button
                    variant="purple"
                    className="mx-auto mt-auto h-[60px] w-fit"
                    onClick={() => setOpen(true)}
                  >
                    이용 문의하기
                  </Button>
                </div>
                <div className="relative flex max-w-[300px] min-w-[300px] flex-1 flex-col gap-6 overflow-hidden rounded-[12px] border-3 border-purple-700 bg-white px-3 py-6 lg:max-w-none lg:gap-[30px] lg:px-4 lg:py-8">
                  <div className="txt-b-bold absolute top-0 right-0 w-[60px] rounded-bl-[12px] bg-purple-700 text-center text-white">
                    추천
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-0 flex size-7 shrink-0 items-center justify-center rounded-full lg:size-[50px]">
                      <Gem className="size-8 shrink-0 text-purple-700" />
                    </div>
                    <div className="txt-st2-bold">프리미엄 플랜</div>
                  </div>
                  <div className="mx-auto flex w-fit flex-col gap-2">
                    <div className="txt-st-regular">1인당</div>
                    <div className="flex items-end gap-1">
                      <span className="txt-t1">27,900</span>
                      <span className="txt-t3">원</span>
                    </div>
                  </div>
                  <div className="bg-purple-0 txt-b-bold mx-auto w-fit rounded-[12px] border border-purple-100 px-2 py-1 text-purple-700">
                    결과 데이터 영구 조회
                  </div>
                  <div className="h-px w-full bg-purple-300" />
                  <div className="flex flex-col gap-3 lg:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">기본 결과 통계 제공</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">기관 결과 분석 리포트 제공</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">100명 미만 기관 대상</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">소속별 결과 확인 및 활용에 적합</div>
                    </div>
                  </div>
                  <Button
                    variant="purple"
                    className="mx-auto h-[60px] w-fit"
                    onClick={() => setOpen(true)}
                  >
                    이용 문의하기
                  </Button>
                </div>
                <div className="border-special-navy-100 flex max-w-[300px] min-w-[300px] flex-1 flex-col gap-6 rounded-[12px] border bg-white px-3 py-6 lg:max-w-none lg:gap-[30px] lg:px-4 lg:py-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-0 flex size-7 shrink-0 items-center justify-center rounded-full lg:size-[50px]">
                      <Building2 className="size-8 shrink-0 text-purple-700" />
                    </div>
                    <div className="txt-st2-bold">맞춤 플랜</div>
                  </div>
                  <div className="txt-t2 flex h-[141px] flex-col items-center justify-center gap-2 text-center lg:h-[162px]">
                    100명 이상
                    <br />
                    기관 별도 협의
                  </div>
                  <div className="h-px w-full bg-purple-300" />
                  <div className="flex flex-col gap-3 lg:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">기관 규모에 맞춘 맞춤 요금 제안</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">결과 제공 범위와 지원 방식 협의</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
                        <Check className="size-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="txt-b-regular">전용 상담과 진행 지원</div>
                    </div>
                  </div>
                  <Button
                    variant="dark-blue"
                    className="mx-auto mt-auto h-[60px] w-fit"
                    onClick={() => setOpen(true)}
                  >
                    맞춤 문의하기
                  </Button>
                </div>
              </div>
            </div>
          </Section>
          <Section>
            <div className="flex w-full max-w-[1000px] flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-3 self-start">
                <BookOpen className="size-8" />
                <div className="txt-st-bold">플랜 비교</div>
              </div>
              <div className="rounded-card w-full overflow-hidden shadow">
                <table className="w-full">
                  <thead className="bg-special-dark-blue-700 flex w-full items-center border-b border-gray-300">
                    <tr className="txt-b-bold flex-1 shrink-0 px-4 py-3 text-center text-white">
                      구분
                    </tr>
                    <tr className="txt-b-bold flex-1 shrink-0 px-4 py-3 text-center text-white">
                      기본 플랜
                    </tr>
                    <tr className="txt-b-bold flex-1 shrink-0 px-4 py-3 text-center text-white">
                      프리미엄 플랜
                    </tr>
                    <tr className="txt-b-bold flex-1 shrink-0 px-4 py-3 text-center text-white">
                      맞춤 플랜
                    </tr>
                  </thead>
                  <tbody className="w-full items-center">
                    <tr className="flex w-full items-center border-b border-gray-100">
                      <td className="txt-b-bold flex-1 px-4 py-3 text-center text-gray-700">
                        결과 데이터 공개 시간
                      </td>
                      <td className="txt-b-regular flex-1 px-4 py-3 text-center text-gray-500">
                        7일 공개
                      </td>
                      <td className="txt-b-bold flex-1 px-4 py-3 text-center text-purple-700">
                        영구 공개
                      </td>
                      <td className="txt-b-regular flex-1 px-4 py-3 text-center text-gray-500">
                        별도 협의
                      </td>
                    </tr>
                    <tr className="flex w-full items-center border-b border-gray-100">
                      <td className="txt-b-bold flex-1 px-4 py-3 text-center text-gray-700">
                        기본 결과 통계
                      </td>
                      <td className="txt-b-regular flex-1 px-4 py-3 text-center text-gray-500">
                        제공
                      </td>
                      <td className="txt-b-bold flex-1 px-4 py-3 text-center text-purple-700">
                        제공
                      </td>
                      <td className="txt-b-regular flex-1 px-4 py-3 text-center text-gray-500">
                        제공
                      </td>
                    </tr>
                    <tr className="flex w-full items-center border-b border-gray-100">
                      <td className="txt-b-bold flex-1 px-4 py-3 text-center text-gray-700">
                        결과 분석 리포트
                      </td>
                      <td className="txt-b-regular flex-1 px-4 py-3 text-center text-gray-500">
                        미제공
                      </td>
                      <td className="txt-b-bold flex-1 px-4 py-3 text-center text-purple-700">
                        제공
                      </td>
                      <td className="txt-b-regular flex-1 px-4 py-3 text-center text-gray-500">
                        제공
                      </td>
                    </tr>
                    <tr className="flex w-full items-center">
                      <td className="txt-b-bold flex-1 px-4 py-3 text-center text-gray-700">
                        대상
                      </td>
                      <td className="txt-b-regular flex-1 px-4 py-3 text-center text-gray-500">
                        간단한 현황 확인이 필요한 기관
                      </td>
                      <td className="txt-b-bold flex-1 px-4 py-3 text-center text-purple-700">
                        100명 미만 기관
                      </td>
                      <td className="txt-b-regular flex-1 px-4 py-3 text-center text-gray-500">
                        100명 이상 기관
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
          <Section>
            <div className="flex w-full max-w-[1000px] flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-3 self-start">
                <Info className="size-8" />
                <div className="txt-st-bold">안내 사항</div>
              </div>
              <div className="rounded-card border-special-navy-100 flex w-full flex-col gap-4 overflow-hidden border bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap">
                  <ul className="txt-b-regular min-w-0 flex-1 basis-[min(100%,280px)] list-outside list-disc pl-5">
                    <li>이용 요금은 검사 참여 인원 기준으로 산정됩니다.</li>
                    <li>결과 조회 기간은 검사 종료 시점을 기준으로 적용됩니다.</li>
                    <li>프리미엄 플랜은 100명 미만 기관에 적용됩니다.</li>
                    <li>100명 이상 기관은 별도 문의를 통해 맞춤 제안을 받을 수 있습니다.</li>
                  </ul>
                  <div className="flex basis-full justify-center lg:shrink-0 lg:basis-auto">
                    <Button
                      variant="purple"
                      className="h-[60px] w-fit"
                      onClick={() => setOpen(true)}
                    >
                      검사 문의하기
                    </Button>
                  </div>
                </div>
                <div className="h-px w-full bg-purple-300" />
              </div>
            </div>
          </Section>
        </Container>
      </div>
      <InquiryModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
