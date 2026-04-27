'use client';

import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Image from 'next/image';
import Link from 'next/link';
import { ResultCodeCard } from '../../components/ResultCodeCard';
import { BadgeCheck, Map } from 'lucide-react';
import { MaturityLevelCard } from '@/app/institution/_components/MaturityLevelCard';
import { ExecutiveRadarChart } from '@/components/ui/ExecutiveRadarChart';
import { CurriculumTreeChart } from '@/components/shared/CurriculumTreeChart';
import { CurriculumItem } from '@/components/ui/CurriculumItem';
import { Button } from '@/components/ui/button';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { useState } from 'react';

export default function ExecutiveAssessmentPage() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <Container>
      <div className="bg-gray-0 flex w-full flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
        <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
          <CompassIcon className="size-4.5 text-white" fillOpacity="1" />
          <span className="txt-c1-bold text-white">공식 인증</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Image
            src="/images/logo/img_logo_helloworldlabs.png"
            alt=""
            width={300}
            height={30}
            className="h-[30px] w-[300px] object-contain"
          />
          <div className="txt-st2-bold text-black">에서 인증하는 공식 결과입니다.</div>
        </div>
        <div className="text-center">본 문서는 AX Compass 진단 결과를 바탕으로 생성되었습니다.</div>
        <div className="txt-c2-regular flex items-center justify-end gap-2">
          <span>발급일: 2026.04.22</span>
          <div>|</div>
          <span>결과 코드: 7F3K2Q9M</span>
          <div>|</div>
          <span>발급 기관: (주)헬로월드랩스</span>
        </div>
      </div>
      <Section className="w-full max-w-[700px]">
        <div className="w-full">
          <div>
            <span className="txt-t1 mr-1.5">{'기관명'}</span>
          </div>
          <div className="txt-st2-regular">기관 AX 성숙도 진단 결과 입니다.</div>
        </div>
        <div className="flex items-center justify-center gap-6 text-white lg:gap-[50px]">
          <div className="flex w-[140px] flex-col items-center gap-2.5 rounded-[12px] border-3 border-purple-300 bg-purple-700 py-5 shadow lg:w-[160px]">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5" />
              <span className="txt-b-bold">현재 성숙도 수준</span>
            </div>
            <div className="txt-t2">{'수준'}</div>
          </div>
          <div className="bg-special-pink-600 border-special-pink-200 flex w-[140px] flex-col items-center gap-2.5 rounded-[12px] border-3 py-5 shadow lg:w-[160px]">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5" />
              <span className="txt-b-bold">목표 성숙도 수준</span>
            </div>
            <div className="txt-t2">{'수준'}</div>
          </div>
        </div>
        <ResultCodeCard resultCode={'결과 코드'} />
        <div className="rounded-card flex w-full flex-col gap-[30px] border border-gray-500 bg-white px-4 py-[50px] lg:px-[50px]">
          <MaturityLevelCard type={'INITIATION'} />
          <MaturityLevelCard type={'INTEGRATION'} />
        </div>
      </Section>
      <Section className="max-w-[1000px]">
        <div className="flex w-full flex-col gap-[30px]">
          <div className="mx-auto max-w-[340px] lg:max-w-[900px]">
            <div className="flex items-end justify-center gap-2.5">
              <div className="relative flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">{60}</span>
                <div
                  className="flex w-full items-center justify-center rounded-t-[12px] border-3 border-b-0 border-purple-300 bg-purple-700 lg:rounded-t-[20px]"
                  style={{ height: `${60}%` }}
                >
                  <span className="txt-st2-bold text-white">도입</span>
                </div>
              </div>
              <div className="w-[50px] lg:w-[120px]">
                <div
                  className={`txt-b-bold flex h-[100px] flex-col text-center ${60 > 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  <span>Gap_MS</span>
                  <span>
                    ({60 > 0 ? '+' : ''} {60})
                  </span>
                  <div className="flex w-full items-center">
                    <div className="h-px flex-1 bg-current" />
                    <div className="h-0 w-0 border-y-[5px] border-l-8 border-y-transparent border-l-current" />
                  </div>
                </div>
              </div>
              <div className="relative flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                <span className="txt-b-bold text-center">{60}</span>
                <div
                  className="bg-special-pink-600 border-special-pink-200 flex w-full items-center justify-center rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                  style={{ height: `${60}%` }}
                >
                  <span className="txt-st2-bold text-white">통합</span>
                </div>
              </div>
            </div>
            <div className="h-[3px] w-full rounded-full bg-gray-500" />
            <div className="txt-st2-bold mt-5 flex items-center justify-between text-center lg:px-6">
              <div>
                현재 성숙도(CMS)
                <br />
                (종합)
              </div>
              <div>
                목표 성숙도(TMS)
                <br />
                (종합)
              </div>
            </div>
          </div>
          <div className="mx-auto w-[700px]">
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
              <div className="h-[500px] w-full">
                <ExecutiveRadarChart
                  strategyScore={80}
                  governanceScore={25}
                  adoptionScore={25}
                  dataSystemScore={100}
                  strokeColor="#ff5a81"
                />
              </div>
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
              <div className="h-[500px] w-full">
                <ExecutiveRadarChart
                  strategyScore={80}
                  governanceScore={25}
                  adoptionScore={100}
                  dataSystemScore={100}
                  strokeColor="#2e75cc"
                />
              </div>
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
        <div className="flex max-w-[700px] flex-col gap-2.5 rounded-[20px] border border-gray-500 bg-white px-[50px] py-[30px] shadow">
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
      <Section className="max-w-[728px] lg:max-w-[1000px]">
        <div className="flex w-full max-w-[700px] items-center">
          <div className="flex items-center gap-4">
            <Map className="size-10 text-purple-700" />
            <div className="txt-t1">
              <span className="mr-3 hidden lg:inline-block">기관 </span>추천 학습 로드맵
            </div>
          </div>
        </div>
        <div className="h-[3px] w-full rounded-full bg-purple-700" />
        <div className="flex w-full max-w-[700px] flex-col gap-2.5">
          <div className="txt-st-bold">
            <span className="text-purple-700">* </span>
            <span>{'AX 성숙도 진단 및 목표 수립'}</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="txt-b-bold text-purple-700">[커리큘럼 가이드]</div>
            <div className="flex flex-col gap-2.5">
              <CurriculumItem
                level="입문"
                type="메인"
                title="[사전 진단 및 목표 수립] AX 성숙도 역량 진단 및 데이터 기반 AX 조직 목표 수립"
                duration="8"
              />
              <CurriculumItem
                level="초급"
                type="메인"
                title="[맞춤 처방: 신사업] AI 리터러시 향상 및 신규 비즈니스 기획 창출"
                duration="16"
              />
              <CurriculumItem
                level="중급"
                type="확장"
                title="[역량 강화: N8N] 지능형 업무 워크플로우 설계 및 자동화 시스템 구축"
                duration="24"
              />
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1000px]">
          <CurriculumTreeChart
            roadmapType="overall"
            activeNodes={[
              'BEGINNER_COMMON_1',
              'ELEMENTARY_NEW_BIZ_1',
              'INTERMEDIATE_NEW_BIZ_1',
              'ADVANCED_COMMON_1',
            ]}
            activeEdges={[
              { from: 'BEGINNER_COMMON_1', to: 'ELEMENTARY_NEW_BIZ_1' },
              { from: 'ELEMENTARY_NEW_BIZ_1', to: 'INTERMEDIATE_NEW_BIZ_1' },
              { from: 'INTERMEDIATE_NEW_BIZ_1', to: 'ADVANCED_COMMON_1' },
            ]}
          />
        </div>
        <div className="h-[3px] w-full rounded-full bg-purple-700" />
      </Section>
      <ResultCodeCard resultCode={'결과 코드'} />
      <div data-print-hidden className="flex justify-center gap-4 lg:gap-6">
        <Button render={<Link href="/" />} variant="gray">
          메인으로
        </Button>
        <Button variant="purple" onClick={() => setInquiryOpen(true)}>
          문의하기
        </Button>
      </div>
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Container>
  );
}
