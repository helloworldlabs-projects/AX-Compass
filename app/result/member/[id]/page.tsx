import ResultContainer from '@/app/result/components/ResultContainer';
import { examService } from '@/api/services/exam.service';

export default async function MemberResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await examService.getExamResult(id);

  return <ResultContainer resultType="member" result={result} />;
}
