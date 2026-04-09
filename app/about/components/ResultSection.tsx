import Section from '@/components/layout/Section';
import Image from 'next/image';

export function ResultSection() {
  return (
    <Section className="p-0">
      <div className="flex w-full flex-col gap-[30px]">
        <div className="txt-t2">검사 결과 내용</div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          AX Compass는 정밀 검사 기준으로, 개인과 기관에 필요한 형태로 결과를 제공합니다.
          <br />
          개인은 내 역량 프로필과 학습 로드맵, 기관은 조직 현황과 운영용 리포트를 중심으로 확인할 수
          있습니다.
        </div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          <div className="txt-st-bold">개인 결과지(일반/개인용)</div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 gap-1.5 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">1) 진단 결과 요약</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>내 점수와 핵심 결과를 한눈에 확인할 수 있습니다.</li>
                    <li>
                      검사 완료 후 조회 코드를 발급하며, 코드를 복사해 두면 나중에 동일 결과를 다시
                      확인할 수 있습니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_general_01.png"
                  alt=""
                  width={470}
                  height={267}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">2) 역량 프로필(4개 역량군)</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>아래 4개 역량군 기준으로 현재 수준을 구조화해 제공합니다.</li>
                    <li>이해(Understand)</li>
                    <li>활용(Use & Apply)</li>
                    <li>평가·개선(Evaluate & Improve)</li>
                    <li>책임·거버넌스(Responsible Use)</li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_general_02.png"
                  alt=""
                  width={470}
                  height={466}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">3) 역량 상세 분석(세부 역량 분포)</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>
                      4개 역량군 각각에 대해 세부 역량(3개) 분포를 레이더 차트와 점수 바 형태로
                      제공합니다.
                    </li>
                    <li>강점/보완 영역이 어디인지 직관적으로 확인할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_general_03.png"
                  alt=""
                  width={470}
                  height={564}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">4) 나의 프로필 유형</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>
                      진단 결과를 바탕으로 대표 프로필 유형을 제공하고, 특징과 강점/보완 포인트를
                      요약해 안내합니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_general_04.png"
                  alt=""
                  width={470}
                  height={504}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">5) 맞춤형 학습 로드맵 추천</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>진단 결과를 바탕으로, 학습 로드맵을 추천합니다.</li>
                    <li>추천 주제별로 Step 단위 학습 흐름과 커리큘럼 구조를 함께 제공합니다.</li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_general_05.png"
                  alt=""
                  width={470}
                  height={510}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          <div className="txt-st-bold">기관 결과지(조직 리포트)</div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 gap-1.5 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">1) 기관 AX 성숙도</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>
                      기관의 AX 성숙도를 진단해 현재 수준과 목표 수준을 객관적으로 확인할 수
                      있습니다.
                    </li>
                    <li>
                      결과를 바탕으로 조직에 맞는 우선 과제와 실행 방향을 빠르게 설계할 수 있습니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_organization_01.png"
                  alt=""
                  width={470}
                  height={550}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">2) 역량 등급/분포 통계(4개 역량군)</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>
                      4개 역량군(이해/활용/평가·개선/책임·거버넌스)별로 구성원의 등급 분포와 편차를
                      통계로 확인할 수 있습니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_organization_02.png"
                  alt=""
                  width={470}
                  height={479}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">3) 역량 상세 분석(기관 평균/분포)</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>역량군별 세부 역량(3개) 수준을 레이더 차트와 점수 바 형태로 제공합니다.</li>
                    <li>교육 설계 시 우선 보완 영역을 잡는 데 활용할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_organization_03.png"
                  alt=""
                  width={470}
                  height={856}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">4) 프로필 유형 통계(조직 분포)</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>구성원의 프로필 유형 분포를 제공합니다.</li>
                    <li>조직의 전반적 특성과 운영 시 주의 포인트를 함께 확인할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_organization_04.png"
                  alt=""
                  width={470}
                  height={523}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                <div className="txt-st2-bold mb-1.5">5) 기관 학습 로드맵 추천</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>조직원의 진단 결과를 바탕으로, 학습 로드맵을 추천합니다.</li>
                    <li>
                      주제별 Step 흐름과 커리큘럼 구조를 통해, 기관은 교육 운영 우선순위와 실행
                      계획을 정리할 수 있습니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                <Image
                  src="/images/about/img_report_organization_05.png"
                  alt=""
                  width={470}
                  height={619}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
