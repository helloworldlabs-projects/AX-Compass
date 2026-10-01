import {
  ApiError,
  ApiErrorDTO,
  ApiResponse,
  PaginatedApiResponse,
  type TokenKey,
} from '@/types/common';

type ApiFetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
  tokenKey?: TokenKey;
};

function getAuthHeader(tokenKey?: TokenKey): Record<string, string> {
  if (!tokenKey || typeof window === 'undefined') return {};
  const token = localStorage.getItem(tokenKey);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const OPS_TOKEN_KEY: TokenKey = 'axcompass:opsToken';

/**
 * 401 중 로그아웃 처리할 것.
 * - CMN_102(만료): 모든 토큰 공통.
 * - CMN_101(토큰 없음/잘못됨): 운영 관리자 토큰을 실제로 보낸 요청만. 보냈는데 101 이면 잘못된 토큰이다.
 *   기관 관리자·응시자 흐름은 기존대로 CMN_102 만 본다.
 */
function shouldDropToken(
  errorCode: string | undefined,
  tokenKey: TokenKey | undefined,
  sentToken: boolean,
) {
  if (errorCode === 'CMN_102') return true;
  return errorCode === 'CMN_101' && tokenKey === OPS_TOKEN_KEY && sentToken;
}

// 요청에 쓴 토큰만 지운다. 운영 관리자는 /admin/login 으로 보낸다.
function handleExpiredToken(tokenKey?: TokenKey) {
  if (tokenKey) localStorage.removeItem(tokenKey);
  window.location.replace(tokenKey === OPS_TOKEN_KEY ? '/admin/login' : '/');
}

async function request(endpoint: string, options?: ApiFetchOptions): Promise<Response> {
  const { tokenKey, ...fetchOptions } = options ?? {};
  const isFormData = fetchOptions.body instanceof FormData;
  const authHeader = getAuthHeader(tokenKey);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...authHeader,
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    // JSON 이 아닌 오류 본문(게이트웨이 502 등)도 ApiError 로 통일한다.
    const errorDTO: ApiErrorDTO = await response
      .json()
      .catch(() => ({ status: response.status }) as ApiErrorDTO);
    if (
      typeof window !== 'undefined' &&
      response.status === 401 &&
      shouldDropToken(errorDTO.errorCode, tokenKey, 'Authorization' in authHeader)
    ) {
      handleExpiredToken(tokenKey);
    }
    throw new ApiError(errorDTO);
  }

  return response;
}

export const apiFetch = async <T>(endpoint: string, options?: ApiFetchOptions): Promise<T> => {
  const response = await request(endpoint, options);

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  // 성공 응답은 항상 { data: T } 구조
  const { data } = (await response.json()) as ApiResponse<T>;
  return data;
};

export const apiFetchPaginated = async <T, P>(
  endpoint: string,
  options?: ApiFetchOptions,
): Promise<{ data: T; pagination: P }> => {
  const response = await request(endpoint, options);
  const { data, pagination } = (await response.json()) as PaginatedApiResponse<T, P>;
  return { data, pagination };
};
