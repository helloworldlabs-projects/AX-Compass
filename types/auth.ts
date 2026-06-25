type Role = 'ADMIN' | 'MEMBER' | 'EXECUTIVE';

export type UserRole = 'MEMBER' | 'EXECUTIVE';

// DTO — 백엔드 raw
export interface RegisterRequestDTO {
  safarionCode: string;
  name: string;
  department: string;
  role: Role;
}

export interface LoginAdminRequestDTO {
  safarionCode: string;
  password: string;
}

export interface LoginAdminResponseDTO {
  token: string;
}

export interface LoginRequestDTO {
  institutionCode: string;
  name: string;
  role: UserRole;
}

export interface LoginResponseDTO {
  token: string;
}

export interface LoginAdminEmailRequestDTO {
  email: string;
  rawPassword: string;
}

export interface LoginAdminEmailResponseDTO {
  token: string;
}

// Domain Model — UI 소비용
export interface AdminAuthToken {
  token: string;
}

export interface AdminEmailAuthToken {
  token: string;
}

// ─── Business Types ──────────────────────────────────────────────────────────

// DTO — 백엔드 raw
export interface BusinessSectorDto {
  id: number;
  name: string;
}

export interface BusinessCategoryDto {
  id: number;
  name: string;
}

export interface BusinessTypesResponseDto {
  sectors: BusinessSectorDto[];
  categories: BusinessCategoryDto[];
}

// Domain Model — UI 소비용
export interface BusinessSector {
  id: number;
  name: string;
}

export interface BusinessCategory {
  id: number;
  name: string;
}

export interface BusinessTypes {
  sectors: BusinessSector[];
  categories: BusinessCategory[];
}

// ─── Business Number Check ────────────────────────────────────────────────────

// DTO — 백엔드 raw
export interface CheckBusinessNumberRequestDTO {
  businessNumber: string;
}

export interface CheckBusinessNumberResponseDTO {
  exists: boolean;
}

// ─── Email Verification ───────────────────────────────────────────────────────

// DTO — 백엔드 raw
export interface SendEmailVerificationRequestDTO {
  email: string;
}

export interface ConfirmEmailVerificationRequestDTO {
  email: string;
  otpCode: string;
}

export interface ConfirmEmailVerificationResponseDTO {
  verifiedToken: string;
}

// Domain Model — UI 소비용
export interface EmailVerificationToken {
  verifiedToken: string;
}

// ─── Company Signup ───────────────────────────────────────────────────────────

// DTO — 백엔드 raw
export interface SignupCompanyRequestDTO {
  name: string;
  englishName: string;
  businessNumber: string;
  businessSectorId: number;
  businessCategoryId: number;
  address: string;
  addressDetail: string;
  representativeName: string;
  contactPhone: string;
  logoUrl: string;
  originalLogoFileName: string;
  adminEmail: string;
  adminName: string;
  adminPassword: string;
  adminDepartment: string;
  adminPosition: string;
  verifiedToken: string;
  operatingInstitutionEnglishName: string;
}
