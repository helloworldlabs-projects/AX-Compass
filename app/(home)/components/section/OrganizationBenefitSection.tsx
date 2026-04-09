import Section from '@/components/layout/Section';
import { View, PackageOpen, Map, Repeat } from 'lucide-react';

export function OrganizationBenefitSection() {
  return (
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
            막연한 감이나 일부 사례가 아니라, 현재 어디에서 시작해야 하는지 객관적인 기준으로 파악할
            수 있습니다.
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
            진단, 학습, 전후 비교, 다음 단계 제안을 하나의 흐름으로 반복하며 지속적인 AX 성장 구조를
            만들 수 있습니다.
            <br />한 번의 교육으로 끝나는 것이 아니라, 다음 단계까지 이어지는 전환 구조를 설계할 수
            있습니다.
          </div>
        </div>
      </div>
      <div className="txt-st2-bold text-center">
        <span className="text-special-pink-600">*</span> 결과를 바탕으로,
        <span className="text-special-pink-600"> 조직의 다음 교육과 성장 방향까지</span> 설계해
        보세요.
      </div>
    </Section>
  );
}
