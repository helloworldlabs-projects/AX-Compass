import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { SectionHeader } from '../(home)/components/ui';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  ApplicationIcon,
  EvaluationIcon,
  ResponsibilityIcon,
  UnderstandingIcon,
} from '@/components/icons';

export default function AboutPage() {
  return (
    <Container className="pt-[25px] pb-[100px] lg:pt-[50px]">
      <div className="mx-auto max-w-[728px] lg:max-w-[1024px]">
        <Section>
          <SectionHeader
            title={
              <>
                AX 역량 진단 서비스 <span className="text-purple-700">AX Compass</span>
              </>
            }
            description="AX 전환에 필요한 역량을 진단하고, 결과 기반 학습 방향을 제안합니다."
            as="h1"
          />
        </Section>
        <Section>
          <div className="flex flex-col gap-[30px]">
            <div className="txt-t2">검사 개요</div>
            <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
              <div>
                AX Compass는 AX 전환에 필요한 역량을 기준으로 현재 수준을 진단합니다.
                <br />
                문항 응답을 통해 개인의 이해 수준과 업무 적용 방식, 판단 기준을 종합적으로 확인하며,
                결과는 단순 점수 제공이 아니라 역량별 강점과 보완 포인트가 드러나도록 정리합니다.
                <br />
                진단 결과는 역량 프로필과 학습 로드맵 형태로 제공되어, 지금 어디에 있는지와 함께
                다음 단계에서 무엇을 보완하면 좋은지까지 확인할 수 있습니다.
              </div>
              <div className="bg-purple-0 rounded-card p-3 shadow lg:p-5">
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>진단 대상 : 개인 / 기관(조직) 구성원</li>
                    <li>진단 방식 : 문항 응답 기반(별점·객관식)</li>
                    <li>제공 결과 : 진단 결과 리포트 / 역량 프로필 / 학습 로드맵(추천)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <div className="flex w-full flex-col gap-[30px]">
            <div className="txt-t2">검사 유형 안내</div>
            <div className="flex flex-wrap gap-6">
              <div className="flex min-w-[300px] flex-1 flex-col gap-[30px]">
                <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
                  <div className="txt-st-bold">일반 검사</div>
                  <div>
                    개인용 진단으로 현재 AX 역량을 확인합니다.
                    <br />
                    회원가입 없이 즉시 시작할 수 있습니다.
                  </div>
                  <div className="bg-purple-0 rounded-card p-3 shadow lg:p-5">
                    <div className="txt-st2-bold mb-1.5">이런 분께 추천합니다.</div>
                    <div className="ml-2">
                      <ul className="ml-4 flex list-outside list-disc flex-col">
                        <li>빠르게 현재 수준을 점검하고 싶은 분</li>
                        <li>결과를 바로 확인하고 학습 방향을 잡고 싶은 분</li>
                      </ul>
                    </div>
                  </div>
                  <Button render={<Link href="/assessment" />} className="w-fit">
                    일반 검사 시작하기 →
                  </Button>
                </div>
              </div>
              <div className="flex min-w-[300px] flex-1 flex-col gap-[30px]">
                <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
                  <div className="txt-st-bold">기관 검사</div>
                  <div>
                    기관용 정밀 분석과 결과 리포트를 제공합니다.
                    <br />
                    기관 인증코드 입력 후 시작할 수 있습니다.
                  </div>
                  <div className="bg-purple-0 rounded-card p-3 shadow lg:p-5">
                    <div className="txt-st2-bold mb-1.5">이런 기관에 추천합니다.</div>
                    <div className="ml-2">
                      <ul className="ml-4 flex list-outside list-disc flex-col">
                        <li>구성원 역량 현황을 기준으로 교육 설계를 하고 싶은 기관</li>
                        <li>조직 단위 AX 역량 결과 리포트가 필요한 기관</li>
                      </ul>
                    </div>
                  </div>
                  <Button
                    render={<Link href="/assessment" />}
                    variant="dark-blue"
                    className="w-fit"
                  >
                    기관 검사 시작하기 →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <div className="flex w-full flex-col gap-[30px]">
            <div className="txt-t2">문항 유형 구성</div>
            <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
              <div>
                AX Compass는 한 가지 질문 방식만으로 판단하지 않고, 아래 3가지 문항 유형을 함께
                사용합니다.
                <br />
                이는 사용자의 역량을 이해–판단–실행 관점에서 균형 있게 확인하고, 진단 결과(역량
                프로필/추천 로드맵)의 타당도를 높이기 위한 구성입니다.
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-start gap-6">
                  <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 gap-1.5 p-3 shadow lg:max-w-[470px] lg:p-5">
                    <div className="txt-st2-bold mb-1.5">1) 자기 평가 (별점형)</div>
                    <div className="ml-2">
                      <ul className="ml-4 flex list-outside list-disc flex-col">
                        <li>
                          &quot;나는 ~할 수 있다&quot; 형태의 자기보고 문항에 1~5점으로 응답합니다.
                        </li>
                        <li>
                          현재 수준에 대한 자기 인식과 자신감, 준비도를 빠르게 점검할 수 있어 진단
                          진입 부담이 낮습니다.
                        </li>
                        <li>
                          자기평가 문항은 진단의 한 부분으로 활용되며, 상황 판단과 행동 빈도 문항과
                          함께 역량을 종합적으로 확인합니다.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                    <Image
                      src="/images/about/img_question_type_01.png"
                      alt=""
                      width={470}
                      height={251}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-start gap-6">
                  <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                    <div className="txt-st2-bold mb-1.5">2) 상황 판단 평가 (SJT, 선택형)</div>
                    <div className="ml-2">
                      <ul className="ml-4 flex list-outside list-disc flex-col">
                        <li>관련 업무 상황을 제시하고 가장 적절한 선택지를 고르는 방식입니다.</li>
                        <li>
                          실제 업무에서 어떤 기준으로 판단하고 어떤 방식으로 문제를 해결하는지
                          확인할 수 있습니다.
                        </li>
                        <li>
                          자기평가에서 드러나지 않는 &quot;실제 판단 방식&quot;이 반영되어, 결과가
                          더 현실적인 방향으로 정리됩니다.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                    <Image
                      src="/images/about/img_question_type_02.png"
                      alt=""
                      width={470}
                      height={251}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-start gap-6">
                  <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
                    <div className="txt-st2-bold mb-1.5">3) 행동 빈도 평가 (별점형)</div>
                    <div className="ml-2">
                      <ul className="ml-4 flex list-outside list-disc flex-col">
                        <li>
                          &quot;최근 1개월 동안 ~을 얼마나 자주 했나&quot; 형태의 문항에 1~5점으로
                          응답합니다.
                        </li>
                        <li>
                          알고 있는지/판단할 수 있는지와 별개로, 실제 업무에서 얼마나 실행되고
                          있는지를 확인합니다.
                        </li>
                        <li>
                          이를 통해 추천 로드맵이 단순 이론이 아니라, 현재의 실행 수준을 고려한
                          방향으로 제안될 수 있습니다.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
                    <Image
                      src="/images/about/img_question_type_03.png"
                      alt=""
                      width={470}
                      height={251}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <div className="flex w-full flex-col gap-[30px]">
            <div className="txt-t2">역량 설계</div>
            <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
              AX Compass는 AX 전환에 필요한 역량을 기준으로 진단을 설계했습니다.
              <br />
              진단 결과는 아래 4개 역량군을 중심으로 구조화되며, 역량군별 세부 역량을 통해 강점과
              보완 포인트를 명확히 확인할 수 있습니다.
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-[30px]">
              <div className="rounded-card flex min-w-[300px] flex-1 flex-col gap-6 bg-white p-5 shadow lg:max-w-[500px] lg:min-w-[350px] lg:p-[30px]">
                <div className="flex items-center gap-2.5">
                  <UnderstandingIcon className="size-6 text-purple-700 lg:size-[30px]" />
                  <div>
                    <span className="txt-st-bold">이해</span>{' '}
                    <span className="txt-st-regular">(Understand)</span>
                  </div>
                </div>
                <div>
                  AI가 잘하는 것과 못하는 것을 구분하고, 환각·편향·최신성 한계와 결과 변동 원인을
                  이해하는 역량입니다.
                </div>
                <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                  <div className="txt-st2-bold mb-1.5">하위 역량</div>
                  <div className="ml-2">
                    <ul className="ml-4 flex list-outside list-disc flex-col">
                      <li>AI/LLM 작동 원리 이해 역량</li>
                      <li>생성형 AI 오류·리스크 이해 역량</li>
                      <li>컨텍스트·제약에 따른 결과 변동 이해 역량</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="rounded-card flex min-w-[300px] flex-1 flex-col gap-6 bg-white p-5 shadow lg:max-w-[500px] lg:min-w-[350px] lg:p-[30px]">
                <div className="flex items-center gap-2.5">
                  <ApplicationIcon className="size-6 text-purple-700 lg:size-[30px]" />
                  <div>
                    <span className="txt-st-bold">활용</span>{' '}
                    <span className="txt-st-regular">(Use & Apply)</span>
                  </div>
                </div>
                <div>
                  목표·조건·출력 형식에 맞게 요청을 구성하고, 업무 유스케이스에 적용해 실제 성과로
                  연결하는 역량입니다.
                </div>
                <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                  <div className="txt-st2-bold mb-1.5">하위 역량</div>
                  <div className="ml-2">
                    <ul className="ml-4 flex list-outside list-disc flex-col">
                      <li>프롬프트·요구사항 명세화 역량</li>
                      <li>업무 유스케이스 선정·적용 설계 역량</li>
                      <li>워크플로우·도구 조합 운영 역량</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="rounded-card flex min-w-[300px] flex-1 flex-col gap-6 bg-white p-5 shadow lg:max-w-[500px] lg:min-w-[350px] lg:p-[30px]">
                <div className="flex items-center gap-2.5">
                  <EvaluationIcon className="size-6 text-purple-700 lg:size-[30px]" />
                  <div>
                    <span className="txt-st-bold">평가·개선</span>{' '}
                    <span className="txt-st-regular">(Evaluate & Improve)</span>
                  </div>
                </div>
                <div>
                  AI 결과를 그대로 믿지 않고 근거를 검증하며, 오류·누락을 보완해 반복 개선하는
                  역량입니다.
                </div>
                <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                  <div className="txt-st2-bold mb-1.5">하위 역량</div>
                  <div className="ml-2">
                    <ul className="ml-4 flex list-outside list-disc flex-col">
                      <li>AI 출력 사실·근거 검증 역량</li>
                      <li>AI 결과 품질 기준 평가 역량</li>
                      <li>실험·피드백 기반 반복 개선 역량</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="rounded-card flex min-w-[300px] flex-1 flex-col gap-6 bg-white p-5 shadow lg:max-w-[500px] lg:min-w-[350px] lg:p-[30px]">
                <div className="flex items-center gap-2.5">
                  <ResponsibilityIcon className="size-6 text-purple-700 lg:size-[30px]" />
                  <div>
                    <span className="txt-st-bold">책임·거버넌스</span>{' '}
                    <span className="txt-st-regular">(Responsible Use)</span>
                  </div>
                </div>
                <div>
                  개인정보·기밀·저작권·조직 정책을 준수하고, 위험한 사용을 피하며 안전한 대안을
                  선택하는 역량입니다.
                </div>
                <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                  <div className="txt-st2-bold mb-1.5">하위 역량</div>
                  <div className="ml-2">
                    <ul className="ml-4 flex list-outside list-disc flex-col">
                      <li>AI 데이터 보안·개인정보 처리 역량</li>
                      <li>AI 저작권·윤리 리스크 대응 역량</li>
                      <li>AI 운영 거버넌스 준수 역량</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <div className="flex w-full flex-col gap-[30px]">
            <div className="txt-t2">검사 결과 내용</div>
            <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
              AX Compass는 정밀 검사 기준으로, 개인과 기관에 필요한 형태로 결과를 제공합니다.
              <br />
              개인은 내 역량 프로필과 학습 로드맵, 기관은 조직 현황과 운영용 리포트를 중심으로
              확인할 수 있습니다.
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
                          검사 완료 후 조회 코드를 발급하며, 코드를 복사해 두면 나중에 동일 결과를
                          다시 확인할 수 있습니다.
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
                          진단 결과를 바탕으로 대표 프로필 유형을 제공하고, 특징과 강점/보완
                          포인트를 요약해 안내합니다.
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
                        <li>
                          추천 주제별로 Step 단위 학습 흐름과 커리큘럼 구조를 함께 제공합니다.
                        </li>
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
                          결과를 바탕으로 조직에 맞는 우선 과제와 실행 방향을 빠르게 설계할 수
                          있습니다.
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
                          4개 역량군(이해/활용/평가·개선/책임·거버넌스)별로 구성원의 등급 분포와
                          편차를 통계로 확인할 수 있습니다.
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
                        <li>
                          역량군별 세부 역량(3개) 수준을 레이더 차트와 점수 바 형태로 제공합니다.
                        </li>
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
        <Section>
          <div className="flex w-full flex-col gap-[30px]">
            <div className="txt-t2">FAQ</div>
            <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
              <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                <div className="txt-st2-bold mb-1.5">Q1. 회원가입이 필요한가요?</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>일반 검사는 회원가입 없이 시작할 수 있습니다.</li>
                    <li>
                      기관 검사 또한 회원가입은 필요 없지만, 기관 인증코드 입력 후 시작할 수
                      있습니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                <div className="txt-st2-bold mb-1.5">Q2. 검사 결과는 어떻게 다시 확인하나요?</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>검사 완료 후 결과 조회 코드가 발급됩니다.</li>
                    <li>조회 코드를 복사해 두면 나중에 결과를 다시 확인할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                <div className="txt-st2-bold mb-1.5">
                  Q3. 일반 검사와 기관 검사의 차이는 무엇인가요?
                </div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>일반 검사는 약식 문항으로 진행하고, 개인용 진단 결과를 제공합니다.</li>
                    <li>
                      기관 검사는 상세 문항으로 진행하고, 상세 진단 결과와 조직 단위 기관 리포트를
                      제공합니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                <div className="txt-st2-bold mb-1.5">Q4. 기관 인증코드는 어디서 받나요?</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>
                      문의하기를 통해 기관 정보를 보내주시면, 관리자가 확인 및 기관 등록 후 기관
                      담당자에게 기관 인증코드를 발급해 드립니다.
                    </li>
                    <li>
                      기관 담당자는 발급받은 코드를 구성원에게 전달해 기관 검사를 진행할 수
                      있습니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                <div className="txt-st2-bold mb-1.5">
                  Q5. 응답을 되돌아가서 확인하거나 수정할 수 있나요?
                </div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>
                      검사는 문항 단위로 진행되어 이전 문항으로 되돌아가 확인하거나 수정할 수
                      없습니다.
                    </li>
                    <li>응답을 선택한 뒤 다음으로 진행해 주세요.</li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
                <div className="txt-st2-bold mb-1.5">Q6. 검사 도중 나가면 저장되나요?</div>
                <div className="ml-2">
                  <ul className="ml-4 flex list-outside list-disc flex-col">
                    <li>검사 진행 중 응답은 저장되지 않습니다.</li>
                    <li>가능하면 한 번에 집중해서 완료해 주세요.</li>
                  </ul>
                </div>
              </div>
              <div>※ 추가 문의나 기관 코드 발급 요청은 [검사 문의] 로 연락해 주세요.</div>
            </div>
          </div>
        </Section>
        <div className="flex justify-center gap-4 lg:gap-6">
          <Button render={<Link href="/" />} variant="gray">
            메인으로
          </Button>
          <Button variant="purple">문의하기</Button>
        </div>
      </div>
    </Container>
  );
}
