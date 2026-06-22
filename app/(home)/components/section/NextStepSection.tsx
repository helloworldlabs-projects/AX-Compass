import Section from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Clock3, Goal, ListOrdered, SquarePen } from 'lucide-react';

export function NextStepSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            진단 결과를 <span className="text-purple-700">다음 실행으로</span> 연결해 보세요.
          </>
        }
        description="검사 결과 리포트는 기관의 현재 수준을 확인하고, 개선 방향과 AX 전환 실행 계획을 수립하는 데 활용할 수 있습니다."
      />
      <div className="flex max-w-[1272px] flex-wrap justify-center gap-6">
        <div className="border-special-navy-100 flex w-[300px] min-w-[300px] shrink-0 flex-col gap-4 rounded-[20px] border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-0 flex size-[50px] items-center justify-center rounded-full">
              <SquarePen className="size-8 text-purple-700" />
            </div>
            <div className="txt-st2-bold">의사결정 지원</div>
          </div>
          <div className="h-px w-full bg-purple-300" />
          <div className="txt-b-regular">
            기관의 현재 AX 수준과 주요 격차를 객관적으로 확인하고, 내부 공유와 향후 의사결정의
            근거로 활용할 수 있습니다.
          </div>
        </div>
        <div className="border-special-navy-100 flex w-[300px] min-w-[300px] shrink-0 flex-col gap-4 rounded-[20px] border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-0 flex size-[50px] items-center justify-center rounded-full">
              <ListOrdered className="size-8 text-purple-700" />
            </div>
            <div className="txt-st2-bold">개선 우선순위 설정</div>
          </div>
          <div className="h-px w-full bg-purple-300" />
          <div className="txt-b-regular">
            보완이 필요한 영역과 대상을 확인하여 우선적으로 추진해야 할 개선 과제를 구체화할 수
            있습니다.
          </div>
        </div>
        <div className="border-special-navy-100 flex w-[300px] min-w-[300px] shrink-0 flex-col gap-4 rounded-[20px] border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-0 flex size-[50px] items-center justify-center rounded-full">
              <Goal className="size-8 text-purple-700" />
            </div>
            <div className="txt-st2-bold">실행 로드맵 수립</div>
          </div>
          <div className="h-px w-full bg-purple-300" />
          <div className="txt-b-regular">
            진단 결과를 바탕으로 단계별 개선 과제와 AX 전환 실행 방향을 체계적으로 설계할 수
            있습니다.
          </div>
        </div>
        <div className="border-special-navy-100 flex w-[300px] min-w-[300px] shrink-0 flex-col gap-4 rounded-[20px] border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-0 flex size-[50px] items-center justify-center rounded-full">
              <Clock3 className="size-8 text-purple-700" />
            </div>
            <div className="txt-st2-bold">사후 변화 비교</div>
          </div>
          <div className="h-px w-full bg-purple-300" />
          <div className="txt-b-regular">
            재검사를 통해 역량 변화를 비교하고, 추진 성과와 후속 개선 과제를 지속적으로 점검할 수
            있습니다.
          </div>
        </div>
      </div>
    </Section>
  );
}
