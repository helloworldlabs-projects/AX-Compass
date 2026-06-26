import { useMemo, useState } from 'react';
import type { ItemComponent } from '@/types/exam';

type Step = 'INTRO' | 'EXAMINEE_PROFILES' | 'EXAM_ITEMS' | 'EXPECTATION_FORM';

interface UseSurveyStepProps {
  hasProfiles: boolean;
  totalExamItems: number;
  totalProfilePages: number;
  itemComponents: ItemComponent[];
}

export function useSurveyStep({
  hasProfiles,
  totalExamItems,
  totalProfilePages,
  itemComponents,
}: UseSurveyStepProps) {
  const [step, setStep] = useState<Step>('INTRO');
  const [profilePage, setProfilePage] = useState(0);
  const [examItemIndex, setExamItemIndex] = useState(0);
  const [componentIntroTarget, setComponentIntroTarget] = useState<ItemComponent | null>(null);

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

    // 컴포넌트 설명 페이지 확인 → 실제 문항으로 진입
    if (componentIntroTarget) {
      setComponentIntroTarget(null);
      return;
    }

    if (step === 'EXAMINEE_PROFILES' && profilePage < totalProfilePages - 1) {
      setProfilePage((p) => p + 1);
      return;
    }

    if (step === 'EXAM_ITEMS' && examItemIndex < totalExamItems - 1) {
      const nextIndex = examItemIndex + 1;
      // 컴포넌트 경계 진입 시 설명 페이지 노출
      if (itemComponents[nextIndex] !== itemComponents[examItemIndex]) {
        setComponentIntroTarget(itemComponents[nextIndex]);
      }
      setExamItemIndex(nextIndex);
      return;
    }

    const nextIndex = stepSequence.indexOf(step) + 1;
    if (nextIndex < stepSequence.length) {
      const nextStep = stepSequence[nextIndex];
      // EXAM_ITEMS 첫 진입 시 첫 번째 컴포넌트 설명 노출
      if (nextStep === 'EXAM_ITEMS' && itemComponents[0]) {
        setComponentIntroTarget(itemComponents[0]);
      }
      setStep(nextStep);
      setProfilePage(0);
    }
  }

  return { step, profilePage, examItemIndex, componentIntroTarget, goNext, isLastStep, stepSequence };
}
