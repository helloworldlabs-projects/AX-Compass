import { examService } from '@/api/services/exam.service';
import SurveyContainer from '@/app/assessment/components/SurveyContainer';

export const dynamic = 'force-dynamic';

export default async function MemberAssessmentPage() {
  const [expectationForm, examineeProfiles, examItems] = await Promise.all([
    examService.getExpectationForm(),
    examService.getExamineeProfiles(),
    examService.getExamItems('PRECISION'),
  ]);

  return (
    <SurveyContainer
      examType="PRECISION"
      expectationForm={expectationForm}
      examineeProfiles={examineeProfiles}
      examItems={examItems}
    />
  );
}
