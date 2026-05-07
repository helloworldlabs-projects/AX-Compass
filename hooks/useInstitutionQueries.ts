import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { institutionService } from '@/api/services/institution.service';
import { authService } from '@/api/services/auth.service';
import { institutionKeys } from '@/api/keys/institution.keys';
import { INSTITUTION_LEVEL_LABEL_MAP } from '@/constants/levelConfig';
import type {
  BulkRegisterMember,
  ExecutiveListParams,
  MemberListParams,
} from '@/types/institution';
import type { RegisterRequestDTO } from '@/types/auth';

export const useInstitutionStats = (departments?: string[]) =>
  useQuery({
    queryKey: institutionKeys.stats(departments),
    queryFn: () => institutionService.getStats(departments),
  });

export const useInstitutionMembers = (params: MemberListParams) =>
  useQuery({
    queryKey: institutionKeys.members(params),
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
    queryKey: institutionKeys.executives(params),
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

export const useDownloadExecutiveExcel = () =>
  useMutation({
    mutationFn: async (institutionCode: string) => {
      const data = await institutionService.getExecutives({ size: 9999 });
      const { utils, writeFile } = await import('xlsx');

      const rows = data.executives.map((e) => ({
        임원진명: e.executiveName,
        소속: e.department ?? '-',
        '현재 수준 AX 성숙도': e.currentMaturityStage ?? '-',
        '현재 수준 점수(CMS)': e.currentScore ?? '-',
        '목표 수준 AX 성숙도': e.targetMaturityStage ?? '-',
        '목표 수준 점수(TMS)': e.targetScore ?? '-',
        '성숙도 차이(Gap_MS)': e.gapMs ?? '-',
        결과조회코드: e.resultCode ?? '-',
      }));

      const ws = utils.json_to_sheet(rows);
      ws['!cols'] = [
        { wch: 14 },
        { wch: 14 },
        { wch: 20 },
        { wch: 18 },
        { wch: 20 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
      ];
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, '임원진 목록');
      writeFile(wb, `AX_COMPASS_EXECUTIVE_${institutionCode}.xlsx`);
    },
  });

export async function parseRegisterTemplate(file: File): Promise<{
  valid: Array<{ no: number; name: string; department: string }>;
  skippedNos: number[];
  error: 'INVALID_FORMAT' | null;
}> {
  const { read, utils } = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const wb = read(buffer);
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) return { valid: [], skippedNos: [], error: 'INVALID_FORMAT' };

  const rows = utils.sheet_to_json<unknown[]>(ws, { header: 1 });

  const headerRow = rows[1] as unknown[] | undefined;
  if (!headerRow || headerRow[1] !== '[필수] 이름' || headerRow[2] !== '[필수] 소속') {
    return { valid: [], skippedNos: [], error: 'INVALID_FORMAT' };
  }

  // 마지막으로 이름 또는 소속을 입력한 행까지만 처리 범위로 한정
  let lastDataIdx = -1;
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    const name = row[1] !== undefined ? String(row[1]).trim() : '';
    const department = row[2] !== undefined ? String(row[2]).trim() : '';
    if (name || department) lastDataIdx = i;
  }

  const valid: Array<{ no: number; name: string; department: string }> = [];
  const skippedNos: number[] = [];

  for (let i = 2; i <= lastDataIdx; i++) {
    const row = rows[i] as unknown[];
    if (row[0] === undefined || row[0] === null || String(row[0]).trim() === '') continue;

    const no = Number(row[0]);
    const name = row[1] !== undefined ? String(row[1]).trim() : '';
    const department = row[2] !== undefined ? String(row[2]).trim() : '';

    if (!name || !department) {
      skippedNos.push(no);
      continue;
    }
    valid.push({ no, name, department });
  }

  return { valid, skippedNos, error: null };
}

export const useBulkRegisterMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (members: BulkRegisterMember[]) => institutionService.bulkRegisterMembers(members),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.all });
    },
  });
};

export const useBulkRegisterExecutives = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (members: BulkRegisterMember[]) =>
      institutionService.bulkRegisterExecutives(members),
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
        소속: m.department ?? '-',
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
        { wch: 14 }, // 소속
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
