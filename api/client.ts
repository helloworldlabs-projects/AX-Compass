import { ApiError, ApiErrorDTO, ApiResponse } from '@/types/common';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<T> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(), // 토큰 주입
      ...options?.headers,
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
