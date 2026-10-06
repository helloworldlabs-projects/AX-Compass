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
  /** 집계에서 뺀 시각. 정상 응답이면 null. 백엔드가 아직 안 주면 undefined */
  excludedAt?: string | null;
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
  /**
   * 집계에서 뺀 시각. 정상 응답이면 null.
   *
   * 뺀 응답도 목록에는 남는다 — 담당자가 보면서 되돌릴 수 있어야 한다.
   * 통계는 화면에서 이 값으로 걸러 낸다.
   */
  excludedAt: string | null;
}

/**
 * 사전검사 연결을 손으로 지정하거나 푼다. preUserId 가 null 이면 해제.
 *
 * 부서는 보내지 않는다 — 백엔드가 사전검사 쪽에서 채운다.
 */
export interface PreLinkRequestDto {
  preUserId: number | null;
}

export interface PreLinkResponseDto {
  responseId: number;
  preUserId: number | null;
  matchedAt: string | null;
}

/** 응답을 집계에서 빼거나 되돌린다. */
export interface ExcludeRequestDto {
  exclude: boolean;
}

export interface ExcludeResponseDto {
  responseId: number;
  excludedAt: string | null;
}

export type RematchResult = RematchResponseDto;
