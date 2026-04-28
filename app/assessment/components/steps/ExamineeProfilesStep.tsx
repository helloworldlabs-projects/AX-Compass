'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MultipleSelectOptions from '@/app/assessment/components/questions/MultipleSelectOptions';
import type { QuestionDTO } from '@/types/exam';

interface ExamineeProfilesStepProps {
  questions: QuestionDTO[];
  answers: Record<string, string | string[]>;
  onAnswerChange: (code: string, value: string | string[]) => void;
  startIndex: number;
}

export default function ExamineeProfilesStep({
  questions,
  answers,
  onAnswerChange,
  startIndex,
}: ExamineeProfilesStepProps) {
  return (
    <div className="rounded-card flex min-h-[400px] flex-col gap-[50px] bg-white px-4 py-6 shadow lg:min-h-[500px] lg:px-20">
      {questions.map((q, i) => (
        <div key={q.questionCode} className="flex flex-col gap-4">
          <div className="txt-st2-bold">
            {startIndex + i}. {q.title}
          </div>

          {q.type === 'SINGLE_CHOICE' && (
            <RadioGroup
              name={q.questionCode}
              value={(answers[q.questionCode] as string) ?? ''}
              onValueChange={(v) => onAnswerChange(q.questionCode, v)}
              className="flex flex-wrap gap-y-4"
            >
              {q.options.map((opt) => (
                <RadioGroupItem
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  labelClassName="w-[140px]"
                />
              ))}
            </RadioGroup>
          )}

          {q.type === 'MULTI_CHOICE' && (
            <MultipleSelectOptions
              options={q.options}
              selectedValues={(answers[q.questionCode] as string[]) ?? []}
              onChange={(vals) => onAnswerChange(q.questionCode, vals)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
