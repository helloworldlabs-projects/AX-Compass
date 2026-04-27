import { examService } from '@/api/services/exam.service';
import ExecutiveResultContainer from './ExecutiveResultContainer';

export default async function ExecutiveResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await examService.getExecutiveResult(id);

  return <ExecutiveResultContainer result={result} />;
}
