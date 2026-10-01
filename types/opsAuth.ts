// 운영(ops) 관리자 인증. SafariOn 플랫폼 관리자 계정(role=SUPER_ADMIN)으로 로그인한다.
// 토큰은 localStorage 'axcompass:opsToken'. 계정 관리는 SafariOn 에서 한다.

// ─── DTO — 백엔드 raw ───────────────────────────────────────────────────────

/** POST /auth/login/email 요청 본문 */
export interface OpsLoginRequestDto {
  email: string;
  rawPassword: string;
}

/** POST /auth/login/email 응답 data */
export interface OpsLoginResponseDto {
  token: string;
}

// ─── Domain Model — UI 소비용 ───────────────────────────────────────────────

export interface OpsSession {
  token: string;
}
