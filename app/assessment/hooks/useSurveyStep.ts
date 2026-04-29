import { useMemo, useState } from 'react';

type Step = 'INTRO' | 'EXAMINEE_PROFILES' | 'EXAM_ITEMS' | 'EXPECTATION_FORM';

interface UseSurveyStepProps {
  hasProfiles: boolean;
  totalExamItems: number;
  totalProfilePages: number;
}

export function useSurveyStep({
  hasProfiles,
  totalExamItems,
  totalProfilePages,
}: UseSurveyStepProps) {
  const [step, setStep] = useState<Step>('INTRO');
  const [profilePage, setProfilePage] = useState(0);
  const [examItemIndex, setExamItemIndex] = useState(0);

  const stepSequence = useMemo<Step[]>(
    () => [
      'INTRO',
      ...(hasProfiles ? (['EXAMINEE_PROFILES'] as Step[]) : []),
      'EXAM_ITEMS',
      'EXPECTATION_FORM',
    ],
    [hasProfiles],
  );

  const isLastStep = step === stepSequence[stepSequence.length - 1];

  function goNext() {
    window.scrollTo({ top: 0 });

    if (step === 'EXAMINEE_PROFILES' && profilePage < totalProfilePages - 1) {
      setProfilePage((p) => p + 1);
      return;
    }

    if (step === 'EXAM_ITEMS' && examItemIndex < totalExamItems - 1) {
      setExamItemIndex((i) => i + 1);
      return;
    }

    const nextIndex = stepSequence.indexOf(step) + 1;
    if (nextIndex < stepSequence.length) {
      setStep(stepSequence[nextIndex]);
      setProfilePage(0);
    }
  }

  return { step, profilePage, examItemIndex, goNext, isLastStep, stepSequence };
}
