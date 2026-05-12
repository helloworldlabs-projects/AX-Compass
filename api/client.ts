import { ApiError, ApiErrorDTO, ApiResponse, PaginatedApiResponse, type TokenKey } from '@/types/common';

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
    if (typeof window !== 'undefined' && response.status === 401 && errorDTO.errorCode === 'CMN_102') {
      localStorage.removeItem('axcompass:adminToken');
      window.location.replace('/');
    }
    throw new ApiError(errorDTO);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  // 성공 응답은 항상 { data: T } 구조
  const { data } = (await response.json()) as ApiResponse<T>;
  return data;
};

type ApiFetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
  tokenKey?: TokenKey;
};

export const apiFetchPaginated = async <T, P>(
  endpoint: string,
  options?: ApiFetchOptions,
): Promise<{ data: T; pagination: P }> => {
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
    if (typeof window !== 'undefined' && response.status === 401 && errorDTO.errorCode === 'CMN_102') {
      localStorage.removeItem('axcompass:adminToken');
      window.location.replace('/');
    }
    throw new ApiError(errorDTO);
  }

  const { data, pagination } = (await response.json()) as PaginatedApiResponse<T, P>;
  return { data, pagination };
};
