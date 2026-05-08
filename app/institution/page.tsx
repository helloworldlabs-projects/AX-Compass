'use client';

import { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useInstitutionStats } from '@/hooks/useInstitutionQueries';
import { InstitutionHeaderSection } from './_components/InstitutionHeaderSection';
import { InstitutionNoticeBanners } from './_components/InstitutionNoticeBanners';
import { MaturitySection } from './_components/MaturitySection';
import { GradeStatSection } from './_components/GradeStatSection';
import { ScoreStatSection } from './_components/ScoreStatSection';
import { ProfileStatSection } from './_components/ProfileStatSection';
import { LearningRoadmapSection } from './_components/LearningRoadmapSection';
import { InstitutionPageSkeleton } from './_components/InstitutionPageSkeleton';
import { Checkbox } from '@/components/ui/checkbox';

export default function InstitutionPage() {
  const [confirmedDepts, setConfirmedDepts] = useState<string[] | undefined>(undefined);

  // 체크박스 목록은 항상 unfiltered 쿼리에서 파생 (confirmedDepts와 무관)
  const { data: fullStats } = useInstitutionStats(undefined);
  // 실제 통계 데이터는 확정된 필터로 조회
  const { data: stats, isLoading, isError } = useInstitutionStats(confirmedDepts);

  const deptOptions = fullStats?.departments ?? [];
  const allDeptIds = deptOptions.map((d) => d.department);

  // null = 아직 상호작용 없음 → 전체 선택으로 간주
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);
  const effectiveSelectedIds = selectedIds ?? allDeptIds;
  const isAllSelected = selectedIds === null || selectedIds.length === deptOptions.length;
  const totalCount = deptOptions.reduce((sum, d) => sum + d.memberCount + d.executiveCount, 0);

  function toggleDept(department: string) {
    const current = effectiveSelectedIds;
    setSelectedIds(
      current.includes(department)
        ? current.filter((d) => d !== department)
        : [...current, department],
    );
  }

  function toggleAll() {
    setSelectedIds(isAllSelected ? [] : [...allDeptIds]);
  }

  function handleConfirm() {
    setConfirmedDepts(isAllSelected ? undefined : [...effectiveSelectedIds]);
  }

  if (isLoading) return <InstitutionPageSkeleton />;
  if (isError || !stats) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <Container>
      <Link
        data-print-hidden
        href="https://helloworldlabs-1.gitbook.io/helloworldlabs-manual/IEjzBMwL1CRDQtU4u05j/ax-compass"
        target="_blank"
        rel="noopener noreferrer"
        className="txt-b-bold bg-special-pink-600 border-special-pink-0 absolute top-10 right-10 flex h-10 items-center justify-center rounded-[20px] border-2 px-6 text-white shadow"
      >
        기관 관리 매뉴얼 Link
      </Link>
      <InstitutionHeaderSection stats={stats} />
      {fullStats && fullStats.departments.length > 1 && (
        <div
          data-print-hidden
          className="bg-special-dark-blue-0 flex w-full max-w-[700px] flex-col gap-6 rounded-[20px] border border-gray-100 p-6"
        >
          <div className="txt-b-bold flex gap-1">
            <div>※ </div>
            <div>
              결과를 확인할 소속 기관을 선택해 주세요.
              <br />
              선택 후 [확인] 버튼을 누르면 해당 소속 기관의 결과를 확인할 수 있습니다.
            </div>
          </div>
          <div className="flex flex-col gap-5 rounded-[20px] bg-white p-6">
            <Checkbox
              label={`전체 (${totalCount})`}
              id="all-institution-checkbox"
              className="size-6"
              checked={isAllSelected}
              onCheckedChange={toggleAll}
              disabled={deptOptions.length === 0}
            />
            <div className="flex flex-wrap gap-4">
              {deptOptions.map((dept) => (
                <Checkbox
                  key={dept.department}
                  label={`${dept.department} (${dept.memberCount + dept.executiveCount})`}
                  id={`dept-${dept.department}-checkbox`}
                  className="size-6"
                  checked={effectiveSelectedIds.includes(dept.department)}
                  onCheckedChange={() => toggleDept(dept.department)}
                />
              ))}
            </div>
          </div>
          <Button
            variant="dark-blue"
            className="mx-auto w-fit rounded-[12px]"
            onClick={handleConfirm}
            disabled={selectedIds !== null && selectedIds.length === 0}
          >
            확인
          </Button>
        </div>
      )}
      <InstitutionNoticeBanners
        executiveExamCount={stats.filteredCounts.executiveExamCount}
        memberExamCount={stats.filteredCounts.memberExamCount}
      />

      {stats.filteredCounts.executiveExamCount >= 1 && <MaturitySection stats={stats} />}

      {stats.filteredCounts.memberExamCount >= 3 && (
        <>
          {stats.competencyStats.length > 0 && (
            <GradeStatSection competencyStats={stats.competencyStats} />
          )}
          {stats.competencyStats.length > 0 && (
            <ScoreStatSection
              scoreStats={stats.scoreStats}
              competencyStats={stats.competencyStats}
            />
          )}
          {stats.profileStats.top3ProfileTypes.length > 0 && (
            <ProfileStatSection profileStats={stats.profileStats} />
          )}
          {(stats.institutionRoadmap.overallRoadmap !== null ||
            stats.institutionRoadmap.beginnerElementaryRoadmap !== null ||
            stats.institutionRoadmap.intermediateAdvancedRoadmap !== null) && (
            <LearningRoadmapSection institutionRoadmap={stats.institutionRoadmap} />
          )}
        </>
      )}

      <div data-print-hidden className="h-[3px] w-full max-w-[1000px] rounded-full bg-purple-700" />
      <Button data-print-hidden render={<Link href="/" />} variant="gray">
        메인으로
      </Button>
    </Container>
  );
}
