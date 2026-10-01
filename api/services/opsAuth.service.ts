import { ApiError } from '@/types/common';
import type { OpsLoginRequestDto, OpsLoginResponseDto, OpsSession } from '@/types/opsAuth';
import { apiFetch } from '../client';

const mapOpsSession = (dto: OpsLoginResponseDto): OpsSession => ({
  token: dto.token,
});

/** JWT payload 의 role. 서명 검증은 백엔드 몫이고, 여기서는 화면 진입만 가른다. */
const readRole = (token: string): string | null => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return (JSON.parse(atob(payload)) as { role?: string }).role ?? null;
  } catch {
    return null;
  }
};

// 백엔드에는 로그인만 있다(logout / me / 비밀번호 변경 없음). 계정은 SafariOn 에서 관리한다.
export const opsAuthService = {
  /**
   * 실패: 401 USR_005(인증 정보 불일치), 429 USR_017(이메일당 15분 5회), 503 USR_009.
   * 같은 경로로 기관 관리자(role=ADMIN)도 로그인되지만 사후 평가 API 는 SUPER_ADMIN 만 받으므로 여기서 막는다.
   */
  login: async (body: OpsLoginRequestDto): Promise<OpsSession> => {
    const session = mapOpsSession(
      await apiFetch<OpsLoginResponseDto>('/auth/login/email', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    );
    if (readRole(session.token) !== 'SUPER_ADMIN') {
      throw new ApiError({
        type: 'about:blank',
        title: 'Forbidden',
        status: 403,
        detail: '운영자(헬로월드랩스) 계정만 로그인할 수 있습니다.',
        instance: '/auth/login/email',
        errorCode: 'OPS_ROLE',
        timestamp: new Date().toISOString(),
      });
    }
    return session;
  },
};
