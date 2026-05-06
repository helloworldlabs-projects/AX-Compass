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
import { InstitutionPageSkeleton } from './_components/InstitutionPageSkeleton';

export default function InstitutionPage() {
  const { data: stats, isLoading, isError } = useInstitutionStats();

  if (isLoading) return <InstitutionPageSkeleton />;
  if (isError || !stats) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <Container>
      <Link
        href="https://helloworldlabs-1.gitbook.io/helloworldlabs-manual/IEjzBMwL1CRDQtU4u05j/ax-compass"
        target="_blank"
        rel="noopener noreferrer"
        className="txt-b-bold bg-special-pink-600 border-special-pink-0 absolute top-10 right-10 flex h-10 items-center justify-center rounded-[20px] border-2 px-6 text-white shadow"
      >
        기관 관리 매뉴얼 Link
      </Link>
      <InstitutionHeaderSection stats={stats} />
      <InstitutionNoticeBanners
        executiveExamCount={stats.executiveExamCount}
        memberExamCount={stats.memberExamCount}
      />
      {stats.executiveExamCount >= 2 && <MaturitySection stats={stats} />}

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
