'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import IntroStep from '@/app/(main)/assessment/components/steps/IntroStep';
import ExamineeProfilesStep from '@/app/(main)/assessment/components/steps/ExamineeProfilesStep';
import ExamItemsStep from '@/app/(main)/assessment/components/steps/ExamItemsStep';
import ExpectationsStep from '@/app/(main)/assessment/components/steps/ExpectationsStep';
import ComponentIntroStep from '@/app/(main)/assessment/components/steps/ComponentIntroStep';
import { useExamItems } from '@/hooks/useExamQueries';
import type {
  ExpectationFormDTO,
  ExamineeProfilesDTO,
  ItemComponent,
  ItemType,
  ExamItemDTO,
  ExamType,
} from '@/types/exam';
import { ApiError, getApiErrorDetail } from '@/types/common';
import { CompassIcon } from '@/components/icons/CompassIcon';
import Image from 'next/image';
import { toast } from 'sonner';
import { useSurveyStep } from '@/app/(main)/assessment/hooks/useSurveyStep';
import { useSurveySubmit } from '@/app/(main)/assessment/hooks/useSurveySubmit';

interface SurveyContainerProps {
  examType: ExamType;
  expectationForm: ExpectationFormDTO;
  examineeProfiles?: ExamineeProfilesDTO;
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
  const { data: examItems, error: examItemsError } = useExamItems(examType, tokenKey);

  useEffect(() => {
    if (!examItemsError) return;
    if (
      examItemsError instanceof ApiError &&
      (examItemsError.status === 401 || examItemsError.status === 403)
    ) {
      toast.error(getApiErrorDetail(examItemsError));
      router.replace('/assessment');
    }
  }, [examItemsError, router]);

  const [agreed, setAgreed] = useState(false);
  const [examineeAnswers, setExamineeAnswers] = useState<Record<string, string | string[]>>({});
  const [examAnswers, setExamAnswers] = useState<Record<string, number | string>>({});
  const [expectationAnswers, setExpectationAnswers] = useState<Record<string, string>>({});

  const flatItems = useMemo<FlatItem[]>(
    () =>
      examItems?.sections.flatMap((section) =>
        section.items.map((item) => ({
          ...item,
          component: section.component,
          itemType: section.itemType,
        })),
      ) ?? [],
    [examItems],
  );

  const itemComponents = useMemo(() => flatItems.map((item) => item.component), [flatItems]);

  const totalProfilePages = useMemo(
    () => Math.ceil((examineeProfiles?.questions.length ?? 0) / 3),
    [examineeProfiles],
  );

  const { step, profilePage, examItemIndex, componentIntroTarget, goNext, isLastStep } =
    useSurveyStep({
      hasProfiles: !!examineeProfiles,
      totalExamItems: examItems?.totalItems ?? 0,
      totalProfilePages,
      itemComponents,
    });

  const { submit, showSpinner } = useSurveySubmit({
    examType,
    tokenKey,
    flatItems,
    examineeProfiles,
    examineeAnswers,
    examAnswers,
    expectationAnswers,
    router,
  });

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
    sectionLabel = `※ ${examineeProfiles?.formTitle ?? ''}`;
  } else if (step === 'EXAM_ITEMS') {
    const currentItem = flatItems[examItemIndex];
    if (currentItem?.component === 'SELF_ESTIMATE') {
      sectionLabel = '* 자기평가(Self-Estimate)';
    } else if (currentItem?.component === 'SITUATIONAL_JUDGMENT') {
      sectionLabel = '* 상황판단(Situational Judgment)';
    } else if (currentItem?.component === 'BEHAVIOR_HABIT') {
      sectionLabel = '* 행동빈도(Behavior Habit)';
    } else if (currentItem?.component === 'CURRENT_MATURITY') {
      sectionLabel = '* 기업의 현재 AX 수준';
    } else if (currentItem?.component === 'TARGET_MATURITY') {
      sectionLabel = '* 기업의 목표 AX 수준';
    }
  } else {
    sectionLabel = `※ ${expectationForm.formTitle}`;
  }

  // Current profile batch (3 questions per page)
  const currentBatch = useMemo(
    () => examineeProfiles?.questions.slice(profilePage * 3, profilePage * 3 + 3) ?? [],
    [examineeProfiles, profilePage],
  );

  // canProceed
  let canProceed = false;
  if (componentIntroTarget) {
    canProceed = true;
  } else if (step === 'INTRO') {
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
    if (isLastStep) {
      submit();
    } else {
      goNext();
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
        {step === 'INTRO' && <IntroStep examType={examType} agreed={agreed} setAgreed={setAgreed} />}

        {step === 'EXAMINEE_PROFILES' && (
          <ExamineeProfilesStep
            questions={currentBatch}
            answers={examineeAnswers}
            onAnswerChange={handleExamineeAnswer}
            startIndex={profilePage * 3 + 1}
          />
        )}

        {step === 'EXAM_ITEMS' && componentIntroTarget && (
          <ComponentIntroStep component={componentIntroTarget} examType={examType} />
        )}

        {step === 'EXAM_ITEMS' && !componentIntroTarget && (
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
    </Container>
  );
}
