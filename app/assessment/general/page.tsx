import { examService } from '@/api/services/exam.service';
import SurveyContainer from '@/app/assessment/components/SurveyContainer';

export const dynamic = 'force-dynamic';

export default async function GeneralAssessmentPage() {
  const [expectationForm, examineeProfiles] = await Promise.all([
    examService.getExpectationForm(),
    examService.getExamineeProfiles(),
  ]);

  return (
    <SurveyContainer
      examType="STANDARD"
      expectationForm={expectationForm}
      examineeProfiles={examineeProfiles}
    />
  );
}
