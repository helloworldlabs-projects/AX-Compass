import Section from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CircleCheck, GraduationCap, Landmark, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function TestimonialSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            <span className="text-purple-700">AX Compass</span>의 생생한 현장 이야기
          </>
        }
        description="실제 기관 담당자의 경험을 통해 AX 역량 진단의 활용 가치를 확인해 보세요."
      />
      <div className="flex flex-col gap-[30px]">
        <div className="flex max-w-[1470px] flex-wrap gap-[30px]">
          <div className="border-special-navy-100 flex h-fit min-w-[340px] flex-1 flex-col gap-6 rounded-[20px] border bg-white p-6 lg:min-w-[500px] lg:gap-[30px] lg:p-[50px]">
            <Quote
              className="size-[40px] rotate-180 lg:size-[60px]"
              fill="#c0a0fc"
              stroke="#c0a0fc"
              strokeWidth={1}
            />
            <div className="txt-t3">
              우리 기관의 현재 AI/AX 역량을
              <br />
              객관적으로 진단하고,
              <br />
              <span className="text-purple-700">실행 우선순위와 교육 방향</span>을<br />
              명확히 정할 수 있었습니다.
            </div>
            <div className="h-px w-full bg-purple-300" />
            <div className="flex gap-2 lg:gap-6">
              <div className="bg-purple-0 relative h-[85px] w-[85px] shrink-0 overflow-hidden rounded-full lg:h-[220px] lg:w-[220px]">
                <Image src="/images/main/img_person.png" alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="bg-purple-0 txt-b-bold w-fit rounded-[12px] border border-purple-100 px-2 py-1 text-purple-700">
                  제조업
                </div>
                <div className="txt-t3">인재개발팀 책임자</div>
                <div className="txt-b-regular">
                  AX Compass 진단 결과를 통해 부서별 AI 활용 역량 수준과 차이를 한눈에 파악할 수
                  있었습니다.
                  <br />
                  특히 직무별 강점과 보완이 필요한 영역을 구체적으로 확인할 수 있어, 교육 대상을
                  명확하게 구분하고 우선순위를 설정하는 데 도움이 되었습니다.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-special-dark-blue-0 txt-b-bold border-special-dark-blue-100 text-special-dark-blue-700 w-fit rounded-[12px] border px-2 py-1">
                직무별 역량 분석
              </div>
              <div className="bg-special-dark-blue-0 txt-b-bold border-special-dark-blue-100 text-special-dark-blue-700 w-fit rounded-[12px] border px-2 py-1">
                교육 우선순위 설정
              </div>
              <div className="bg-special-dark-blue-0 txt-b-bold border-special-dark-blue-100 text-special-dark-blue-700 w-fit rounded-[12px] border px-2 py-1">
                실행 과제 도출
              </div>
            </div>
          </div>
          <div className="flex min-w-[340px] flex-1 flex-col gap-[30px] lg:min-w-[500px]">
            <div className="border-special-navy-100 flex h-fit flex-1 flex-col gap-6 rounded-[20px] border bg-white p-6 lg:gap-[30px]">
              <Quote
                className="size-[30px] rotate-180"
                fill="#c0a0fc"
                stroke="#c0a0fc"
                strokeWidth={1}
              />
              <div className="txt-st-bold">
                진단 결과를 활용해 조직 현황을 설명하고
                <br />
                <span className="text-purple-700">내부 공감대와 추진 근거</span>를 확보할 수<br />
                있었습니다.
              </div>
              <div className="h-px w-full bg-purple-300" />
              <div className="flex items-start gap-3 lg:gap-6">
                <div className="bg-purple-0 flex size-[50px] shrink-0 items-center justify-center rounded-full lg:size-[75px]">
                  <Landmark className="size-9 text-purple-700 lg:size-[50px]" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 lg:gap-4">
                    <div className="bg-purple-0 txt-b-bold w-fit rounded-[12px] border border-purple-100 px-2 py-1 text-purple-700">
                      공공기관
                    </div>
                    <div className="txt-st-bold">기획예산팀 담당자</div>
                  </div>
                  <div>
                    정량적 진단 결과를 바탕으로 기관의 AX 수준을 객관적으로 설명할 수 있었고, 내부
                    보고와 향후 추진 방향 설정의 근거를 마련할 수 있었습니다.
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="bg-special-dark-blue-0 txt-b-bold border-special-dark-blue-100 text-special-dark-blue-700 w-fit rounded-[12px] border px-2 py-1">
                      조직 현황 진단
                    </div>
                    <div className="bg-special-dark-blue-0 txt-b-bold border-special-dark-blue-100 text-special-dark-blue-700 w-fit rounded-[12px] border px-2 py-1">
                      내부 공감대 형성
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-special-navy-100 flex h-fit flex-1 flex-col gap-6 rounded-[20px] border bg-white p-6 lg:gap-[30px]">
              <Quote
                className="size-[30px] rotate-180"
                fill="#c0a0fc"
                stroke="#c0a0fc"
                strokeWidth={1}
              />
              <div className="txt-st-bold">
                프로그램 우선순위를 정하고,
                <br />
                보다 체계적인
                <span className="text-purple-700">개선 계획</span>을 수립하는 데<br />
                도움이 되었습니다.
              </div>
              <div className="h-px w-full bg-purple-300" />
              <div className="flex items-start gap-3 lg:gap-6">
                <div className="bg-purple-0 flex size-[50px] shrink-0 items-center justify-center rounded-full lg:size-[75px]">
                  <GraduationCap className="size-9 text-purple-700 lg:size-[50px]" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 lg:gap-4">
                    <div className="bg-purple-0 txt-b-bold w-fit rounded-[12px] border border-purple-100 px-2 py-1 text-purple-700">
                      평생교육기관
                    </div>
                    <div className="txt-st-bold">교육기획팀 팀장</div>
                  </div>
                  <div>
                    진단 결과를 통해 기관의 현재 역량 수준과 보완 영역을 확인하고, 교육 프로그램의
                    개선 방향과 운영 우선순위를 구체적으로 정리할 수 있었습니다.
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="bg-special-dark-blue-0 txt-b-bold border-special-dark-blue-100 text-special-dark-blue-700 w-fit rounded-[12px] border px-2 py-1">
                      프로그램 개선
                    </div>
                    <div className="bg-special-dark-blue-0 txt-b-bold border-special-dark-blue-100 text-special-dark-blue-700 w-fit rounded-[12px] border px-2 py-1">
                      운영 방향 정비
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 text-purple-700">
          <CircleCheck className="size-[21px] lg:size-6" />
          <Link
            href="https://blog.naver.com/helloworldlabs_"
            target="_blank"
            rel="noopener noreferrer"
            className="txt-b-regular underline"
          >
            더 많은 정보와 리뷰는 블로그에서 확인하실 수 있습니다. →
          </Link>
        </div>
      </div>
    </Section>
  );
}
