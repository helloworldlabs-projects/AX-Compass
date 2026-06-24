import { CircleCheck, Gem } from 'lucide-react';

export function InstitutionPlanCard() {
  return (
    <div className="border-special-navy-300 flex max-w-[786px] gap-3 rounded-[20px] border bg-white px-3 py-2">
      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-[50px] items-center justify-center rounded-full bg-purple-700">
            <Gem className="size-8 text-white" />
          </div>
          <div className="txt-b-bold text-purple-700">프리미엄 플랜</div>
          <div className="bg-special-dark-blue-0 border-special-dark-blue-100 txt-b-bold text-special-dark-blue-700 rounded-[20px] border px-2 py-1">
            지원 적용 중
          </div>
        </div>
        <div className="txt-c1-regular">
          <span className="txt-c1-bold">헬로월드랩스</span>의 지원으로 별도 결제 없이 이용 중입니다.
        </div>
      </div>
      <div className="bg-special-navy-100 self-stretch w-px" />
      <div className="flex flex-col gap-3">
        <div className="txt-c1-bold">이 플랜에서 가능한 기능</div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 rounded-[12px] border border-purple-100 px-1.5 py-1">
            <CircleCheck className="size-5 text-purple-700" />
            <div className="txt-c2-regular">결과 데이터 영구 조회 </div>
          </div>
          <div className="flex gap-1 rounded-[12px] border border-purple-100 px-1.5 py-1">
            <CircleCheck className="size-5 text-purple-700" />
            <div className="txt-c2-regular">임원진 등록 및 검사 진행</div>
          </div>
          <div className="flex gap-1 rounded-[12px] border border-purple-100 px-1.5 py-1">
            <CircleCheck className="size-5 text-purple-700" />
            <div className="txt-c2-regular">구성원 등록 및 검사 진행</div>
          </div>
          <div className="flex gap-1 rounded-[12px] border border-purple-100 px-1.5 py-1">
            <CircleCheck className="size-5 text-purple-700" />
            <div className="txt-c2-regular">기본 결과 통계 제공</div>
          </div>
          <div className="flex gap-1 rounded-[12px] border border-purple-100 px-1.5 py-1">
            <CircleCheck className="size-5 text-purple-700" />
            <div className="txt-c2-regular">기관 결과 분석 리포트 제공</div>
          </div>
          <div className="flex gap-1 rounded-[12px] border border-purple-100 px-1.5 py-1">
            <CircleCheck className="size-5 text-purple-700" />
            <div className="txt-c2-regular">소속별 결과 확인 및 활용</div>
          </div>
        </div>
      </div>
    </div>
  );
}
