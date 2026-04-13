// 공통 성공 래퍼 — 모든 API 응답이 data 필드로 감싸져 있음
export interface ApiResponse<T> {
  data: T;
}

// RFC 9457 Problem Details — 공통 에러 구조
export interface ApiErrorDTO {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errorCode: string;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  errorCode: string;
  detail: string;

  constructor(dto: ApiErrorDTO) {
    super(dto.title);
    this.status = dto.status;
    this.errorCode = dto.errorCode;
    this.detail = dto.detail;
  }
}

export function getApiErrorDetail(error: unknown): string | undefined {
  if (error instanceof ApiError) return error.detail;
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    const d = (error as { detail: unknown }).detail;
    if (typeof d === 'string' && d.length > 0) return d;
  }
  return undefined;
}
