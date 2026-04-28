import { examService } from '@/api/services/exam.service';
import { examKeys } from '@/api/keys/exam.keys';
import { institutionKeys } from '@/api/keys/institution.keys';
import { ExamSubmitRequest, ExecutiveSubmitRequest, ExamType } from '@/types/exam';

import type { TokenKey } from '@/types/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useExpectationForm = () =>
  useQuery({
    queryKey: examKeys.expectationForm(),
    queryFn: () => examService.getExpectationForm(),
  });

export const useExamineeProfiles = () =>
  useQuery({
    queryKey: examKeys.examineeProfiles(),
    queryFn: () => examService.getExamineeProfiles(),
  });

export const useExamItems = (examType: ExamType, tokenKey?: TokenKey, enabled = true) =>
  useQuery({
    queryKey: examKeys.items(examType),
    queryFn: () => examService.getExamItems(examType, tokenKey),
    enabled,
  });

export const useSubmitExam = (tokenKey?: TokenKey) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ExamSubmitRequest) => examService.submitExam(body, tokenKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.stats() });
      // 구성원 설문 제출 후 기관 관리(구성원 목록/완료 필터/카운트)의 캐시 일관성 보장
      if (tokenKey === 'axcompass:accessToken') {
        queryClient.invalidateQueries({ queryKey: institutionKeys.membersAll() });
      }
      if (tokenKey === 'axcompass:accessToken') {
        localStorage.removeItem('axcompass:accessToken');
      }
    },
  });
};

export const useSubmitExecutiveExam = (tokenKey?: TokenKey) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ExecutiveSubmitRequest) => examService.submitExecutiveExam(body, tokenKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.stats() });
      // 임원진 설문 제출 후 기관 관리(임원진 목록/완료 필터/카운트)의 캐시 일관성 보장
      if (tokenKey === 'axcompass:accessToken') {
        queryClient.invalidateQueries({ queryKey: institutionKeys.executivesAll() });
      }
      if (tokenKey === 'axcompass:accessToken') {
        localStorage.removeItem('axcompass:accessToken');
      }
    },
  });
};

export const useExamResult = (resultCode: string) =>
  useQuery({
    queryKey: examKeys.result(resultCode),
    queryFn: () => examService.getExamResult(resultCode),
  });

export const useExecutiveResult = (resultCode: string) =>
  useQuery({
    queryKey: examKeys.executiveResult(resultCode),
    queryFn: () => examService.getExecutiveResult(resultCode),
  });
