import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { ShieldBadge } from '@/components/ui/ShieldBadge';
import {
  BadgeCheck,
  Building,
  Check,
  ContactRound,
  Layers,
  Map,
  PackageOpen,
  Repeat,
  Search,
  View,
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <Container className="pt-[25px] pb-[150px] lg:pt-[100px]">
      <CompassIcon className="absolute top-[130px] left-1/2 h-[300px] w-[272px] -translate-x-1/2 lg:h-[600px] lg:w-[543px]" />
      <Section>
        <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
          <h1 className="txt-h2 text-shadow text-center">
            <span className="text-purple-700">AX 역량</span>을 지금 바로 진단하세요.
          </h1>
          <p className="text-center">
            AX 역량을 빠르게 진단하고, 역량 프로필 기반으로 필요한 AI 학습 방향을 확인하세요.
          </p>
        </div>
        <Button className="txt-st-bold h-20 lg:h-[130px]">검사 유형 선택 →</Button>
        <div className="flex max-w-[544px] flex-wrap items-center justify-center gap-6">
          <div className="rounded-card bg-purple-0 border-special-navy-100 flex w-[260px] shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-purple-700 lg:size-6" />
              <span className="txt-b-bold">검사 결과 즉시 제공</span>
            </div>
            <div className="text-center">
              검사 완료 후 결과를
              <br />
              즉시 확인할 수 있습니다.
            </div>
          </div>
          <div className="rounded-card bg-purple-0 border-special-navy-100 flex w-[260px] shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4">
            <div className="flex items-center gap-2">
              <ContactRound className="size-5 text-purple-700 lg:size-6" />
              <span className="txt-b-bold">역량 기반 프로필 제공</span>
            </div>
            <div className="text-center">
              현재 역량 수준에 적합한
              <br />
              프로필을 제공합니다.
            </div>
          </div>
          <div className="rounded-card bg-purple-0 border-special-navy-100 flex w-[260px] shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4">
            <div className="flex items-center gap-2">
              <Map className="size-5 text-purple-700 lg:size-6" />
              <span className="txt-b-bold">맞춤형 학습 로드맵 추천</span>
            </div>
            <div className="text-center">
              검사 결과 기반으로
              <br />
              학습 로드맵을 추천합니다.
            </div>
          </div>
          <div className="rounded-card bg-purple-0 border-special-navy-100 flex w-[260px] shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4">
            <div className="flex items-center gap-2">
              <Building className="size-5 text-purple-700 lg:size-6" />
              <span className="txt-b-bold">기관 정밀 분석 지원</span>
            </div>
            <div className="text-center">
              기관용 정밀 분석과
              <br />
              결과 리포트를 제공합니다.
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
          <h2 className="txt-t1 text-shadow text-center">
            왜 <span className="text-purple-700">AX 역량</span> 검사가 필요할까요?
          </h2>
          <p className="text-shadow flex flex-col gap-1 text-center">
            <span>
              AI를 사용하고 있어도 현재 수준이 어느 정도인지, 무엇을 먼저 보완해야 하는지는 쉽게
              알기 어렵습니다.
            </span>
            <span>
              AX 역량 검사는 지금의 상태를 확인하고, 더 발전하기 위한 학습 방향을 찾는 데 도움을
              줍니다.
            </span>
          </p>
        </div>
        <div className="flex w-full max-w-[728px] flex-col gap-6">
          <div className="rounded-card bg-purple-0 border-special-navy-100 flex w-full shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4">
            <div className="flex items-center gap-2">
              <Search className="size-6 text-purple-700 lg:size-[30px]" />
              <span className="txt-st2-bold">현재 수준을 정확히 알아야 합니다</span>
            </div>
            <div className="text-center">
              AI를 사용하고 있어도 실제 수준은 막연할 수 있습니다.
              <br />
              현재 수준을 알아야 다음 학습 방향을 제대로 정할 수 있습니다.
            </div>
          </div>
          <div className="rounded-card bg-purple-0 border-special-navy-100 flex w-full shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4">
            <div className="flex items-center gap-2">
              <Layers className="size-6 text-purple-700 lg:size-[30px]" />
              <span className="txt-st2-bold">많이 쓰는 것과 잘 쓰는 것은 다릅니다</span>
            </div>
            <div className="text-center">
              사용 빈도가 높아도 판단, 검증, 실행 습관까지 충분하다고 보기는 어렵습니다.
              <br />
              AX 역량은 여러 관점에서 함께 확인해야 합니다.
            </div>
          </div>
          <div className="rounded-card bg-purple-0 border-special-navy-100 flex w-full shrink-0 flex-col items-center justify-center gap-2 border-3 p-3 lg:gap-2.5 lg:p-4">
            <div className="flex items-center gap-2">
              <Map className="size-6 text-purple-700 lg:size-[30px]" />
              <span className="txt-st2-bold">발전하려면 다음 로드맵이 필요합니다</span>
            </div>
            <div className="text-center">
              지금 어디에 있는지 아는 것만큼, 다음에 무엇을 해야 하는지 아는 것도 중요합니다.
              <br />
              우선순위가 보이면 더 빠르게 성장하고 실제 업무에 연결할 수 있습니다.
            </div>
          </div>
        </div>
        <div className="txt-st2-bold text-center">
          <span className="text-purple-700">*</span> 현재 수준을 알고, 다음 학습 방향을 아는 것이{' '}
          <span className="text-purple-700">AX 역량 성장의 시작</span>입니다.
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
          <h2 className="txt-t1 text-shadow text-center">
            검사로 끝나지 않는 <span className="text-special-navy-500">AX 성장 로직</span>
          </h2>
          <p className="text-shadow flex flex-col gap-1 text-center">
            <span>AX Compass는 현재 역량을 진단하는 데서 멈추지 않습니다.</span>
            <span>
              결과를 바탕으로 맞춤형 학습 방향과 실제 교육, 다음 성장 단계까지 연결합니다.
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-[50px]">
          <div className="flex flex-col gap-1.5 lg:gap-2.5">
            <div className="bg-special-navy-500 rounded-card border-special-navy-100 txt-b-bold w-fit border px-[30px] py-2.5 text-white">
              진단
            </div>
            <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-6 p-4 lg:gap-[30px] lg:p-[30px]">
              <div className="flex gap-4 lg:gap-6">
                <ShieldBadge
                  color="var(--color-special-dark-blue-300)"
                  borderColor="var(--color-special-dark-blue-100)"
                >
                  1
                </ShieldBadge>
                <div className="flex flex-col gap-1.5 lg:gap-2.5">
                  <h3 className="txt-st2-bold">역량 검사</h3>
                  <p>
                    자기 평가, 상황 판단, 행동 빈도 문항을 통해 AX 역량과 활용 패턴을 진단합니다.
                    <br />
                    지금 어느 수준에서 어떻게 활용하고 있는지 구조적으로 확인합니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 lg:gap-6">
                <ShieldBadge
                  color="var(--color-special-dark-blue-300)"
                  borderColor="var(--color-special-dark-blue-100)"
                >
                  2
                </ShieldBadge>
                <div className="flex flex-col gap-1.5 lg:gap-2.5">
                  <h3 className="txt-st2-bold">역량 및 프로필 분석</h3>
                  <p>
                    4대 역량 결과와 프로필 유형을 바탕으로 현재 강점과 보완 포인트를 확인합니다.
                    <br />
                    무엇이 부족한지뿐 아니라, 어떤 방식으로 활용하고 있는지도 함께 파악합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 lg:gap-2.5">
            <div className="bg-special-navy-500 rounded-card border-special-navy-100 txt-b-bold w-fit border px-[30px] py-2.5 text-white">
              설계 · 교육
            </div>
            <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-6 p-4 lg:gap-[30px] lg:p-[30px]">
              <div className="flex gap-4 lg:gap-6">
                <ShieldBadge
                  color="var(--color-special-dark-blue-500)"
                  borderColor="var(--color-special-dark-blue-300)"
                >
                  3
                </ShieldBadge>
                <div className="flex flex-col gap-1.5 lg:gap-2.5">
                  <h3 className="txt-st2-bold">맞춤형 학습 로드맵 제공</h3>
                  <p>
                    역량 결과를 바탕으로 무엇을 배우고 어떤 순서로 확장할지 로드맵을 제공합니다.
                    <br />
                    현재 수준에 맞는 학습 시작점과 다음 단계를 제안합니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 lg:gap-6">
                <ShieldBadge
                  color="var(--color-special-dark-blue-500)"
                  borderColor="var(--color-special-dark-blue-300)"
                >
                  4
                </ShieldBadge>
                <div className="flex flex-col gap-1.5 lg:gap-2.5">
                  <h3 className="txt-st2-bold">실제 환경에 맞는 커리큘럼 제안</h3>
                  <p>
                    사용 중인 AI 도구와 업무 환경에 맞춰 실제 적용 가능한 커리큘럼을 제안합니다.
                    <br />
                    단순 이론이 아니라, 현업에 바로 활용할 수 있는 실무 흐름으로 연결합니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 lg:gap-6">
                <ShieldBadge
                  color="var(--color-special-dark-blue-500)"
                  borderColor="var(--color-special-dark-blue-300)"
                >
                  5
                </ShieldBadge>
                <div className="flex flex-col gap-1.5 lg:gap-2.5">
                  <h3 className="txt-st2-bold">실무 과제 중심(PBL) 교육 진행</h3>
                  <p>
                    추천된 주제와 커리큘럼을 바탕으로, 실제 업무와 연결된 과제를 수행합니다.
                    <br />
                    배운 내용을 바로 적용, 검증하며 실질적인 역량 향상으로 이어갑니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 lg:gap-2.5">
            <div className="bg-special-navy-500 rounded-card border-special-navy-100 txt-b-bold w-fit border px-[30px] py-2.5 text-white">
              분석 · 확장
            </div>
            <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-6 p-4 lg:gap-[30px] lg:p-[30px]">
              <div className="flex gap-4 lg:gap-6">
                <ShieldBadge
                  color="var(--color-special-dark-blue-800)"
                  borderColor="var(--color-special-dark-blue-300)"
                >
                  6
                </ShieldBadge>
                <div className="flex flex-col gap-1.5 lg:gap-2.5">
                  <h3 className="txt-st2-bold">추가 역량 검사 및 전후 비교</h3>
                  <p>
                    교육 이후 추가 진단을 통해, 이전 대비 변화와 성장 정도를 다시 확인합니다.
                    <br />
                    교육 전후 결과를 비교해 어떤 역량이 개선되었는지 구체적으로 확인할 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 lg:gap-6">
                <ShieldBadge
                  color="var(--color-special-dark-blue-800)"
                  borderColor="var(--color-special-dark-blue-300)"
                >
                  7
                </ShieldBadge>
                <div className="flex flex-col gap-1.5 lg:gap-2.5">
                  <h3 className="txt-st2-bold">피드백 및 다음 스텝 제안</h3>
                  <p>
                    교육 전후 결과를 바탕으로 다음에 필요한 학습과 운영 방향을 이어서 제안합니다.
                    <br />한 번의 진단으로 끝나지 않고, 다음 성장 단계까지 연결되는 흐름을
                    제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="txt-st2-bold text-center">
          <span className="text-special-dark-blue-500">*</span> AX Compass는{' '}
          <span className="text-special-dark-blue-500">진단 이후의 학습과 다음 성장 단계</span>까지
          함께 설계합니다.
        </div>
      </Section>
      <Section>
        <div className="rounded-card w-full max-w-[728px] overflow-hidden shadow lg:max-w-[1000px]">
          <div className="relative flex h-[350px] items-center justify-center">
            <Image
              src="/images/main/img_card_bg.png"
              width={1000}
              height={350}
              alt="AX Compass"
              className="absolute inset-0 h-[350px] w-[1000px] object-cover"
            />
            <div className="relative flex flex-col items-center justify-center gap-6 px-2.5 lg:gap-[30px]">
              <div className="flex flex-col gap-4">
                <div className="txt-st-bold text-shadow">
                  <span className="text-special-dark-blue-700 txt-t1">AX Compass</span> 는
                </div>
                <div className="text-shadow txt-st2-regular">
                  진단 결과를 바탕으로 현재 수준에 맞는 학습 방향과 교육 설계를 제안합니다.
                </div>
                <div className="txt-st-bold">
                  다음 학습과 성장 방향까지 전문가와 함께 구체화해 보세요.
                </div>
              </div>
              <Button className="txt-st-bold h-20 w-fit" variant={'dark-blue'}>
                AX 컨설팅 문의하기
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2.5 py-5 lg:gap-4">
            <BadgeCheck className="text-special-dark-blue-500 size-6 shrink-0 lg:size-[30px]" />
            <span className="txt-st2-regular">
              AX Compass는 시스템 기반 진단과 전문가의 설계를 함께 제공합니다.
            </span>
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
          <h2 className="txt-t1 text-shadow text-center">
            AX Compass의 <span className="text-special-pink-600">검사 시스템</span>
          </h2>
          <p className="text-shadow flex flex-col gap-1 text-center">
            <span>AX Compass는 단순 점수 평가가 아니라, 인식·판단·실행을 함께 진단하고</span>
            <span>그 결과를 학습 로드맵까지 연결하도록 설계되어 있습니다.</span>
          </p>
        </div>
        <div className="flex max-w-[728px] flex-col gap-[50px]">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]">
            <Image
              src="/images/main/img_system_01.png"
              width={300}
              height={300}
              alt=""
              className="h-[300px] w-[300px] shrink-0 object-cover"
            />
            <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
              <div className="txt-st2-bold text-center">3가지 문항 유형 통합 진단</div>
              <div className="text-center">
                자기 평가, 상황 판단, 행동 빈도 결과를 함께 분석해
                <br />
                현재 역량과 활용 패턴을 다각도로 진단합니다.
              </div>
              <div className="border-special-pink-100 rounded-card flex items-center gap-3 border-3 bg-white p-3 lg:gap-4 lg:p-4">
                <Check className="text-special-pink-600 size-5 lg:size-6" />
                <span>인식, 판단, 실행을 함께 확인하는 복합 진단 구조입니다.</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]">
            <Image
              src="/images/main/img_system_02.png"
              width={300}
              height={300}
              alt=""
              className="h-[300px] w-[300px] shrink-0 object-cover"
            />
            <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
              <div className="txt-st2-bold text-center">4대 역량 구조 기반 해석</div>
              <div className="text-center">
                이해, 활용, 평가·개선, 책임·거버넌스 기준으로
                <br />
                결과를 구조적으로 해석합니다.
              </div>
              <div className="border-special-pink-100 rounded-card flex items-center gap-3 border-3 bg-white p-3 lg:gap-4 lg:p-4">
                <Check className="text-special-pink-600 size-5 lg:size-6" />
                <span>단순 총점이 아니라, 어떤 역량에서 차이가 나는지 확인합니다.</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]">
            <Image
              src="/images/main/img_system_03.png"
              width={300}
              height={300}
              alt=""
              className="h-[300px] w-[300px] shrink-0 object-cover"
            />
            <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
              <div className="txt-st2-bold text-center">프로필 유형 도출</div>
              <div className="text-center">
                응답 패턴을 분석해 현재의 활용 성향을
                <br />
                프로필 유형으로 직관적으로 보여줍니다.
              </div>
              <div className="border-special-pink-100 rounded-card flex items-center gap-3 border-3 bg-white p-3 lg:gap-4 lg:p-4">
                <Check className="text-special-pink-600 size-5 lg:size-6" />
                <span>점수뿐 아니라, AI를 활용하는 방식의 특징까지 함께 보여줍니다.</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]">
            <Image
              src="/images/main/img_system_04.png"
              width={300}
              height={300}
              alt=""
              className="h-[300px] w-[300px] shrink-0 object-cover"
            />
            <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
              <div className="txt-st2-bold text-center">결과 기반 학습 로드맵 연결</div>
              <div className="text-center">
                진단 결과와 관심 주제를 반영해
                <br />
                현재 수준에 맞는 학습 흐름을 제안합니다.
              </div>
              <div className="border-special-pink-100 rounded-card flex items-center gap-3 border-3 bg-white p-3 lg:gap-4 lg:p-4">
                <Check className="text-special-pink-600 size-5 lg:size-6" />
                <span>무엇을 먼저 배우고, 다음에 무엇을 확장할지 흐름으로 제안합니다.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="txt-st2-bold text-center">
          <span className="text-special-pink-600">*</span> AX Compass는{' '}
          <span className="text-special-pink-600">복합 진단 결과</span>와{' '}
          <span className="text-special-pink-600 break-keep">희망 학습 주제를 결합</span>해,
          <br />
          현재 수준에 맞는 학습 흐름을 제안합니다.
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
          <h2 className="txt-t1 text-shadow text-center">
            <span className="text-purple-700">교육 전후 변화</span>를 객관적으로 비교해 보세요.
          </h2>
          <p className="text-shadow flex flex-col gap-1 text-center">
            <span>
              AX Compass는 학습 로드맵 진행 이후, 동일 구조의 유사 문항 기반 재진단을 통해
            </span>
            <span>교육 전후의 역량 변화를 객관적으로 비교·분석한 리포트를 제공합니다.</span>
          </p>
        </div>
        <div className="flex max-w-[728px] flex-col gap-[50px]">
          <Image
            src="/images/main/img_compare_01.png"
            width={500}
            height={260}
            alt=""
            className="mx-auto aspect-50/26 h-full w-full max-w-[500px] object-cover"
          />
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]">
            <Image
              src="/images/main/img_compare_02.png"
              width={300}
              height={300}
              alt=""
              className="h-[300px] w-[300px] shrink-0 object-cover"
            />
            <div className="rounded-card border-special-navy-200 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 bg-white p-4 lg:gap-2.5">
              <div className="txt-st2-bold text-center">다면 진단 변화 비교</div>
              <div className="text-center">
                교육 전후 결과를 동일한 진단 구조 위에서 비교해,
                <br />
                자기 인식뿐 아니라 실제 판단과 실행 습관의 변화까지 입체적으로 확인할 수 있습니다.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]">
            <Image
              src="/images/main/img_compare_03.png"
              width={300}
              height={211}
              alt=""
              className="h-[211px] w-[300px] shrink-0 object-cover"
            />
            <div className="rounded-card border-special-navy-200 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 bg-white p-4 lg:gap-2.5">
              <div className="txt-st2-bold text-center">역량 분포 변화 비교</div>
              <div className="text-center">
                교육 전후의 역량 분포를 함께 시각화해,
                <br />
                단순 평균이 아니라 점수대 이동과 집단 수준의 변화 방향을 확인할 수 있습니다.
              </div>
            </div>
          </div>
        </div>
        <div className="txt-st2-bold text-center">
          <span className="text-purple-700">*</span> AX Compass는 기관 단위 진단과 학습 로드맵, 교육
          전후 비교 분석을 통해
          <br />
          조직의 <span className="text-purple-700"> AX 역량 변화를 객관적으로 확인</span>할 수
          있도록 지원합니다.
          <br />
          <br />
          <span className="text-purple-700">*</span> 본 내용은{' '}
          <span className="text-purple-700">기관에 제공</span>되는 분석 예시입니다.
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
          <h2 className="txt-t1 text-shadow text-center">
            AX Compass로
            <span className="text-special-pink-600"> 변화를 경험</span>해 보세요.
          </h2>
          <p className="text-shadow flex flex-col gap-1 text-center">
            <span>AX Compass는 조직의 현재 수준을 진단하고 해석하는 데서 그치지 않습니다.</span>
            <span>
              우선 과제를 명확히 하고, 교육 설계와 실행 방향까지 연결해 반복 가능한 AX 전환 기반을
              제공합니다.
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
            <div className="flex items-center justify-center gap-2 lg:gap-3">
              <View className="text-special-pink-600 size-6 lg:size-[30px]" />
              <div className="txt-st2-bold text-center">현재 수준 가시화</div>
            </div>
            <div className="text-center">
              조직의 AX 현재 수준과 역량 분포를 진단 결과 기준으로 한눈에 확인할 수 있습니다.
              <br />
              막연한 감이나 일부 사례가 아니라, 현재 어디에서 시작해야 하는지 객관적인 기준으로
              파악할 수 있습니다.
            </div>
          </div>
          <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
            <div className="flex items-center justify-center gap-2 lg:gap-3">
              <PackageOpen className="text-special-pink-600 size-6 lg:size-[30px]" />
              <div className="txt-st2-bold text-center">우선 과제 명확화</div>
            </div>
            <div className="text-center">
              무엇을 먼저 보완해야 하는지, 어떤 역량을 우선 강화해야 하는지 더 명확하게 정리할 수
              있습니다.
              <br />
              진단 결과를 바탕으로 우선순위를 구분해, 실행 가능한 다음 과제를 설정할 수 있습니다.
            </div>
          </div>
          <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
            <div className="flex items-center justify-center gap-2 lg:gap-3">
              <Map className="text-special-pink-600 size-6 lg:size-[30px]" />
              <div className="txt-st2-bold text-center">교육 설계의 구체화</div>
            </div>
            <div className="text-center">
              진단 결과를 바탕으로 기관 수준에 맞는 커리큘럼과 학습 흐름을 더 구체적으로 설계할 수
              있습니다.
              <br />
              공통 교육을 반복하는 것이 아니라, 현재 수준과 보완 포인트에 맞는 학습 방향을 제안할 수
              있습니다.
            </div>
          </div>
          <div className="bg-special-pink-0 rounded-card border-special-pink-100 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 p-4 lg:gap-2.5">
            <div className="flex items-center justify-center gap-2 lg:gap-3">
              <Repeat className="text-special-pink-600 size-6 lg:size-[30px]" />
              <div className="txt-st2-bold text-center">반복 가능한 성장 구조 확보</div>
            </div>
            <div className="text-center">
              진단, 학습, 전후 비교, 다음 단계 제안을 하나의 흐름으로 반복하며 지속적인 AX 성장
              구조를 만들 수 있습니다.
              <br />한 번의 교육으로 끝나는 것이 아니라, 다음 단계까지 이어지는 전환 구조를 설계할
              수 있습니다.
            </div>
          </div>
        </div>
        <div className="txt-st2-bold text-center">
          <span className="text-special-pink-600">*</span> 결과를 바탕으로,
          <span className="text-special-pink-600"> 조직의 다음 교육과 성장 방향까지</span> 설계해
          보세요.
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
          <h2 className="txt-t1 text-shadow text-center">
            이제,
            <span className="text-special-pink-600"> AX 역량</span>을 직접 확인해 보세요.
          </h2>
          <p className="text-shadow flex flex-col gap-1 text-center">
            <span>
              AX 역량을 빠르게 진단하고, 역량 프로필 기반으로 필요한 AI 학습 방향을 확인하세요.
            </span>
          </p>
        </div>
        <Button className="txt-st-bold h-20 lg:h-[130px]">검사 유형 선택 →</Button>
      </Section>
    </Container>
  );
}
