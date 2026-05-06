import ResultContainer from '@/app/result/components/ResultContainer';
import { examService } from '@/api/services/exam.service';
import { notFound } from 'next/navigation';
import { ApiError } from '@/types/common';

export default async function MemberResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await examService.getExamResult(id).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });

  return <ResultContainer resultType="member" result={result} />;
}
