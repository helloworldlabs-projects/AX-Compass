// 사후검사 링크 — exam_link + exam_link_offering

// ─── DTO — 백엔드 raw ───────────────────────────────────────────────────────

export interface LinkOfferingDto {
  offeringId: string;
  title: string;
}

/** PostExam.Link */
export interface ExamLinkDto {
  linkId: number;
  institutionId: number;
  safarionCode: string;
  orgName: string;
  slug: string;
  courseTitle: string | null;
  /** YYYY-MM-DD. 그날 23:59(KST)까지 응시 가능 */
  dueOn: string;
  /** YYYY-MM-DD HH:mm:ss */
  issuedAt: string;
  issuedBy: number | null;
  status: 'open' | 'closed';
  closedAt: string | null;
  closedBy: number | null;
  offerings: LinkOfferingDto[];
}

/** PostExam.IssueLinkRequest — 기관 코드·이름은 서버가 SafariOn 에서 채운다 */
export interface IssueLinkRequestDto {
  /** 링크를 받을 학습 기업 */
  institutionId: number;
  /** 비우면 서버가 영문명으로 만든다 */
  slug?: string | null;
  courseTitle: string | null;
  /** YYYY-MM-DD */
  dueOn: string;
  /** 소문자 hex 32자 */
  offeringIds: string[];
}

/** PostExam.PublicLink — 공개(토큰 없음), /after/[slug] 응시 화면용 */
export interface PublicLinkDto {
  slug: string;
  orgName: string;
  courseTitle: string | null;
  dueOn: string;
  status: 'open' | 'closed';
  /** 마감일(KST)이 지났는가 */
  expired: boolean;
  /** 열려 있고 마감일 전. false 면 이름 확인·제출이 409 */
  accepting: boolean;
}

// ─── Domain Model — UI 소비용 ───────────────────────────────────────────────

export type LinkStatus = '진행중' | '마감';

export type LinkOffering = LinkOfferingDto;

/** 원본 lib/links.ts 의 ExamLink 와 같은 모양 — 보고서 전문(payload)에 그대로 담긴다. */
export interface ExamLink {
  id: number;
  institutionId: number;
  /** SafariOn 식별 코드. S + 7자리 */
  code: string;
  org: string;
  /** /after/{slug} */
  slug: string;
  course: string | null;
  dueOn: string;
  /** YYYY-MM-DD */
  issuedAt: string;
  status: LinkStatus;
  /** 닫혔거나 마감일이 지남 */
  closed: boolean;
  /**
   * 운영자가 직접 거둔 링크인가.
   *
   * 마감일이 지나 닫힌 것과 구별한다. 기업을 잘못 적어 거둔 링크를 실수로
   * 다시 열면 엉뚱한 기업이 응시하게 되므로, 화면에서 다른 버튼을 쓴다.
   */
  withdrawn: boolean;
  /** 거둔 시각 `YYYY-MM-DD`. 거두지 않았으면 null */
  closedOn: string | null;
  /** 거둔 관리자 번호 */
  closedBy: number | null;
  /** 비어 있으면 그 기업의 회차 전부 */
  offerings: LinkOffering[];
}

export interface PublicLink {
  slug: string;
  org: string;
  course: string | null;
  dueOn: string;
  closed: boolean;
}

/**
 * L6 — 마감일 연장·재개.
 *
 * `reopen` 은 운영자가 직접 거둔 링크(`status='closed'`)를 다시 열 때만 보낸다.
 * 마감일이 지나 닫힌 링크는 `dueOn` 만 늘리면 되고, 거기에 `reopen` 을 붙이면
 * 잘못 적어 거둔 링크까지 되살릴 위험이 생긴다.
 */
export interface ExtendLinkRequestDto {
  /** 새 마감일 YYYY-MM-DD. 그날 23:59(KST)까지 */
  dueOn: string;
  /** 거둔 링크를 다시 열 때만 true */
  reopen?: boolean;
}
