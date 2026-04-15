import { examService } from '@/api/services/exam.service';
import SurveyContainer from '@/app/assessment/components/SurveyContainer';

export const dynamic = 'force-dynamic';

export default async function GeneralAssessmentPage() {
  const [expectationForm, examineeProfiles, examItems] = await Promise.all([
    examService.getExpectationForm(),
    examService.getExamineeProfiles(),
    examService.getExamItems('STANDARD'),
  ]);

  return (
    <SurveyContainer
      examType="STANDARD"
      expectationForm={expectationForm}
      examineeProfiles={examineeProfiles}
      examItems={examItems}
    />
  );
}
