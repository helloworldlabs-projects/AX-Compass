// 사후검사 응답 — exam_response + exam_answer + exam_score.
// 채점은 제출할 때 프론트(ax-scoring)가 하고, 점수를 함께 저장한다(원본 saveResponse 와 같다).
import type { ProfileId } from '@/lib/admin/ax-scoring';
import type { Scores } from '@/lib/admin/post-stats';

// ─── DTO — 백엔드 raw ───────────────────────────────────────────────────────

export interface PostAnswerDto {
  itemCode: string;
  /** 고른 그대로 (리커트 1~5, 상황판단은 보기 코드) */
  rawValue: string;
  /** 0~100 환산값 */
  scoredValue: number | null;
}

export interface PostScoreDto {
  kind: 'section' | 'competency' | 'tag';
  code: string;
  value: number;
}

interface ScoreFieldsDto {
  instrumentVersion: string;
  overall: number;
  baseLevel: string;
  level: string;
  capReason: string | null;
  profile: string | null;
  profileGroup: string | null;
  se: number;
  sj: number;
  bh: number;
  gapSr: number;
  gapSb: number;
}

/** PostExam.SubmitResponseRequest */
export interface SubmitPostResponseRequestDto extends ScoreFieldsDto {
  name: string;
  department: string | null;
  answers: PostAnswerDto[];
  scores: PostScoreDto[];
}

export interface SubmitPostResponseResponseDto {
  responseId: number;
}

export interface CheckNameResponseDto {
  taken: boolean;
}

/** PostExam.Response — R3. 점수는 kind 별로 접혀 온다 */
export interface PostResponseDto extends ScoreFieldsDto {
  responseId: number;
  name: string;
  nameKey: string;
  department: string | null;
  preUserId: number | null;
  matchedAt: string | null;
  /** YYYY-MM-DD HH:mm:ss */
  submittedAt: string;
  /** A·B·C */
  sections: Record<string, number>;
  /** U·P·E·R */
  competencies: Record<string, number>;
  /** a~l */
  tags: Record<string, number>;
  answers: PostAnswerDto[];
}

/** PostExam.Rematch — P4 */
export interface RematchResponseDto {
  linkId: number;
  /** 다시 맞춘 응답 수 */
  responses: number;
  /** 맞춘 뒤 짝이 있는 응답 수 */
  matched: number;
  /** 짝이 바뀐 응답 수 */
  changed: number;
}

/** PostExam.ResponseCount — R4 · R5 */
export interface ResponseCountDto {
  linkId: number;
  count: number;
  lastSubmittedAt: string | null;
}

/** PostExam.TagAverage — R6 */
export interface TagAverageDto {
  code: string;
  /** 소수 둘째 자리 반올림 */
  average: number;
  respondents: number;
}

// ─── Domain Model — UI 소비용 ───────────────────────────────────────────────

/** 저장된 응답 하나. 사전 점수는 아직 붙지 않았다 (lib/admin/post-results 가 붙인다). */
export interface StoredPostResponse {
  id: string;
  name: string;
  department: string | null;
  preUserId: number | null;
  /** YYYY-MM-DD HH:mm */
  submittedAt: string;
  post: Scores;
  profile: ProfileId | null;
}

export type RematchResult = RematchResponseDto;
