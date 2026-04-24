'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import IntroStep from '@/app/assessment/components/steps/IntroStep';
import ExamineeProfilesStep from '@/app/assessment/components/steps/ExamineeProfilesStep';
import ExamItemsStep from '@/app/assessment/components/steps/ExamItemsStep';
import ExpectationsStep from '@/app/assessment/components/steps/ExpectationsStep';
import { useExamItems, useSubmitExam } from '@/hooks/useExamQueries';
import type {
  ExpectationFormDTO,
  ExamineeProfilesDTO,
  ExamSubmitRequest,
  ItemComponent,
  ItemType,
  ExamItemDTO,
  ExamType,
} from '@/types/exam';
import { ApiError } from '@/types/common';
import { CompassIcon } from '@/components/icons/CompassIcon';
import Image from 'next/image';
import SurveyLoadingSkeleton from './SurveyLoadingSkeleton';

type Step = 'INTRO' | 'EXAMINEE_PROFILES' | 'EXAM_ITEMS' | 'EXPECTATION_FORM';

interface SurveyContainerProps {
  examType: ExamType;
  expectationForm: ExpectationFormDTO;
  examineeProfiles: ExamineeProfilesDTO;
}

type FlatItem = ExamItemDTO & { component: ItemComponent; itemType: ItemType };

function hasAnswer(value: string | string[] | undefined): boolean {
  if (value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  return value !== '';
}

export default function SurveyContainer({
  examType,
  expectationForm,
  examineeProfiles,
}: SurveyContainerProps) {
  const router = useRouter();
  const tokenKey = examType !== 'STANDARD' ? ('axcompass:accessToken' as const) : undefined;
  const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam(tokenKey);
  const {
    data: examItems,
    isLoading: isLoadingItems,
    error: examItemsError,
  } = useExamItems(examType, tokenKey);

  useEffect(() => {
    if (!examItemsError) return;
    if (
      examItemsError instanceof ApiError &&
      (examItemsError.status === 401 || examItemsError.status === 403)
    ) {
      router.replace('/assessment');
    }
  }, [examItemsError, router]);

  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerStartRef = useRef<number>(0);

  const [step, setStep] = useState<Step>('INTRO');
  const [agreed, setAgreed] = useState(false);
  const [profilePage, setProfilePage] = useState(0);
  const [examItemIndex, setExamItemIndex] = useState(0);
  const [examineeAnswers, setExamineeAnswers] = useState<Record<string, string | string[]>>({});
  const [examAnswers, setExamAnswers] = useState<Record<string, number | string>>({});
  const [expectationAnswers, setExpectationAnswers] = useState<Record<string, string>>({});

  const flatItems: FlatItem[] =
    examItems?.sections.flatMap((section) =>
      section.items.map((item) => ({
        ...item,
        component: section.component,
        itemType: section.itemType,
      })),
    ) ?? [];

  // Progress percent
  let progressPercent = 0;
  if (step === 'EXAM_ITEMS') {
    progressPercent = examItems ? Math.round((examItemIndex / examItems.totalItems) * 100) : 0;
  } else if (step === 'EXPECTATION_FORM') {
    progressPercent = 100;
  }

  // Section label
  let sectionLabel = '';
  if (step === 'INTRO') {
    sectionLabel = '※ 검사 시작 전 안내';
  } else if (step === 'EXAMINEE_PROFILES') {
    sectionLabel = `※ ${examineeProfiles.formTitle}`;
  } else if (step === 'EXAM_ITEMS') {
    const currentItem = flatItems[examItemIndex];
    if (currentItem?.component === 'SELF_ESTIMATE') {
      sectionLabel = '* 자기평가(Self-Estimate)';
    } else if (currentItem?.component === 'SITUATIONAL_JUDGMENT') {
      sectionLabel = '* 상황판단(Situational Judgment)';
    } else {
      sectionLabel = '* 행동빈도(Behavior Habit)';
    }
  } else {
    sectionLabel = `※ ${expectationForm.formTitle}`;
  }

  // Current profile batch (3 questions per page)
  const currentBatch = examineeProfiles.questions.slice(profilePage * 3, profilePage * 3 + 3);

  // canProceed
  let canProceed = false;
  if (step === 'INTRO') {
    canProceed = agreed;
  } else if (step === 'EXAMINEE_PROFILES') {
    canProceed = currentBatch.every((q) => hasAnswer(examineeAnswers[q.questionCode]));
  } else if (step === 'EXAM_ITEMS') {
    const currentItemId = flatItems[examItemIndex]?.itemId;
    canProceed = currentItemId !== undefined && examAnswers[currentItemId] !== undefined;
  } else {
    canProceed = expectationForm.questions
      .filter((q) => q.required)
      .every((q) => !!expectationAnswers[q.questionCode]);
  }

  // Handlers
  function handleExamineeAnswer(code: string, value: string | string[]) {
    setExamineeAnswers((prev) => ({ ...prev, [code]: value }));
  }

  function handleExamAnswer(value: number | string) {
    const itemId = flatItems[examItemIndex]?.itemId;
    if (itemId === undefined) return;
    setExamAnswers((prev) => ({ ...prev, [itemId]: value }));
  }

  function handleExpectationAnswer(code: string, value: string) {
    setExpectationAnswers((prev) => ({ ...prev, [code]: value }));
  }

  function handleNext() {
    if (!examItems) return;
    window.scrollTo({ top: 0 });
    if (step === 'INTRO') {
      setStep('EXAMINEE_PROFILES');
      setProfilePage(0);
    } else if (step === 'EXAMINEE_PROFILES') {
      if (profilePage < 1) {
        setProfilePage((p) => p + 1);
      } else {
        setStep('EXAM_ITEMS');
        setExamItemIndex(0);
      }
    } else if (step === 'EXAM_ITEMS') {
      if (examItemIndex < examItems.totalItems - 1) {
        setExamItemIndex((i) => i + 1);
      } else {
        setStep('EXPECTATION_FORM');
      }
    } else {
      const body: ExamSubmitRequest = {
        examType,
        profile: {
          ageGroup: examineeAnswers['ageGroup'] as string,
          jobFunction: examineeAnswers['jobFunction'] as string,
          industry: examineeAnswers['industry'] as string,
          experienceLevel: examineeAnswers['experienceLevel'] as string,
          aiUsageFrequency: examineeAnswers['aiUsageFrequency'] as string,
          aiUsagePurposes: examineeAnswers['aiUsagePurposes'] as string[],
        },
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
          const remaining = Math.max(0, 3000 - (Date.now() - spinnerStartRef.current));
          setTimeout(
            () =>
              router.push(
                `/result/${examType === 'STANDARD' ? 'general' : 'member'}/${data.resultCode}`,
              ),
            remaining,
          );
        },
        onError: () => {
          const remaining = Math.max(0, 3000 - (Date.now() - spinnerStartRef.current));
          setTimeout(() => setShowSpinner(false), remaining);
        },
      });
    }
  }

  const handleNextRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    handleNextRef.current = canProceed && !showSpinner ? handleNext : () => {};
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter') return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA') return;
      if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
        e.preventDefault();
        e.stopPropagation();
      }
      handleNextRef.current();
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  if (isLoadingItems || !examItems) return <SurveyLoadingSkeleton />;

  if (showSpinner) {
    return (
      <Container>
        <CompassIcon className="h-[300px] w-[270px] lg:h-[600px] lg:w-[540px]" />
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-[50px]">
            <Image
              src="/images/loading_spinner.gif"
              alt=""
              width={200}
              height={20}
              className="h-[160px] w-[160px] object-contain lg:h-[200px] lg:w-[200px]"
            />
            <div className="txt-st2-regular text-center text-black">
              진단 결과를 정리하고 있습니다.
              <br />
              페이지를 닫지 말고 잠시만 기다려 주세요.
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex w-full max-w-[1000px] flex-col gap-[30px]">
        {/* Progress bar */}
        <div className="rounded-card flex h-15 w-full items-center justify-between bg-white px-3 shadow lg:px-4">
          <div className="txt-c1-bold max-w-[55%] truncate text-gray-700 lg:max-w-none">
            {sectionLabel.startsWith('*') ? (
              <>
                <span className="text-purple-700">*</span>
                {sectionLabel.slice(1)}
              </>
            ) : (
              sectionLabel
            )}
          </div>
          <div className="bg-special-dark-blue-0 flex h-[44px] w-[300px] max-w-[45%] shrink-0 items-center justify-center gap-2.5 rounded-[20px] pl-4">
            <div className="txt-c1-bold text-gray-700">
              진행 <br className="block lg:hidden" />
              현황
            </div>
            <div className="bg-special-dark-blue-100 h-full flex-1 overflow-hidden rounded-[20px] p-1">
              <div
                className="bg-special-dark-blue-500 flex h-full min-w-[36px] items-center justify-center rounded-[20px] lg:h-[36px] lg:min-w-[36px]"
                style={{ width: `${progressPercent}%` }}
              >
                <span className="txt-b-bold whitespace-nowrap text-white">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step rendering */}
        {step === 'INTRO' && <IntroStep agreed={agreed} setAgreed={setAgreed} />}

        {step === 'EXAMINEE_PROFILES' && (
          <ExamineeProfilesStep
            questions={currentBatch}
            answers={examineeAnswers}
            onAnswerChange={handleExamineeAnswer}
            startIndex={profilePage * 3 + 1}
          />
        )}

        {step === 'EXAM_ITEMS' && (
          <ExamItemsStep
            key={examItemIndex}
            item={flatItems[examItemIndex]}
            questionNumber={examItemIndex + 1}
            answer={examAnswers[flatItems[examItemIndex].itemId]}
            onAnswer={handleExamAnswer}
          />
        )}

        {step === 'EXPECTATION_FORM' && (
          <ExpectationsStep
            questions={expectationForm.questions}
            answers={expectationAnswers}
            onAnswerChange={handleExpectationAnswer}
          />
        )}

        <div className="relative flex items-center justify-center gap-2.5">
          <Button
            variant="purple"
            className="w-fit"
            disabled={!canProceed || showSpinner}
            onClick={handleNext}
          >
            {step === 'EXPECTATION_FORM' ? '결과 확인' : '다음으로'}
          </Button>
          <div className="border-special-orange-100 txt-c2-bold bg-special-orange-500 absolute top-1/2 right-1/2 hidden translate-x-[calc(50%+100px)] -translate-y-1/2 rounded-[20px] border px-2 py-0.5 text-white lg:block">
            ENTER 대응
          </div>
        </div>
      </div>

      {/* ===== DEBUG PANEL START — DELETE BEFORE RELEASE ===== */}
      {(process.env.NEXT_PUBLIC_APP_ENV === 'local' ||
        process.env.NEXT_PUBLIC_APP_ENV === 'dev') && (
        <div className="fixed right-4 bottom-4 z-50 flex max-h-[80vh] w-80 flex-col overflow-y-auto rounded-lg bg-gray-900/90 p-3 font-mono text-xs text-white shadow-xl">
          <p className="mb-2 border-b border-gray-600 pb-1 text-yellow-400">DEBUG — answer state</p>

          <div className="mb-1">
            <span className="text-gray-400">step: </span>
            <span className="text-green-400">{step}</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-400">examItemIndex: </span>
            <span className="text-green-400">{examItemIndex}</span>
          </div>

          <details className="mb-1">
            <summary className="cursor-pointer text-blue-300 select-none hover:text-blue-200">
              검사자 정보 ({Object.keys(examineeAnswers).length})
            </summary>
            <ul className="mt-1 space-y-0.5 pl-2">
              {Object.entries(examineeAnswers).map(([key, val]) => (
                <li key={key} className="break-all">
                  <span className="text-gray-400">{key}: </span>
                  <span className="text-white">
                    {Array.isArray(val) ? `[${val.join(', ')}]` : val}
                  </span>
                </li>
              ))}
              {Object.keys(examineeAnswers).length === 0 && (
                <li className="text-gray-500">(없음)</li>
              )}
            </ul>
          </details>

          <details className="mb-1">
            <summary className="cursor-pointer text-blue-300 select-none hover:text-blue-200">
              문항 응답 ({Object.keys(examAnswers).length})
            </summary>
            <ul className="mt-1 space-y-0.5 pl-2">
              {Object.entries(examAnswers).map(([key, val]) => (
                <li key={key} className="break-all">
                  <span className="text-gray-400">{key}: </span>
                  <span className="text-white">{String(val)}</span>
                </li>
              ))}
              {Object.keys(examAnswers).length === 0 && <li className="text-gray-500">(없음)</li>}
            </ul>
          </details>

          <details>
            <summary className="cursor-pointer text-blue-300 select-none hover:text-blue-200">
              기대효과 ({Object.keys(expectationAnswers).length})
            </summary>
            <ul className="mt-1 space-y-0.5 pl-2">
              {Object.entries(expectationAnswers).map(([key, val]) => (
                <li key={key} className="break-all">
                  <span className="text-gray-400">{key}: </span>
                  <span className="text-white">{val}</span>
                </li>
              ))}
              {Object.keys(expectationAnswers).length === 0 && (
                <li className="text-gray-500">(없음)</li>
              )}
            </ul>
          </details>
        </div>
      )}
      {/* ===== DEBUG PANEL END ===== */}
    </Container>
  );
}
