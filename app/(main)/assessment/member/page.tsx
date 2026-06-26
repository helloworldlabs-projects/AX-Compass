import { examService } from '@/api/services/exam.service';
import SurveyContainer from '@/app/(main)/assessment/components/SurveyContainer';

export const dynamic = 'force-dynamic';

export default async function MemberAssessmentPage() {
  const [expectationForm, examineeProfiles] = await Promise.all([
    examService.getExpectationForm(),
    examService.getExamineeProfiles(),
  ]);

  return (
    <SurveyContainer
      examType="PRECISION"
      expectationForm={expectationForm}
      examineeProfiles={examineeProfiles}
    />
  );
}
