import Container from '@/components/layout/Container';

function SkeletonLine({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-gray-200 ${className ?? ''}`} />;
}

export default function SurveyLoadingSkeleton() {
  return (
    <Container>
      <div className="flex w-full max-w-[1000px] flex-col gap-[30px]">
        {/* Progress bar — SurveyContainer와 동일한 구조 */}
        <div className="rounded-card flex h-15 w-full items-center justify-between bg-white px-3 shadow lg:px-4">
          <SkeletonLine className="h-4 w-[180px]" />
          <div className="bg-special-dark-blue-0 flex h-[44px] w-[300px] max-w-[45%] shrink-0 items-center justify-center gap-2.5 rounded-[20px] pl-4">
            <SkeletonLine className="h-4 w-10" />
            <div className="bg-special-dark-blue-100 h-full flex-1 overflow-hidden rounded-[20px] p-0.5 lg:p-1">
              <div className="bg-special-dark-blue-200 flex h-full min-w-[36px] animate-pulse items-center justify-center rounded-[20px] lg:h-[36px]" />
            </div>
          </div>
        </div>

        {/* IntroStep 카드 — 실제 레이아웃 1:1 */}
        <div className="rounded-card flex flex-col gap-6 bg-white px-4 py-6 shadow lg:px-20">
          {/* 제목: "※ 검사 시작 전 안내" */}
          <SkeletonLine className="mx-auto h-6 w-48" />

          <div className="flex flex-col gap-6">
            {/* 1. 검사 구성 안내 — 리스트 3개 */}
            <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
              <SkeletonLine className="h-4 w-32" />
              <ul className="ml-4 flex list-outside list-disc flex-col gap-1.5">
                <li>
                  <SkeletonLine className="h-3 w-full" />
                </li>
                <li>
                  <SkeletonLine className="h-3 w-[90%]" />
                </li>
                <li>
                  <SkeletonLine className="h-3 w-[85%]" />
                </li>
              </ul>
            </div>

            {/* 2. 응답 방식 안내 — 리스트 2개 */}
            <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
              <SkeletonLine className="h-4 w-32" />
              <ul className="ml-4 flex list-outside list-disc flex-col gap-1.5">
                <li>
                  <SkeletonLine className="h-3 w-full" />
                </li>
                <li>
                  <SkeletonLine className="h-3 w-[88%]" />
                </li>
              </ul>
            </div>

            {/* 3. 진행 유의사항 — 리스트 2개 */}
            <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
              <SkeletonLine className="h-4 w-32" />
              <ul className="ml-4 flex list-outside list-disc flex-col gap-1.5">
                <li>
                  <SkeletonLine className="h-3 w-full" />
                </li>
                <li>
                  <SkeletonLine className="h-3 w-[92%]" />
                </li>
              </ul>
            </div>
          </div>

          {/* 개인정보 동의 박스 */}
          <div className="rounded-card mx-auto flex w-full max-w-[500px] flex-col gap-3 border-2 border-gray-100 bg-white p-3 lg:gap-4 lg:px-[30px] lg:py-4">
            {/* 체크박스 + 레이블 */}
            <div className="mb-1 flex items-center gap-3">
              <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-gray-200" />
              <SkeletonLine className="h-4 w-64" />
            </div>
            {/* 동의 내용 박스 */}
            <div className="bg-gray-0 rounded-[12px] p-3 lg:p-4">
              <ul className="ml-4 flex list-outside list-disc flex-col gap-1.5">
                <li>
                  <SkeletonLine className="h-3 w-full" />
                </li>
                <li>
                  <SkeletonLine className="h-3 w-[70%]" />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 다음으로 버튼 */}
        <div className="mx-auto h-10 w-32 animate-pulse rounded-full bg-gray-200" />
      </div>
    </Container>
  );
}
