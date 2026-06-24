// ─── Institution (참여 기관) ───────────────────────────────────────────────────

// DTO: 백엔드 응답 원본 구조
export interface InstitutionDto {
  institutionId: number;
  institutionName: string;
  logoUrl: string;
}

export interface InstitutionsResponseDto {
  institutions: InstitutionDto[];
}

// Domain Model: 정제된 클라이언트 모델
export interface Institution {
  institutionId: number;
  institutionName: string;
  logoUrl: string;
}

// ─── Dashboard Overview (플랫폼 누적 현황) ────────────────────────────────────

// DTO: 백엔드 응답 원본 구조
export interface DashboardOverviewDto {
  participatingInstitutionCount: number;
  totalExamCount: number;
  totalExamMinutes: number;
  totalCostSupport: number;
}

// Domain Model: 정제된 클라이언트 모델
export interface DashboardOverview {
  participatingInstitutionCount: number;
  totalExamCount: number;
  totalExamMinutes: number;
  totalCostSupport: number;
}
