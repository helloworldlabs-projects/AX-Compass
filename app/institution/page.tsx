'use client';

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

export default function InstitutionPage() {
  const { data: stats, isLoading, isError } = useInstitutionStats();

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !stats) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <Container>
      {/* 디버그 패널 */}
      {(process.env.NEXT_PUBLIC_APP_ENV === 'local' ||
        process.env.NEXT_PUBLIC_APP_ENV === 'dev') && (
        <details
          open
          className="fixed right-4 bottom-4 z-[9999] w-[400px] rounded-[12px] border-2 border-dashed border-yellow-400 bg-yellow-50 p-4 shadow-lg"
        >
          <summary className="cursor-pointer font-mono text-sm font-bold text-yellow-700">
            [DEBUG] institution stats
          </summary>
          <pre className="mt-2 max-h-[400px] overflow-auto font-mono text-xs text-yellow-900">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </details>
      )}

      <InstitutionHeaderSection stats={stats} />
      <InstitutionNoticeBanners
        executiveExamCount={stats.executiveExamCount}
        memberExamCount={stats.memberExamCount}
      />
      {stats.executiveExamCount >= 2 && <MaturitySection institutionName={stats.institutionName} />}

      {stats.memberExamCount >= 5 && (
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
            <LearningRoadmapSection
              institutionRoadmap={stats.institutionRoadmap}
              memberExamCount={stats.memberExamCount}
            />
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
