import { examService } from '@/api/services/exam.service';
import ExecutiveResultContainer from './ExecutiveResultContainer';
import { notFound } from 'next/navigation';
import { ApiError } from '@/types/common';

export default async function ExecutiveResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await examService.getExecutiveResult(id).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });

  return <ExecutiveResultContainer result={result} />;
}
