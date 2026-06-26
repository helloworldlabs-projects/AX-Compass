import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import Link from 'next/link';
import type { InstitutionStats } from '@/types/institution';

interface InstitutionHeaderSectionProps {
  stats: InstitutionStats;
}

export function InstitutionHeaderSection({ stats }: InstitutionHeaderSectionProps) {
  return (
    <Section data-print-hidden className="flex w-[700px] shrink-0">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="txt-t1 flex-1">{stats.institutionName}</div>
        <Link
          data-print-hidden
          href="https://helloworldlabs-1.gitbook.io/helloworldlabs-manual/IEjzBMwL1CRDQtU4u05j/ax-compass"
          target="_blank"
          rel="noopener noreferrer"
          className="txt-b-bold bg-special-pink-600 border-special-pink-0 mt-1 flex h-10 items-center justify-center rounded-[20px] border-2 px-6 text-white shadow"
        >
          기관 관리 매뉴얼 보기
        </Link>
      </div>
      <div className="flex w-full items-center gap-4">
        <Users className="size-10 text-purple-700" />
        <span className="txt-t1 text-black">전체 평가 인원</span>
      </div>
      <div className="flex gap-[50px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-[130px] w-[300px] items-center justify-center rounded-[20px] border-3 border-gray-300 shadow">
            <span className="bg-special-dark-blue-500 absolute top-[-3px] left-[-3px] rounded-[20px] border-3 border-gray-300 px-2.5 py-2 text-white">
              임원진
            </span>
            <div className="txt-t1 text-black">
              {stats.totalCounts.executiveExamCount} / {stats.totalCounts.executiveCount} 명
            </div>
          </div>
          <Button
            render={<Link href="/institution/executive" />}
            variant="dark-blue"
            size="pill"
            className="w-fit rounded-[12px]"
          >
            상세 보기
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-[130px] w-[300px] items-center justify-center rounded-[20px] border-3 border-gray-300 shadow">
            <span className="bg-special-navy-500 absolute top-[-3px] left-[-3px] rounded-[20px] border-3 border-gray-300 px-2.5 py-2 text-white">
              구성원
            </span>
            <div className="txt-t1 text-black">
              {stats.totalCounts.memberExamCount} / {stats.totalCounts.memberCount} 명
            </div>
          </div>
          <Button
            render={<Link href="/institution/member" />}
            variant="navy"
            size="pill"
            className="w-fit rounded-[12px]"
          >
            상세 보기
          </Button>
        </div>
      </div>
    </Section>
  );
}
