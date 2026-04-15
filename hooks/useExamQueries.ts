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

export const useExamItems = (examType: ExamType) =>
  useQuery({
    queryKey: examKeys.items(examType),
    queryFn: () => examService.getExamItems(examType),
  });

export const useSubmitExam = () =>
  useMutation({
    mutationFn: (body: ExamSubmitRequest) => examService.submitExam(body),
  });
