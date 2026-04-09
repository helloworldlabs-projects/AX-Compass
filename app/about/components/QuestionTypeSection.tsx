import Section from '@/components/layout/Section';
import Image from 'next/image';

export function QuestionTypeSection() {
  return (
    <Section className="p-0">
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
                      현재 수준에 대한 자기 인식과 자신감, 준비도를 빠르게 점검할 수 있어 진단 진입
                      부담이 낮습니다.
                    </li>
                    <li>
                      자기평가 문항은 진단의 한 부분으로 활용되며, 상황 판단과 행동 빈도 문항과 함께
                      역량을 종합적으로 확인합니다.
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
                      실제 업무에서 어떤 기준으로 판단하고 어떤 방식으로 문제를 해결하는지 확인할 수
                      있습니다.
                    </li>
                    <li>
                      자기평가에서 드러나지 않는 &quot;실제 판단 방식&quot;이 반영되어, 결과가 더
                      현실적인 방향으로 정리됩니다.
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
                      알고 있는지/판단할 수 있는지와 별개로, 실제 업무에서 얼마나 실행되고 있는지를
                      확인합니다.
                    </li>
                    <li>
                      이를 통해 추천 로드맵이 단순 이론이 아니라, 현재의 실행 수준을 고려한 방향으로
                      제안될 수 있습니다.
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
  );
}
