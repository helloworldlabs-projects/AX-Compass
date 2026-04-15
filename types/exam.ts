// ─── Shared primitives ───────────────────────────────────────────────────────

export type QuestionType = 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'TEXT';
export type ExamType = 'STANDARD' | 'PRECISION';
export type ItemComponent = 'SELF_ESTIMATE' | 'SITUATIONAL_JUDGMENT' | 'BEHAVIOR_HABIT';
export type ItemType = 'LIKERT' | 'SJT' | 'LIKERT_FREQ';

// ─── Shared option ────────────────────────────────────────────────────────────

export interface QuestionOptionDTO {
  value: string;
  label: string;
}

// ─── Question DTOs (discriminated union on type) ──────────────────────────────

export interface SingleChoiceQuestionDTO {
  questionCode: string;
  type: 'SINGLE_CHOICE';
  title: string;
  required: boolean;
  options: QuestionOptionDTO[];
}

export interface MultiChoiceQuestionDTO {
  questionCode: string;
  type: 'MULTI_CHOICE';
  title: string;
  required: boolean;
  options: QuestionOptionDTO[];
}

export interface TextQuestionDTO {
  questionCode: string;
  type: 'TEXT';
  title: string;
  required: boolean;
  maxLength?: number;
}

export type QuestionDTO = SingleChoiceQuestionDTO | MultiChoiceQuestionDTO | TextQuestionDTO;

// ─── Expectation Form ────────────────────────────────────────────────────────

export interface ExpectationFormDTO {
  formTitle: string;
  questions: QuestionDTO[];
}

// ─── Examinee Profiles ───────────────────────────────────────────────────────

export interface ExamineeProfilesDTO {
  formTitle: string;
  questions: QuestionDTO[];
}

// ─── Exam Items ──────────────────────────────────────────────────────────────

export interface ItemOptionDTO {
  value: string;
  label: string;
}

export interface ExamItemDTO {
  itemId: number;
  itemCode: string;
  sequence: number;
  content: string;
  options: ItemOptionDTO[];
}

export interface ExamSectionDTO {
  component: ItemComponent;
  itemType: ItemType;
  scaleMin?: number;
  scaleMax?: number;
  items: ExamItemDTO[];
}

export interface ExamItemsDTO {
  examType: ExamType;
  totalItems: number;
  sections: ExamSectionDTO[];
}

// ─── Submission ──────────────────────────────────────────────────────────────

export interface ExamResponseItem {
  itemId: number;
  likertValue: number | null;
  optionCode: string | null;
}

export interface ExamSubmitRequest {
  examType: ExamType;
  profile: {
    ageGroup: string;
    jobFunction: string;
    industry: string;
    experienceLevel: string;
    aiUsageFrequency: string;
    aiUsagePurposes: string[];
  };
  responses: ExamResponseItem[];
  expectation: {
    targetAiTask: string;
    learningExpectation?: string;
  };
}

export interface ExamSubmitResponse {
  resultCode: string;
  totalScore: number;
  computedLevel: string;
  finalLevel: string;
  capApplied: boolean;
  computedAt: string;
}

// ─── Domain Models ────────────────────────────────────────────────────────────
// In this domain the DTO shapes are already clean — domain models mirror DTOs.
// Aliases are provided so the service layer returns named domain types.

export type QuestionOption = QuestionOptionDTO;
export type Question = QuestionDTO;
export type ExpectationForm = ExpectationFormDTO;
export type ExamineeProfiles = ExamineeProfilesDTO;
export type ItemOption = ItemOptionDTO;
export type ExamItem = ExamItemDTO;
export type ExamSection = ExamSectionDTO;
export type ExamItems = ExamItemsDTO;
