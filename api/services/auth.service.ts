import {
  AdminAuthToken,
  AdminEmailAuthToken,
  BusinessTypes,
  BusinessTypesResponseDto,
  CheckBusinessNumberRequestDTO,
  CheckBusinessNumberResponseDTO,
  LoginAdminEmailRequestDTO,
  LoginAdminEmailResponseDTO,
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

const mapBusinessTypes = (dto: BusinessTypesResponseDto): BusinessTypes => ({
  sectors: dto.sectors.map(({ id, name }) => ({ id, name })),
  categories: dto.categories.map(({ id, name }) => ({ id, name })),
});

const toAdminEmailAuthToken = (dto: LoginAdminEmailResponseDTO): AdminEmailAuthToken => ({
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
    const response = await apiFetch<LoginAdminResponseDTO>('/auth/login/admin/code', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toAdminAuthToken(response);
  },

  loginAdminByEmail: async (body: LoginAdminEmailRequestDTO): Promise<AdminEmailAuthToken> => {
    const response = await apiFetch<LoginAdminEmailResponseDTO>('/auth/login/admin/email', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toAdminEmailAuthToken(response);
  },

  login: async (body: LoginRequestDTO): Promise<LoginResponseDTO> => {
    return apiFetch<LoginResponseDTO>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  getBusinessTypes: async (): Promise<BusinessTypes> => {
    const dto = await apiFetch<BusinessTypesResponseDto>('/auth/signup/company/business-types');
    return mapBusinessTypes(dto);
  },

  checkBusinessNumber: async (body: CheckBusinessNumberRequestDTO): Promise<boolean> => {
    const dto = await apiFetch<CheckBusinessNumberResponseDTO>(
      '/auth/signup/company/business-number/check',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
    return dto.exists;
  },
};
