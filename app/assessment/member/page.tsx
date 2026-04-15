import { examService } from '@/api/services/exam.service';
import MemberSurveyContainer from './MemberSurveyContainer';

export default async function MemberAssessmentPage() {
  const [expectationForm, examineeProfiles, examItems] = await Promise.all([
    examService.getExpectationForm(),
    examService.getExamineeProfiles(),
    examService.getExamItems('PRECISION'),
  ]);

  return (
    <MemberSurveyContainer
      expectationForm={expectationForm}
      examineeProfiles={examineeProfiles}
      examItems={examItems}
    />
  );
}
