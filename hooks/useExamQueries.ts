import { examService } from '@/api/services/exam.service';
import { examKeys } from '@/api/keys/exam.keys';
import { ExamSubmitRequest, ExecutiveSubmitRequest, ExamType } from '@/types/exam';
import type { TokenKey } from '@/types/common';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useExamItems = (
  examType: ExamType,
  tokenKey?: TokenKey,
  enabled = true,
) =>
  useQuery({
    queryKey: examKeys.items(examType),
    queryFn: () => examService.getExamItems(examType, tokenKey),
    enabled,
  });

export const useSubmitExam = (tokenKey?: TokenKey) =>
  useMutation({
    mutationFn: (body: ExamSubmitRequest) => examService.submitExam(body, tokenKey),
    onSuccess: () => {
      if (tokenKey === 'axcompass:accessToken') {
        localStorage.removeItem('axcompass:accessToken');
      }
    },
  });

export const useSubmitExecutiveExam = (tokenKey?: TokenKey) =>
  useMutation({
    mutationFn: (body: ExecutiveSubmitRequest) =>
      examService.submitExecutiveExam(body, tokenKey),
    onSuccess: () => {
      if (tokenKey === 'axcompass:accessToken') {
        localStorage.removeItem('axcompass:accessToken');
      }
    },
  });

export const useExamResult = (resultCode: string) =>
  useQuery({
    queryKey: examKeys.result(resultCode),
    queryFn: () => examService.getExamResult(resultCode),
  });
