type Role = 'ADMIN' | 'MEMBER' | 'EXECUTIVE';

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

// Domain Model — UI 소비용
export interface AdminAuthToken {
  token: string;
}
