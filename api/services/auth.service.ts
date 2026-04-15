import {
  AdminAuthToken,
  LoginAdminRequestDTO,
  LoginAdminResponseDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
} from '@/types/auth';
import { apiFetch } from '../client';

const toAdminAuthToken = (dto: LoginAdminResponseDTO): AdminAuthToken => ({
  token: dto.token,
});

export const authService = {
  register: async (body: RegisterRequestDTO): Promise<void> => {
    await apiFetch<void>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  loginAdmin: async (body: LoginAdminRequestDTO): Promise<AdminAuthToken> => {
    const response = await apiFetch<LoginAdminResponseDTO>('/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toAdminAuthToken(response);
  },

  login: async (body: LoginRequestDTO): Promise<LoginResponseDTO> => {
    return apiFetch<LoginResponseDTO>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
