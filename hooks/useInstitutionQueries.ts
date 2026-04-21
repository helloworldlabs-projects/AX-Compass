import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { institutionService } from '@/api/services/institution.service';
import { authService } from '@/api/services/auth.service';
import { institutionKeys } from '@/api/keys/institution.keys';
import type { MemberListParams } from '@/types/institution';
import type { RegisterRequestDTO } from '@/types/auth';

export const useInstitutionStats = () =>
  useQuery({
    queryKey: institutionKeys.stats(),
    queryFn: () => institutionService.getStats(),
  });

export const useInstitutionMembers = (params: MemberListParams) =>
  useQuery({
    queryKey: institutionKeys.members(params as Record<string, unknown>),
    queryFn: () => institutionService.getMembers(params),
  });

export const useRegisterMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterRequestDTO) => authService.register(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.all });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => institutionService.deleteMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: institutionKeys.all,
      });
    },
  });
};
