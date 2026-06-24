import { Suspense } from 'react';
import { examService } from '@/api/services/exam.service';
import SurveyContainer from '@/app/assessment/components/SurveyContainer';
import { SerialToastHandler } from './SerialToastHandler';

export const dynamic = 'force-dynamic';

export default async function GeneralAssessmentPage() {
  const [expectationForm, examineeProfiles] = await Promise.all([
    examService.getExpectationForm(),
    examService.getExamineeProfiles(),
  ]);

  return (
    <>
      <Suspense>
        <SerialToastHandler />
      </Suspense>
      <SurveyContainer
        examType="STANDARD"
        expectationForm={expectationForm}
        examineeProfiles={examineeProfiles}
      />
    </>
  );
}
