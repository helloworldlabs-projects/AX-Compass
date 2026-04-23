import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { institutionService } from '@/api/services/institution.service';
import { authService } from '@/api/services/auth.service';
import { institutionKeys } from '@/api/keys/institution.keys';
import { INSTITUTION_LEVEL_LABEL_MAP } from '@/constants/levelConfig';
import type { ExecutiveListParams, MemberListParams } from '@/types/institution';
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

export const useInstitutionExecutives = (params: ExecutiveListParams) =>
  useQuery({
    queryKey: institutionKeys.executives(params as Record<string, unknown>),
    queryFn: () => institutionService.getExecutives(params),
  });

export const useDeleteExecutive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (executiveId: number) => institutionService.deleteExecutive(executiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.all });
    },
  });
};

export const useDownloadMemberExcel = () =>
  useMutation({
    mutationFn: async (institutionCode: string) => {
      const data = await institutionService.getMembers({ size: 9999 });
      const { utils, writeFile } = await import('xlsx');

      const rows = data.members.map((m) => ({
        구성원명: m.memberName,
        '종합 역량 등급': m.overallLevel ? INSTITUTION_LEVEL_LABEL_MAP[m.overallLevel] : '-',
        '세부 역량 등급(이해)': m.understandLevel ?? '-',
        '세부 역량 등급(활용)': m.useApplyLevel ?? '-',
        '세부 역량 등급(평가·개선)': m.evaluateLevel ?? '-',
        '세부 역량 등급(책임·거버넌스)': m.responsibleLevel ?? '-',
        프로필유형: m.profileType ?? '-',
        'SE 점수': m.seScore ?? '-',
        'SJ 점수': m.sjScore ?? '-',
        'BH 점수': m.bhScore ?? '-',
        결과조회코드: m.resultCode ?? '-',
      }));

      const ws = utils.json_to_sheet(rows);
      ws['!cols'] = [
        { wch: 14 }, // 구성원명
        { wch: 14 }, // 종합 역량 등급
        { wch: 14 }, // 세부 역량 등급(이해)
        { wch: 14 }, // 세부 역량 등급(활용)
        { wch: 14 }, // 세부 역량 등급(평가·개선)
        { wch: 14 }, // 세부 역량 등급(책임·거버넌스)
        { wch: 14 }, // 프로필유형
        { wch: 14 }, // SE 점수
        { wch: 14 }, // SJ 점수
        { wch: 14 }, // BH 점수
        { wch: 20 }, // 결과조회코드
      ];
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, '구성원 목록');
      writeFile(wb, `AX_COMPASS_${institutionCode}.xlsx`);
    },
  });
