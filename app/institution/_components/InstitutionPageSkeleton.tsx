import Container from '@/components/layout/Container';

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-[20px] bg-gray-700 ${className ?? ''}`} />;
}

function HeaderSectionSkeleton() {
  return (
    <div className="flex w-full max-w-[700px] shrink-0 flex-col items-center gap-[50px] py-[50px]">
      {/* 기관명 */}
      <SkeletonBlock className="h-10 w-[300px]" />
      {/* 전체 평가 인원 레이블 */}
      <SkeletonBlock className="h-8 w-[200px]" />
      {/* 임원진 / 구성원 카드 + 버튼 */}
      <div className="flex gap-[50px]">
        <div className="flex flex-col items-center gap-4">
          <SkeletonBlock className="h-[130px] w-[300px]" />
          <SkeletonBlock className="h-10 w-[100px] rounded-[12px]" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <SkeletonBlock className="h-[130px] w-[300px]" />
          <SkeletonBlock className="h-10 w-[100px] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}

function BannersSectionSkeleton() {
  return (
    <div className="flex w-full max-w-[1000px] shrink-0 flex-col gap-[50px] py-[50px]">
      <SkeletonBlock className="h-[100px] w-full" />
      <SkeletonBlock className="h-[100px] w-full" />
    </div>
  );
}

function MaturitySectionSkeleton() {
  return (
    <div className="flex w-full max-w-[1000px] shrink-0 flex-col items-center gap-[50px] py-[50px]">
      {/* 기관명 + 부제 */}
      <div className="flex w-full max-w-[700px] flex-col gap-3">
        <SkeletonBlock className="h-9 w-[260px]" />
        <SkeletonBlock className="h-5 w-[180px]" />
      </div>
      {/* 현재/목표 성숙도 뱃지 카드 */}
      <div className="flex items-center gap-[50px]">
        <SkeletonBlock className="h-[108px] w-[160px]" />
        <SkeletonBlock className="h-[108px] w-[160px]" />
      </div>
      {/* 성숙도 상세 카드 */}
      <SkeletonBlock className="h-[200px] w-full max-w-[700px]" />
      {/* 바 차트 */}
      <SkeletonBlock className="h-[360px] w-full max-w-[900px]" />
      {/* 레이더 차트 패널 2개 */}
      <div className="flex flex-wrap items-center justify-center gap-[50px]">
        <SkeletonBlock className="h-[320px] w-[380px]" />
        <SkeletonBlock className="h-[320px] w-[380px]" />
      </div>
      {/* 결과 요약 */}
      <SkeletonBlock className="h-[160px] w-full max-w-[700px]" />
    </div>
  );
}

function StatSectionSkeleton({ titleWidth }: { titleWidth: string }) {
  return (
    <div className="flex w-full max-w-[1000px] shrink-0 flex-col items-center gap-[50px] py-[50px]">
      {/* 섹션 타이틀 */}
      <SkeletonBlock className={`h-10 ${titleWidth}`} />
      {/* 등급/점수 배지 행 */}
      <div className="flex items-center justify-center gap-4">
        <SkeletonBlock className="h-[108px] w-[160px]" />
        <SkeletonBlock className="h-[108px] w-[160px]" />
        <SkeletonBlock className="h-[108px] w-[160px]" />
        <SkeletonBlock className="h-[108px] w-[160px]" />
      </div>
      {/* 차트 영역 */}
      <div className="flex flex-wrap items-center justify-center gap-[50px]">
        <SkeletonBlock className="h-[260px] w-[380px]" />
        <SkeletonBlock className="h-[260px] w-[380px]" />
        <SkeletonBlock className="h-[260px] w-[380px]" />
        <SkeletonBlock className="h-[260px] w-[380px]" />
      </div>
    </div>
  );
}

function ProfileStatSectionSkeleton() {
  return (
    <div className="flex w-full max-w-[1000px] shrink-0 flex-col items-center gap-[50px] py-[50px]">
      <SkeletonBlock className="h-10 w-[240px]" />
      <div className="flex flex-wrap items-center justify-center gap-[50px]">
        <SkeletonBlock className="h-[300px] w-[380px]" />
        <SkeletonBlock className="h-[300px] w-[380px]" />
        <SkeletonBlock className="h-[300px] w-[380px]" />
      </div>
    </div>
  );
}

function LearningRoadmapSectionSkeleton() {
  return (
    <div className="flex w-full max-w-[1000px] shrink-0 flex-col items-center gap-[50px] py-[50px]">
      {/* 섹션 타이틀 */}
      <SkeletonBlock className="h-10 w-[320px]" />
      {/* 탭 버튼 영역 */}
      <div className="flex w-full gap-4">
        <SkeletonBlock className="h-20 flex-1" />
        <SkeletonBlock className="h-20 flex-1" />
        <SkeletonBlock className="h-20 flex-1" />
      </div>
      {/* 로드맵 트리 차트 */}
      <SkeletonBlock className="h-[400px] w-full" />
    </div>
  );
}

export function InstitutionPageSkeleton() {
  return (
    <Container>
      <HeaderSectionSkeleton />
      <BannersSectionSkeleton />
      <MaturitySectionSkeleton />
      <StatSectionSkeleton titleWidth="w-[240px]" />
      <StatSectionSkeleton titleWidth="w-[200px]" />
      <ProfileStatSectionSkeleton />
      <LearningRoadmapSectionSkeleton />
    </Container>
  );
}
