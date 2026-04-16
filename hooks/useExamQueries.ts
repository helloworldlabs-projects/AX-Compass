import { examService } from '@/api/services/exam.service';
import { examKeys } from '@/api/keys/exam.keys';
import { ExamSubmitRequest, ExamType } from '@/types/exam';
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
  tokenKey?: 'axcompass:accessToken' | 'axcompass:adminToken',
) =>
  useQuery({
    queryKey: examKeys.items(examType),
    queryFn: () => examService.getExamItems(examType, tokenKey),
  });

export const useSubmitExam = (tokenKey?: 'axcompass:accessToken' | 'axcompass:adminToken') =>
  useMutation({
    mutationFn: (body: ExamSubmitRequest) => examService.submitExam(body, tokenKey),
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
