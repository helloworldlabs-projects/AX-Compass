import Section from '@/components/layout/Section';

export function OverviewSection() {
  return (
    <Section className="p-0">
      <div className="flex flex-col gap-[30px]">
        <div className="txt-t2">검사 개요</div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          <div>
            AX Compass는 AX 전환에 필요한 역량을 기준으로 현재 수준을 진단합니다.
            <br />
            문항 응답을 통해 개인의 이해 수준과 업무 적용 방식, 판단 기준을 종합적으로 확인하며,
            결과는 단순 점수 제공이 아니라 역량별 강점과 보완 포인트가 드러나도록 정리합니다.
            <br />
            진단 결과는 역량 프로필과 학습 로드맵 형태로 제공되어, 지금 어디에 있는지와 함께 다음
            단계에서 무엇을 보완하면 좋은지까지 확인할 수 있습니다.
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
  );
}
