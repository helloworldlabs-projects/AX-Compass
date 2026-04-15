import { examService } from '@/api/services/exam.service';
import GeneralSurveyContainer from './GeneralSurveyContainer';

export default async function GeneralAssessmentPage() {
  const [expectationForm, examineeProfiles, examItems] = await Promise.all([
    examService.getExpectationForm(),
    examService.getExamineeProfiles(),
    examService.getExamItems('STANDARD'),
  ]);

  return (
    <GeneralSurveyContainer
      expectationForm={expectationForm}
      examineeProfiles={examineeProfiles}
      examItems={examItems}
    />
  );
}
