import { ApiError, ApiErrorDTO, ApiResponse } from '@/types/common';

type TokenKey = 'axcompass:accessToken' | 'axcompass:adminToken';

function getAuthHeader(tokenKey?: TokenKey): Record<string, string> {
  if (!tokenKey || typeof window === 'undefined') return {};
  const token = localStorage.getItem(tokenKey);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
    tokenKey?: TokenKey;
  },
): Promise<T> => {
  const { tokenKey, ...fetchOptions } = options ?? {};
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(tokenKey),
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const errorDTO: ApiErrorDTO = await response.json();
    throw new ApiError(errorDTO);
  }

  // 성공 응답은 항상 { data: T } 구조
  const { data } = (await response.json()) as ApiResponse<T>;
  return data;
};
