import { useRef, useState } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useSubmitExam, useSubmitExecutiveExam } from '@/hooks/useExamQueries';
import type {
  ExamType,
  ExamItemDTO,
  ItemComponent,
  ItemType,
  ExamSubmitRequest,
  ExecutiveSubmitRequest,
  ExamineeProfilesDTO,
} from '@/types/exam';

const MIN_SPINNER_MS = 3000;

type FlatItem = ExamItemDTO & { component: ItemComponent; itemType: ItemType };

interface UseSurveySubmitProps {
  examType: ExamType;
  tokenKey: 'axcompass:accessToken' | undefined;
  flatItems: FlatItem[];
  examineeProfiles: ExamineeProfilesDTO | undefined;
  examineeAnswers: Record<string, string | string[]>;
  examAnswers: Record<string, number | string>;
  expectationAnswers: Record<string, string>;
  router: AppRouterInstance;
}

export function useSurveySubmit({
  examType,
  tokenKey,
  flatItems,
  examineeProfiles,
  examineeAnswers,
  examAnswers,
  expectationAnswers,
  router,
}: UseSurveySubmitProps) {
  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerStartRef = useRef<number>(0);

  const { mutate: submitExam } = useSubmitExam(examType !== 'EXECUTIVE' ? tokenKey : undefined);
  const { mutate: submitExecutiveExam } = useSubmitExecutiveExam(tokenKey);

  function withMinDelay(fn: () => void) {
    const remaining = Math.max(0, MIN_SPINNER_MS - (Date.now() - spinnerStartRef.current));
    setTimeout(fn, remaining);
  }

  function submit() {
    if (examType === 'EXECUTIVE') {
      const executiveBody: ExecutiveSubmitRequest = {
        responses: flatItems.map((item) => ({
          itemId: item.itemId,
          likertValue:
            item.itemType === 'LIKERT' || item.itemType === 'LIKERT_FREQ'
              ? (examAnswers[item.itemId] as number)
              : null,
          optionCode:
            item.itemType === 'SINGLE_CHOICE' ? (examAnswers[item.itemId] as string) : null,
        })),
        expectation: {
          targetAiTask: expectationAnswers['TARGET_AI_TASK'],
          learningExpectation: expectationAnswers['LEARNING_EXPECTATION'] ?? '',
        },
      };
      spinnerStartRef.current = Date.now();
      setShowSpinner(true);
      submitExecutiveExam(executiveBody, {
        onSuccess: (data) => {
          withMinDelay(() => router.push(`/result/executive/${data.resultCode}`));
        },
        onError: () => {
          withMinDelay(() => setShowSpinner(false));
        },
      });
    } else {
      const body: ExamSubmitRequest = {
        examType,
        profile: examineeProfiles
          ? {
              ageGroup: examineeAnswers['ageGroup'] as string,
              jobFunction: examineeAnswers['jobFunction'] as string,
              industry: examineeAnswers['industry'] as string,
              experienceLevel: examineeAnswers['experienceLevel'] as string,
              aiUsageFrequency: examineeAnswers['aiUsageFrequency'] as string,
              aiUsagePurposes: examineeAnswers['aiUsagePurposes'] as string[],
            }
          : undefined,
        responses: flatItems.map((item) => {
          const answer = examAnswers[item.itemId];
          const isLikert = ['LIKERT', 'LIKERT_FREQ'].includes(item.itemType.toUpperCase());
          return {
            itemId: item.itemId,
            likertValue: isLikert ? (answer as number) : null,
            optionCode: !isLikert ? (answer as string) : null,
          };
        }),
        expectation: {
          targetAiTask: expectationAnswers['TARGET_AI_TASK'],
          learningExpectation: expectationAnswers['LEARNING_EXPECTATION'] || undefined,
        },
      };
      spinnerStartRef.current = Date.now();
      setShowSpinner(true);
      submitExam(body, {
        onSuccess: (data) => {
          withMinDelay(() =>
            router.push(
              `/result/${examType === 'STANDARD' ? 'general' : 'member'}/${data.resultCode}`,
            ),
          );
        },
        onError: () => {
          withMinDelay(() => setShowSpinner(false));
        },
      });
    }
  }

  return { submit, showSpinner };
}
