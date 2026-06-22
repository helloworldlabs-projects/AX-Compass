import Section from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Building2, Clock3, Gift, SquarePen } from 'lucide-react';

export function AssessmentStatsSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            누적 <span className="text-purple-700">진행</span> 데이터
          </>
        }
        description="AX Compass를 통해 축적된 진단 데이터를 기반으로 다양한 분석 결과를 제공합니다."
        as="h1"
      />
      <div className="flex max-w-[1272px] flex-wrap items-center justify-center gap-6">
        <div className="rounded-card border-special-navy-100 flex w-[300px] min-w-[300px] shrink-0 flex-col gap-3 border bg-white p-[20px] lg:gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-0 rounded-card flex h-[50px] w-[50px] shrink-0 items-center justify-center text-purple-700 lg:h-[75px] lg:w-[75px]">
              <Building2 className="size-9 lg:size-[50px]" />
            </div>
            <div className="txt-st2-bold">참여 기관</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-700">
              <span className="txt-t1">{'86'}</span>
              <span className="txt-t2">곳</span>
            </div>
          </div>
          <div className="text-center">
            다양한 산업과 분야의 기관이
            <br />
            함께하고 있습니다.
          </div>
        </div>
        <div className="rounded-card border-special-navy-100 flex w-[300px] min-w-[300px] shrink-0 flex-col gap-3 border bg-white p-[20px] lg:gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-0 rounded-card flex h-[50px] w-[50px] shrink-0 items-center justify-center text-purple-700 lg:h-[75px] lg:w-[75px]">
              <SquarePen className="size-9 lg:size-[50px]" />
            </div>
            <div className="txt-st2-bold">누적 검사 완료</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-700">
              <span className="txt-t1">{'12,840'}</span>
              <span className="txt-t2">건</span>
            </div>
          </div>
          <div className="text-center">
            다양한 기관의 AX 역량 진단 데이터가
            <br />
            축적되었습니다.
          </div>
        </div>
        <div className="rounded-card border-special-navy-100 flex w-[300px] min-w-[300px] shrink-0 flex-col gap-3 border bg-white p-[20px] lg:gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-0 rounded-card flex h-[50px] w-[50px] shrink-0 items-center justify-center text-purple-700 lg:h-[75px] lg:w-[75px]">
              <Clock3 className="size-9 lg:size-[50px]" />
            </div>
            <div className="txt-st2-bold">누적 검사 시간</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-700">
              <span className="txt-t1">{'4,920'}</span>
              <span className="txt-t2">시간</span>
            </div>
          </div>
          <div className="text-center">
            기관 구성원들이 AX 역량을 점검하는 데
            <br />
            함께한 시간입니다.
          </div>
        </div>
        <div className="rounded-card border-special-navy-100 flex w-[300px] min-w-[300px] shrink-0 flex-col gap-3 border bg-white p-[20px] lg:gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-0 rounded-card flex h-[50px] w-[50px] shrink-0 items-center justify-center text-purple-700 lg:h-[75px] lg:w-[75px]">
              <Gift className="size-9 lg:size-[50px]" />
            </div>
            <div className="txt-st2-bold">누적 검사비 지원</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-700">
              <span className="txt-t1">{'101,436,000'}</span>
              <span className="txt-t2">원</span>
            </div>
          </div>
          <div className="text-center">
            헬로월드랩스의 검사 비용 지원으로
            <br />
            검사 비용 부담 없이 참여할 수 있습니다.
          </div>
        </div>
      </div>
    </Section>
  );
}
