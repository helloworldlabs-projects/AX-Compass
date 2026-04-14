import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { CurriculumItem } from '@/components/ui/CurriculumItem';
import { ProfileResultCard } from '@/components/ui/ProfileResultCard';
import { BadgeCheck, Check, ContactRound, HelpCircle, Map, Trophy, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MaturityLevelCard } from './_components/MaturityLevelCard';

export default function InstitutionPage() {
  return (
    <Container>
      <Section className="flex w-[700px] shrink-0">
        <div className="txt-t1 flex w-full">{'기관명'}</div>
        <div className="flex w-full items-center gap-4">
          <Users className="size-10 text-purple-700" />
          <span className="txt-t1 text-black">전체 평가 인원</span>
        </div>
        <div className="flex gap-[50px]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-[130px] w-[300px] items-center justify-center rounded-[20px] border-3 border-gray-300 shadow">
              <span className="bg-special-dark-blue-500 absolute top-[-3px] left-[-3px] rounded-[20px] border-3 border-gray-300 px-2.5 py-2 text-white">
                임원진
              </span>
              <div className="txt-t1 text-black">{'2/3'}명</div>
            </div>
            <Button
              render={<Link href="/institution/executive" />}
              variant="dark-blue"
              size="pill"
              className="w-fit rounded-[12px]"
            >
              상세 보기
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-[130px] w-[300px] items-center justify-center rounded-[20px] border-3 border-gray-300 shadow">
              <span className="bg-special-navy-500 absolute top-[-3px] left-[-3px] rounded-[20px] border-3 border-gray-300 px-2.5 py-2 text-white">
                구성원
              </span>
              <div className="txt-t1 text-black">{'0/25'}명</div>
            </div>
            <Button
              render={<Link href="/institution/member" />}
              variant="navy"
              size="pill"
              className="w-fit rounded-[12px]"
            >
              상세 보기
            </Button>
          </div>
        </div>
      </Section>
      <Section className="max-w-[1000px] shrink-0">
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
      <Section className="max-w-[1000px] shrink-0">
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
            <span>발급일: 2026.03.13</span>
            <div>|</div>
            <span>결과 코드: 7F3K2Q9M</span>
            <div>|</div>
            <span>발급 기관: (주)헬로월드랩스</span>
          </div>
        </div>
      </Section>
      <Section className="w-[700px] shrink-0">
        <div className="flex w-full flex-col items-start">
          <div className="txt-t1">헬로월드랩스</div>
          <span className="txt-st2-regular">기관 AX 진단 결과 입니다.</span>
        </div>
        <div className="flex items-center gap-[50px]">
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-purple-300 bg-purple-700 py-5 shadow">
            <div className="flex items-center gap-1 text-white">
              <BadgeCheck className="size-5 text-purple-700" fill="white" />
              <span className="txt-b-bold">현재 성숙도 수준</span>
            </div>
            <div className="txt-t2 text-white">{'도입'}</div>
          </div>
          <div className="border-special-pink-200 bg-special-pink-600 flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 py-5 shadow">
            <div className="flex items-center gap-1 text-white">
              <BadgeCheck className="text-special-pink-600 size-5" fill="white" />
              <span className="txt-b-bold">목표 성숙도 수준</span>
            </div>
            <div className="txt-t2 text-white">{'통합'}</div>
          </div>
        </div>
        <div className="boder-gray-500 flex flex-col gap-[30px] rounded-[20px] border bg-white p-[50px] shadow">
          <MaturityLevelCard type="INITIATION" />
          <MaturityLevelCard type="INTEGRATION" />
        </div>
      </Section>
      <Section className="max-w-[1000px] shrink-0">
        <div className="flex w-full flex-col gap-[30px]">
          <div className="h-[330px] w-full px-[50px]">그래프 영역</div>
          <div className="w-[700px]">
            <div className="txt-st-bold">
              <span className="text-purple-700">* </span>
              Gap_MS (CMS − TMS)
            </div>
            <div>
              현재 성숙도(Current Maturity Stage)와 목표 성숙도(Target Maturity Stage)의 차이입니다.
              <br />
              <span className="txt-b-bold text-green-600">[양수(+)]</span> 현재 성숙도가 목표
              성숙도보다 높아, 현재 수준 대비 보수적인 목표를 두거나 향후 추진 방향을 낮게 설정하는
              경향이 있습니다.
              <br />
              <span className="txt-b-bold text-red-500">[음수(−)]</span> 현재 성숙도가 목표
              성숙도보다 낮아, 현재 수준을 넘어 더 높은 단계로의 성장과 고도화를 기대하는 경향이
              있습니다.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
          {/* 이해(Understand) */}
          <div className="flex w-[500px] flex-col">
            <div className="txt-st-bold text-center">현재 영역별 성숙도</div>
            <div className="flex flex-col gap-5">
              <div className="h-[500px] w-full">그래프 영역</div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>전략·리더십
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${80}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'80'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>운영체계·확산
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>업무 적용
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>데이터·시스템 기반
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 활용(Use & Apply) */}
          <div className="flex w-[500px] flex-col">
            <div className="txt-st-bold text-center">목표 영역별 성숙도</div>
            <div className="flex flex-col gap-5">
              <div className="h-[500px] w-full">그래프 영역</div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>전략·리더십
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${80}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'80'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>운영체계·확산
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>업무 적용
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>데이터·시스템 기반
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[20px] border border-gray-500 bg-white px-[50px] py-[30px] shadow">
          <div className="txt-st-bold">
            <span className="text-purple-700">* </span>
            검사 결과 요약
          </div>
          <ul className="list-outside list-decimal pl-5 text-black marker:text-black">
            <li>
              현재 우리 조직의 AX 성숙도는 <span className="txt-b-bold">{'도입(Initiation)'}</span>
              단계 이며, 목표 성숙도는 <span className="txt-b-bold">{'통합(Integration)'}</span>단계
              입니다.
            </li>
            <li>
              현재 성숙도가 목표 성숙도보다 충분히 낮아, 현재 수준을 넘어 더 높은 단계로의 성장과
              고도화를 기대하는 경향이 확인되었습니다.
            </li>
            <li>
              현재와 목표 간 차이에서는{' '}
              <span className="txt-b-bold">{'업무 적용, 데이터·시스템 기반'}</span> 영역의 우선 개선
              필요성이 크게 나타났습니다.
            </li>
            <li>
              목표 단계 도달을 위해{' '}
              <span className="txt-b-bold">
                {'실무 적용 중심의 학습과 반복 가능한 활용 사례 확보가 필요합니다.'}
              </span>
            </li>
          </ul>
        </div>
      </Section>
      <Section className="max-w-[1000px] shrink-0">
        <div className="flex w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <BadgeCheck className="size-10 text-white" fill="#533699" />
            <span className="txt-t1">역량 등급 통계</span>
          </div>
          <HelpCircle className="text-special-dark-blue-900 size-9" />
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-red-300 bg-red-500 py-5 text-white">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5 text-red-500" fill="white" />
              <span className="txt-b-bold">이해</span>
            </div>
            <div className="txt-t2">{'등급'}</div>
          </div>
          <div className="border-special-blue-300 bg-special-blue-500 flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 py-5 text-white">
            <div className="flex items-center gap-1">
              <BadgeCheck className="text-special-blue-500 size-5" fill="white" />
              <span className="txt-b-bold">활용</span>
            </div>
            <div className="txt-t2">{'등급'}</div>
          </div>
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-purple-300 bg-purple-700 py-5 text-white">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5 text-purple-700" fill="white" />
              <span className="txt-b-bold">평가·개선</span>
            </div>
            <div className="txt-t2">{'등급'}</div>
          </div>
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-gray-300 bg-gray-700 py-5 text-white">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5 text-gray-700" fill="white" />
              <span className="txt-b-bold">책임·거버넌스</span>
            </div>
            <div className="txt-t2">{'등급'}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
          <div className="w-[500px] bg-white">
            <div>이해 (Understand)</div>
            <div className="h-[400px] w-full"></div>
          </div>
          <div className="w-[500px] bg-white">
            <div>활용 (Use & Apply)</div>
            <div className="h-[400px] w-full"></div>
          </div>
          <div className="w-[500px] bg-white">
            <div>평가·개선 (Evaluate & Improve)</div>
            <div className="h-[400px] w-full"></div>
          </div>
          <div className="w-[500px] bg-white">
            <div>책임·거버넌스 (Responsible Use)</div>
            <div className="h-[400px] w-full"></div>
          </div>
        </div>
      </Section>
      <Section className="max-w-[1000px] shrink-0">
        <div className="flex w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <BadgeCheck className="size-10 text-white" fill="#533699" />
            <span className="txt-t1">역량 점수 통계(전체 평균)</span>
          </div>
          <HelpCircle className="text-special-dark-blue-900 size-9" />
        </div>
        <div className="flex w-full flex-col gap-[30px]">
          <div className="h-[640px] w-full">그래프 영역</div>
          <div className="mx-auto flex w-[700px] flex-col gap-6">
            <div>
              <div className="txt-st-bold">
                <span className="text-purple-700">* </span>
                Gap_SR (SE − SJ)
              </div>
              <div>
                자기평가(Self-Estimate)와 상황판단(Situational Judgment)의 차이입니다.
                <br />
                <span className="txt-b-bold text-green-600">[양수(+)]</span> 자기평가가 상황판단보다
                높아, 자신감이 실제 판단보다 앞서는 경향이 있습니다.
                <br />
                <span className="txt-b-bold text-red-500">[음수(−)]</span> 상황판단이 자기평가보다
                높아, 스스로를 보수적으로 평가하거나 실제 판단이 더 강한 경향이 있습니다.
              </div>
            </div>
            <div>
              <div className="txt-st-bold">
                <span className="text-purple-700">* </span>
                Gap_SB (SJ − BH)
              </div>
              <div>
                상황판단(Situational Judgment)과 행동빈도(Behavior Habit)의 차이입니다.
                <br />
                <span className="txt-b-bold text-green-600">[양수(+)]</span> 상황판단이 행동빈도보다
                높아, 판단은 좋지만 실사용/실행이 부족한 경향이 있습니다.
                <br />
                <span className="txt-b-bold text-red-500">[음수(−)]</span> 행동빈도가 상황판단보다
                높아, 실행은 많지만 판단·검증이 따라오지 않을 수 있는 경향이 있습니다.
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
          {/* 이해(Understand) */}
          <div className="flex w-[500px] flex-col">
            <div className="txt-st-bold text-center">이해(Understand)</div>
            <div className="flex flex-col gap-5">
              <div className="h-[500px] w-full">그래프 영역</div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>AI/LLM 작동 원리 이해 역량
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${80}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'80'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>생성형 AI 오류·리스크 이해 역량
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>컨텍스트·제약에 따른 결과 변동
                    이해 역량
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 활용(Use & Apply) */}
          <div className="flex w-[500px] flex-col">
            <div className="txt-st-bold text-center">활용(Use & Apply)</div>
            <div className="flex flex-col gap-5">
              <div className="h-[500px] w-full">그래프 영역</div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>프롬프트·요구사항 명세화 역량
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${80}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'80'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>업무 유스케이스 선정·적용 설계
                    역량
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>워크플로우·도구 조합 운영 역량
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 평가·개선(Evaluate & Improve) */}
          <div className="flex w-[500px] flex-col">
            <div className="txt-st-bold text-center">평가·개선 (Evaluate & Improve)</div>
            <div className="flex flex-col gap-5">
              <div className="h-[500px] w-full">그래프 영역</div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-purple-500">* </span>AI 출력 사실·근거 검증 역량
                  </div>
                  <div
                    className="relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3 border-purple-500"
                    style={{ '--progress': `${80}%` } as React.CSSProperties}
                  >
                    <div className="absolute inset-y-0 left-0 h-full w-(--progress) bg-purple-500/20" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'80'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-purple-500">* </span>AI 결과 품질 기준 평가 역량
                  </div>
                  <div
                    className="relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3 border-purple-500"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="absolute inset-y-0 left-0 h-full w-(--progress) bg-purple-500/20" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-purple-500">* </span>실험·피드백 기반 반복 개선 역량
                  </div>
                  <div
                    className="relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3 border-purple-500"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="absolute inset-y-0 left-0 h-full w-(--progress) bg-purple-500/20" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 책임·거버넌스(Responsible Use) */}
          <div className="flex w-[500px] flex-col">
            <div className="txt-st-bold text-center">책임·거버넌스 (Responsible Use)</div>
            <div className="flex flex-col gap-5">
              <div className="h-[500px] w-full">그래프 영역</div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-gray-700">* </span>AI 데이터 보안·개인정보 처리 역량
                  </div>
                  <div
                    className="relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3 border-gray-700"
                    style={{ '--progress': `${80}%` } as React.CSSProperties}
                  >
                    <div className="absolute inset-y-0 left-0 h-full w-(--progress) bg-gray-700/20" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'80'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-gray-700">* </span>AI 저작권·윤리 리스크 대응 역량
                  </div>
                  <div
                    className="relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3 border-gray-700"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="absolute inset-y-0 left-0 h-full w-(--progress) bg-gray-700/20" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-gray-700">* </span>AI 운영 거버넌스 준수 역량
                  </div>
                  <div
                    className="relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3 border-gray-700"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="absolute inset-y-0 left-0 h-full w-(--progress) bg-gray-700/20" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section className="max-w-[700px] shrink-0">
        <div className="flex w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <ContactRound className="size-10 text-purple-700" />
            <span className="txt-t1">프로필 유형 통계</span>
          </div>
          <HelpCircle className="text-special-dark-blue-900 size-9" />
        </div>
        <div className="h-[500px] w-[500px]">그래프 영역</div>
        <div className="flex items-center justify-center gap-4">
          <Button
            className="flex h-fit w-[160px] flex-col gap-2.5 py-5 text-white"
            variant="purple"
          >
            <div className="flex items-center gap-1">
              <Trophy className="size-4.5" />
              <span className="txt-b-bold">1순위</span>
            </div>
            <div className="txt-t2">{'균형형'}</div>
          </Button>
          <Button className="flex h-fit w-[160px] flex-col gap-2.5 py-5 text-white" variant="gray">
            <div className="flex items-center gap-1">
              <Trophy className="size-4.5" />
              <span className="txt-b-bold">2순위</span>
            </div>
            <div className="txt-t2">{'실행형'}</div>
          </Button>
          <Button className="flex h-fit w-[160px] flex-col gap-2.5 py-5 text-white" variant="gray">
            <div className="flex items-center gap-1">
              <Trophy className="size-4.5" />
              <span className="txt-b-bold">3순위</span>
            </div>
            <div className="txt-t2">{'이해형'}</div>
          </Button>
        </div>
        <ProfileResultCard type="BALANCED" />
      </Section>
      <Section className="max-w-[1000px] shrink-0">
        <div className="flex w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Map className="size-10 text-purple-700" />
            <span className="txt-t1">기관 추천 학습 로드맵</span>
          </div>
          <HelpCircle className="text-special-dark-blue-900 size-9" />
        </div>
        <div className="flex w-full flex-col gap-6 rounded-[20px] border border-gray-500 p-6 shadow">
          <div className="flex w-full gap-4">
            <Button variant="purple" className="txt-t3 h-20 flex-1">
              전체({'12'}명)
            </Button>
            <Button variant="gray" className="txt-t3 h-20 flex-1">
              입문-초급({'7'}명)
            </Button>
            <Button variant="gray" className="txt-t3 h-20 flex-1">
              중급-고급({'5'}명)
            </Button>
          </div>
        </div>
        <div className="h-[3px] w-full rounded-full bg-purple-700" />
        <div className="flex w-[700px] flex-col gap-2.5">
          <div className="txt-st-bold">
            <span className="text-purple-700">* </span>
            Step 1. 기반 다지기
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="txt-b-bold text-purple-700">[커리큘럼 가이드]</div>
            <div className="flex flex-col gap-2.5">
              <CurriculumItem
                level="입문"
                type="메인"
                title="[사전 진단 및 목표 수립] AX 성숙도 역량 진단 및 데이터 기반 AX 조직 목표 수립"
                duration="8h"
              />
              <CurriculumItem
                level="초급"
                type="메인"
                title="[맞춤 처방: 신사업] AI 리터러시 향상 및 신규 비즈니스 기획 창출"
                duration="10h"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="txt-b-bold text-purple-700">[프로필 유형별 학습 Tip]</div>
            <ul className="txt-b-regular flex list-outside list-disc flex-col gap-2.5 pl-5 text-black marker:text-black">
              <li className="leading-relaxed">
                AX 전환의 개념과 구조를 이해하고, 유사 사례를 함께 살펴보며 현재 사업과 업무에
                적용할 수 있는 가능성을 넓혀 학습합니다.
              </li>
              <li className="leading-relaxed">
                AI 리터러시를 바탕으로 새로운 사업 기회와 전환 가능성을 이해하고, 신사업 사례와
                연결하며 우리 조직에 적용할 수 있는 방향으로 확장해 학습합니다.
              </li>
            </ul>
          </div>
        </div>
        <div className="h-[640px] w-full shadow">커리큘럼 가이드 영역</div>
      </Section>
      <div className="h-[3px] w-full max-w-[1000px] rounded-full bg-purple-700" />
      <Button render={<Link href="/" />} variant="gray">
        메인으로
      </Button>
    </Container>
  );
}
