'use client';

import { useState } from 'react';

import { StarRatingInput, type StarRatingValue } from '@/components/StarRatingInput';
import { cn } from '@/lib/utils';
import type { ExamItemDTO, ItemComponent, ItemType } from '@/types/exam';

interface ExamItemsStepProps {
  item: ExamItemDTO & { component: ItemComponent; itemType: ItemType };
  questionNumber: number;
  answer: number | string | undefined;
  onAnswer: (value: number | string) => void;
}

export default function ExamItemsStep({
  item,
  questionNumber,
  answer,
  onAnswer,
}: ExamItemsStepProps) {
  const [starValue, setStarValue] = useState<StarRatingValue | 0>(
    typeof answer === 'number' && answer >= 1 && answer <= 5 ? (answer as StarRatingValue) : 0,
  );

  const itemType = item.itemType?.toUpperCase();
  const isLikert = itemType === 'LIKERT' || itemType === 'LIKERT_FREQ';
  const isSjt = itemType === 'SJT';

  return (
    <div
      className={`rounded-card flex min-h-[400px] flex-col bg-white pb-[30px] shadow lg:min-h-[500px] ${item.itemType === 'SJT' ? 'gap-4' : 'gap-15'}`}
    >
      {/* 문항 헤더 */}
      <div className="bg-special-dark-blue-500 flex w-full items-center gap-3 rounded-[10px] px-4 py-3 shadow-[0_4px_4px_rgba(0,0,0,0.14)]">
        <span className="txt-st-bold w-[40px] shrink-0 text-center text-white lg:w-[60px]">
          Q{questionNumber}
        </span>
        <div className="txt-b-bold flex-1 rounded-[12px] bg-white p-3 text-gray-700 shadow-[0_4px_4px_rgba(0,0,0,0.14)] lg:rounded-[16px] lg:p-4">
          {item.content}
        </div>
      </div>

      {/* LIKERT / LIKERT_FREQ — 별점 */}
      {isLikert && (
        <div className="flex flex-col items-center">
          <StarRatingInput
            value={starValue}
            onChange={(v) => {
              setStarValue(v);
              onAnswer(v);
            }}
            color="var(--color-special-orange-500)"
          />
          <div className="mt-[30px] mb-4 h-px w-[240px] bg-gray-200" />
          <div className="txt-c1-regular flex w-full max-w-[220px] justify-between text-center text-black lg:max-w-[292px]">
            <span>
              전혀
              <br />
              {item.component === 'SELF_ESTIMATE' ? '아니다' : '하지 않음'}
            </span>
            <span>보통</span>
            <span>
              매우
              <br />
              {item.component === 'SELF_ESTIMATE' ? '그렇다' : '자주 함'}
            </span>
          </div>
        </div>
      )}

      {/* SJT — 4지 선다 카드형 */}
      {isSjt && (
        <div className="flex flex-col gap-4">
          {item.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onAnswer(opt.value)}
              className="group flex w-full cursor-pointer items-stretch justify-center text-left outline-none"
            >
              <div className="flex w-10 shrink-0 items-center justify-center lg:w-20">
                <div
                  className={cn(
                    'border-box relative box-content size-5 overflow-hidden rounded-[20px] border-2 transition-colors lg:size-7',
                    answer === opt.value
                      ? 'border-special-orange-500 bg-white'
                      : 'border-gray-100 bg-gray-100',
                  )}
                >
                  {answer === opt.value && (
                    <div className="bg-special-orange-500 absolute top-[4px] left-[4px] size-3 rounded-full lg:size-5" />
                  )}
                </div>
              </div>
              <div
                className={cn(
                  'flex flex-1 items-center gap-2.5 overflow-hidden rounded-xl px-4 py-3 shadow transition-colors duration-200',
                  answer === opt.value
                    ? 'bg-special-navy-200'
                    : 'bg-special-navy-0 group-hover:bg-special-navy-100',
                )}
              >
                <div className="flex min-w-[32px] shrink-0 items-center justify-center">
                  <span className="txt-st-bold text-gray-700">{opt.value})</span>
                </div>
                <div className="flex flex-1 flex-col items-start justify-start">
                  <div className="inline-flex min-h-[56px] w-full items-center justify-start overflow-hidden rounded-xl bg-white px-4 py-3 shadow-[0_4px_4px_rgba(0,0,0,0.14)]">
                    <span className="txt-b-regular text-gray-700">{opt.label}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
