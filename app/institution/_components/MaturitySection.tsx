'use client';

import Section from '@/components/layout/Section';
import { BadgeCheck } from 'lucide-react';
import { MaturityLevelCard } from './MaturityLevelCard';

interface MaturitySectionProps {
  institutionName: string;
}

export function MaturitySection({ institutionName }: MaturitySectionProps) {
  return (
    <>
      <Section className="w-[700px] shrink-0">
        <div className="flex w-full flex-col items-start">
          <div className="txt-t1">{institutionName}</div>
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
    </>
  );
}
