import { examService } from '@/api/services/exam.service';
import SurveyContainer from '@/app/assessment/components/SurveyContainer';

export const dynamic = 'force-dynamic';

export default async function ExecutiveAssessmentPage() {
  const expectationForm = await examService.getExecutiveExpectationForm();

  return <SurveyContainer examType="EXECUTIVE" expectationForm={expectationForm} />;
}
