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
import SectionNav from '@/components/layout/SectionNav';
import type { SectionNavGroup } from '@/components/layout/SectionNav';
import { InstitutionPlanCard } from './_components/InstitutionPlanCard';
import { ReportRequestCard } from './_components/ReportRequestCard';

const MATURITY_ITEMS = [
  { label: 'AX 성숙도 등급', targetId: 'maturity-grade' },
  { label: '성숙도 점수 통계', targetId: 'maturity-score' },
  { label: '영역별 성숙도 통계', targetId: 'maturity-domain-stats' },
];

const COMPETENCY_ITEMS = [
  { label: 'AX 역량 등급', targetId: 'competency-grade' },
  { label: '역량 점수 통계', targetId: 'competency-score' },
  { label: '영역별 역량 통계', targetId: 'competency-domain-stats' },
  { label: '프로필 유형 통계', targetId: 'profile-type-stats' },
  { label: '추천 학습 로드맵', targetId: 'learning-roadmap' },
];

export default function InstitutionPage() {
  const [confirmedDepts, setConfirmedDepts] = useState<string[] | undefined>(undefined);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

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

  const hasMaturity = stats.filteredCounts.executiveExamCount >= 1;
  const hasCompetency = stats.filteredCounts.memberExamCount >= 3;
  const hasBoth = hasMaturity && hasCompetency;

  const navGroups: SectionNavGroup[] = [
    ...(hasMaturity
      ? [
          {
            groupLabel: 'AX 성숙도 검사 통계',
            items: MATURITY_ITEMS,
            expandButton: hasBoth && activeGroupIndex !== 0,
            onExpand: () => {
              setActiveGroupIndex(0);
              setTimeout(() => document.getElementById('maturity-grade')?.scrollIntoView(), 0);
            },
          },
        ]
      : []),
    ...(hasCompetency
      ? [
          {
            groupLabel: 'AX 역량 검사 통계',
            items: COMPETENCY_ITEMS,
            expandButton: hasBoth && activeGroupIndex !== 1,
            onExpand: () => {
              setActiveGroupIndex(1);
              setTimeout(() => document.getElementById('competency-grade')?.scrollIntoView(), 0);
            },
          },
        ]
      : []),
  ];

  return (
    <>
      {navGroups.length > 0 && (
        <SectionNav
          type="institution"
          groups={navGroups}
          onActiveGroupChange={hasBoth ? setActiveGroupIndex : undefined}
        />
      )}
      <Container>
        <InstitutionPlanCard />
        <InstitutionHeaderSection stats={stats} />
        {fullStats &&
          fullStats?.totalCounts.executiveExamCount > 0 &&
          fullStats?.totalCounts.memberExamCount > 2 && (
            <ReportRequestCard institutionName={fullStats.institutionName} />
          )}
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

        <div
          data-print-hidden
          className="h-[3px] w-full max-w-[1000px] rounded-full bg-purple-700"
        />
        <Button data-print-hidden render={<Link href="/" />} variant="gray">
          메인으로
        </Button>
      </Container>
    </>
  );
}
