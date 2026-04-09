import Section from '@/components/layout/Section';
import {
  ApplicationIcon,
  EvaluationIcon,
  ResponsibilityIcon,
  UnderstandingIcon,
} from '@/components/icons';

export function CompetencySection() {
  return (
    <Section className="p-0">
      <div className="flex w-full flex-col gap-[30px]">
        <div className="txt-t2">역량 설계</div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          AX Compass는 AX 전환에 필요한 역량을 기준으로 진단을 설계했습니다.
          <br />
          진단 결과는 아래 4개 역량군을 중심으로 구조화되며, 역량군별 세부 역량을 통해 강점과 보완
          포인트를 명확히 확인할 수 있습니다.
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
              개인정보·기밀·저작권·조직 정책을 준수하고, 위험한 사용을 피하며 안전한 대안을 선택하는
              역량입니다.
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
  );
}
