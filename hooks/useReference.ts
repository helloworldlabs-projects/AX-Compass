'use client';

import { useQueries, useQuery } from '@tanstack/react-query';

import { referenceKeys } from '@/api/keys/reference.keys';
import { referenceService } from '@/api/services/reference.service';
import type { NameHit } from '@/types/reference';

export const useSafarionInstitutions = () =>
  useQuery({
    queryKey: referenceKeys.institutions(),
    queryFn: referenceService.fetchInstitutions,
  });

export const useInstitutionSatisfactions = () =>
  useQuery({
    queryKey: referenceKeys.institutionSatisfactions(),
    queryFn: referenceService.fetchInstitutionSatisfactions,
  });

export const useLearningCompanies = (institutionId: number | undefined) =>
  useQuery({
    queryKey: referenceKeys.learningCompanies(institutionId ?? 0),
    queryFn: () => referenceService.fetchLearningCompanies(institutionId ?? 0),
    enabled: institutionId !== undefined,
  });

export const useInstitutionMetrics = (institutionId: number | undefined) =>
  useQuery({
    queryKey: referenceKeys.institutionMetrics(institutionId ?? 0),
    queryFn: () => referenceService.fetchInstitutionMetrics(institutionId ?? 0),
    enabled: institutionId !== undefined,
  });

export const useInstitutionCohorts = (institutionId: number | undefined) =>
  useQuery({
    queryKey: referenceKeys.institutionCohorts(institutionId ?? 0),
    queryFn: () => referenceService.fetchInstitutionCohorts(institutionId ?? 0),
    enabled: institutionId !== undefined,
  });

export const useCohorts = () =>
  useQuery({ queryKey: referenceKeys.cohorts(), queryFn: referenceService.fetchCohorts });

/** 회차 하나. 원본 getCohort 처럼 전체 목록에서 찾는다. */
export const useCohort = (offeringId: string) => {
  const query = useCohorts();
  return { ...query, data: query.data?.find((c) => c.offeringId === offeringId) };
};

export const useOfferingsForIssue = () =>
  useQuery({
    queryKey: referenceKeys.offeringsForIssue(),
    queryFn: referenceService.fetchOfferingsForIssue,
  });

export const useOfferingQuestions = (offeringId: string) =>
  useQuery({
    queryKey: referenceKeys.offeringQuestions(offeringId),
    queryFn: () => referenceService.fetchOfferingQuestions(offeringId),
  });

export const useOfferingsMetrics = (offeringIds: string[]) =>
  useQuery({
    queryKey: referenceKeys.offeringsMetrics(offeringIds),
    queryFn: () => referenceService.fetchOfferingsMetrics(offeringIds),
  });

export const useCourseOverviews = (offeringIds: string[]) =>
  useQuery({
    queryKey: referenceKeys.courseOverviews(offeringIds),
    queryFn: () => referenceService.fetchCourseOverviews(offeringIds),
  });

export const useOfferingsQuestions = (offeringIds: string[]) =>
  useQuery({
    queryKey: referenceKeys.offeringsQuestions(offeringIds),
    queryFn: () => referenceService.fetchOfferingsQuestions(offeringIds),
  });

export const useOfferingsChoices = (offeringIds: string[]) =>
  useQuery({
    queryKey: referenceKeys.offeringsChoices(offeringIds),
    queryFn: () => referenceService.fetchOfferingsChoices(offeringIds),
  });

/**
 * 회차 하나씩의 만족도.
 *
 * 운영 건을 여러 개 묶은 링크에서는 회차마다 만족도가 다르다. 합쳐 놓으면
 * 어느 과정이 어땠는지가 지워지므로, 회차를 하나씩 따로 부른다.
 *
 * 합쳐 부르는 훅(useOfferingsMetrics 등)과 **캐시 키가 다르다** — 한 건짜리
 * 배열로 부르므로 회차를 바꿔 묶어도 이미 받아 둔 것을 다시 쓴다.
 */
export const usePerOfferingSatisfaction = (offeringIds: string[]) => {
  const metrics = useQueries({
    queries: offeringIds.map((id) => ({
      queryKey: referenceKeys.offeringsMetrics([id]),
      queryFn: () => referenceService.fetchOfferingsMetrics([id]),
    })),
  });
  const questions = useQueries({
    queries: offeringIds.map((id) => ({
      queryKey: referenceKeys.offeringsQuestions([id]),
      queryFn: () => referenceService.fetchOfferingsQuestions([id]),
    })),
  });
  const choices = useQueries({
    queries: offeringIds.map((id) => ({
      queryKey: referenceKeys.offeringsChoices([id]),
      queryFn: () => referenceService.fetchOfferingsChoices([id]),
    })),
  });
  return { metrics, questions, choices };
};

export const usePreOrgs = () =>
  useQuery({ queryKey: referenceKeys.preOrgs(), queryFn: referenceService.fetchPreOrgs });

/** 없는 기관이면 data = null. */
export const usePreOrg = (institutionId: number | undefined) =>
  useQuery({
    queryKey: referenceKeys.preOrg(institutionId ?? 0),
    queryFn: () => referenceService.fetchPreOrg(institutionId ?? 0),
    enabled: institutionId !== undefined,
  });

export const usePreMembers = (institutionId: number | undefined) =>
  useQuery({
    queryKey: referenceKeys.preMembers(institutionId ?? 0),
    queryFn: () => referenceService.fetchPreMembers(institutionId ?? 0),
    enabled: institutionId !== undefined,
  });

/**
 * 사전검사와 못 이은 이름들을 전체 사전검사에서 찾는다 (post/[id] "매칭 실패" 표).
 * 실패한 조회는 빈 배열로 둔다 — 원본과 같다.
 */
export const usePreNameHits = (names: string[]) =>
  useQueries({
    queries: names.map((name) => ({
      queryKey: referenceKeys.preNameHits(name),
      queryFn: () => referenceService.fetchPreNameHits(name),
    })),
    combine: (results) => ({
      hitsByName: new Map<string, NameHit[]>(names.map((n, i) => [n, results[i]?.data ?? []])),
      isLoading: results.some((r) => r.isLoading),
    }),
  });
