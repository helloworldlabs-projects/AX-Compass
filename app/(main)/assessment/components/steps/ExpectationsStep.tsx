'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TextArea } from '@/components/ui/TextArea';
import type { QuestionDTO, TextQuestionDTO } from '@/types/exam';

interface ExpectationsStepProps {
  questions: QuestionDTO[];
  answers: Record<string, string>;
  onAnswerChange: (code: string, value: string) => void;
}

export default function ExpectationsStep({
  questions,
  answers,
  onAnswerChange,
}: ExpectationsStepProps) {
  return (
    <div className="rounded-card flex flex-col gap-[50px] bg-white px-4 py-6 shadow lg:px-20">
      {questions.map((q) => (
        <div key={q.questionCode} className="flex flex-col gap-4">
          <div className="txt-st2-bold">
            {q.required ? '※ ' : <span className="text-special-dark-blue-500">[선택] </span>}
            {q.title}
          </div>

          {q.type === 'SINGLE_CHOICE' && (
            <RadioGroup
              value={answers[q.questionCode] ?? ''}
              onValueChange={(v) => onAnswerChange(q.questionCode, v)}
              className="flex flex-col gap-3"
            >
              {q.options.map((opt) => (
                <RadioGroupItem key={opt.value} value={opt.value} label={opt.label} />
              ))}
            </RadioGroup>
          )}

          {q.type === 'TEXT' && (
            <div className="bg-gray-0 rounded-[12px] px-4 py-3">
              <TextArea
                value={answers[q.questionCode] ?? ''}
                onChange={(v) => onAnswerChange(q.questionCode, v)}
                maxLength={(q as TextQuestionDTO).maxLength}
                placeholder={`앞으로의 학습 방향, 보완하고 싶은 점, 기대하는 변화를 자유롭게 입력해 주세요.\n(최대 ${(q as TextQuestionDTO).maxLength}자)`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
