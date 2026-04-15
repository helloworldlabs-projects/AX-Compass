type Role = 'ADMIN' | 'MEMBER' | 'EXECUTIVE';

export type UserRole = 'MEMBER' | 'EXECUTIVE';

// DTO — 백엔드 raw
export interface RegisterRequestDTO {
  safarionCode: string;
  name: string;
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

// Domain Model — UI 소비용
export interface AdminAuthToken {
  token: string;
}
