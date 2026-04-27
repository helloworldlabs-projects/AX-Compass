// ─── Shared primitives ───────────────────────────────────────────────────────

import { Level } from '@/constants/levelConfig';

export type QuestionType = 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'TEXT';
export type ExamType = 'STANDARD' | 'PRECISION' | 'EXECUTIVE';
export type ItemComponent = 'SELF_ESTIMATE' | 'SITUATIONAL_JUDGMENT' | 'BEHAVIOR_HABIT';
export type ItemType = 'LIKERT' | 'SJT' | 'LIKERT_FREQ';
export type ProfileType =
  | 'BALANCED'
  | 'OVERCONFIDENT'
  | 'DOER'
  | 'ANALYST'
  | 'CAUTIOUS'
  | 'LEARNER';

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

// ─── Form (shared base for expectation form and examinee profiles) ────────────

export interface FormDTO {
  formTitle: string;
  questions: QuestionDTO[];
}

export type ExpectationFormDTO = FormDTO;
export type ExamineeProfilesDTO = FormDTO;

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
  profile?: {
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

// ─── Executive Submission ─────────────────────────────────────────────────────

export interface ExecutiveSubmitRequest {
  responses: Array<{ itemId: number; likertValue: number }>;
  expectation: {
    targetAiTask: string;
    learningExpectation: string;
  };
}

export interface ExecutiveSubmitResponseCompetencyScore {
  competencyCode: string;
  currentScore: number;
  targetScore: number;
}

export interface ExecutiveSubmitResponseDto {
  resultCode: string;
  currentMaturityScore: number;
  targetMaturityScore: number;
  gapMs: number;
  currentMaturityStage: string;
  targetMaturityStage: string;
  competencyScores: ExecutiveSubmitResponseCompetencyScore[];
  computedAt: string;
}

export type ExecutiveSubmitResponse = ExecutiveSubmitResponseDto;

// ─── Exam Result ─────────────────────────────────────────────────────────────

export interface ExamResultCompetencyTagDTO {
  tagCode: string;
  tagName: string;
  avgScore: number;
}

export interface ExamResultCompetencyDTO {
  competencyCode: string;
  competencyName: string;
  intro: string;
  level: Level;
  levelFeedback: string;
  seScore: number;
  sjScore: number;
  bhScore: number;
  tags: ExamResultCompetencyTagDTO[];
}

export interface ExamResultScoreStatsDTO {
  seScore: number;
  sjScore: number;
  bhScore: number;
  gapSr: number;
  gapSb: number;
}

export interface ExamResultRoadmapCurriculumItemDTO {
  curriculumName: string;
  step: Level;
  role: string;
  durationHour: number;
}

export interface ExamResultRoadmapStepDTO {
  stepId: number;
  stepName: string;
  curriculumItems: ExamResultRoadmapCurriculumItemDTO[];
  learningTips: string[];
  curriculumTree: {
    nodes: string[];
    edges: { from: string; to: string }[];
  };
}

export interface ExamResultCurriculumTreeDTO {
  nodes: string[];
  edges: { from: string; to: string }[];
}

export interface ExamResultRoadmapDTO {
  steps: ExamResultRoadmapStepDTO[];
}

export interface ExamResultDTO {
  resultCode: string;
  examType: ExamType;
  userName: string;
  overallLevel: string;
  computedAt: string;
  competencies: ExamResultCompetencyDTO[];
  scoreStats: ExamResultScoreStatsDTO;
  profileType: ProfileType;
  recommendedRoadmap: ExamResultRoadmapDTO;
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
export type ExamResultCompetencyTag = ExamResultCompetencyTagDTO;
export type ExamResultCompetency = ExamResultCompetencyDTO;
export type ExamResultScoreStats = ExamResultScoreStatsDTO;
export type ExamResultRoadmapCurriculumItem = ExamResultRoadmapCurriculumItemDTO;
export type ExamResultRoadmapStep = ExamResultRoadmapStepDTO;
export type ExamResultCurriculumTree = ExamResultCurriculumTreeDTO;
export type ExamResultRoadmap = ExamResultRoadmapDTO;
export type ExamResult = ExamResultDTO;
