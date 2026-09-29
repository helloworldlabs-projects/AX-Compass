'use client';

import { useMemo } from 'react';
import { useQuery, type QueryClient } from '@tanstack/react-query';

import { postLinkKeys } from '@/api/keys/postLink.keys';
import { postResponseKeys } from '@/api/keys/postResponse.keys';
import { referenceKeys } from '@/api/keys/reference.keys';
import { referenceService } from '@/api/services/reference.service';
import { computeCompanyReport, type CompanyReport } from '@/lib/admin/report';
import type { ExamLink } from '@/types/postLink';
import {
  useCourseOverviews,
  useInstitutionCohorts,
  useInstitutionSatisfactions,
  useOfferingsChoices,
  useOfferingsQuestions,
  usePreMembers,
  usePreOrg,
} from './useReference';
import { useScoredPostResponses } from './usePostResponse';

/**
 * 보고서가 읽는 쿼리 중 이미 캐시에 있는 것을 지금 값으로 다시 받는다.
 * 발행은 누른 시점의 데이터여야 한다(원본은 누를 때 DB 에서 새로 계산). 목록 화면이 받아 둔
 * 응답·사전 명단을 그대로 쓰면 그 사이 들어온 응답이 빠진다. 키는 아래 useCompanyReport 와 같다.
 */
export const refetchCompanyReportSources = (queryClient: QueryClient, link: ExamLink) => {
  const offeringIds = link.offerings.map((o) => o.offeringId);
  const keys = [
    postLinkKeys.detail(link.id),
    postResponseKeys.byLink(link.id),
    postResponseKeys.tagAverages(link.id),
    referenceKeys.preOrg(link.institutionId),
    referenceKeys.preMembers(link.institutionId),
    offeringIds.length > 0
      ? referenceKeys.offeringsMetrics(offeringIds)
      : referenceKeys.institutionMetrics(link.institutionId),
    referenceKeys.institutionSatisfactions(),
    referenceKeys.institutionCohorts(link.institutionId),
    referenceKeys.courseOverviews(offeringIds),
    referenceKeys.offeringsQuestions(offeringIds),
    referenceKeys.offeringsChoices(offeringIds),
  ];
  return Promise.all(keys.map((queryKey) => queryClient.refetchQueries({ queryKey, exact: true })));
};

/**
 * 검사(링크) 보고서를 지금 데이터로 계산한다. 발행(GenerateButton)할 때, 그리고 전문 없이
 * 발행된 옛 기록을 열 때 쓴다. 발행한 보고서는 저장된 전문(usePublishedReport)을 그린다.
 *
 * 사전검사·사후 응답은 필수(없으면 error / data=null), 만족도 쪽은 실패해도
 * 빈 값으로 채운다 — 원본 buildCompanyReport 의 .catch(() => []) 와 같다.
 * data: undefined = 로딩 중, null = 링크 또는 사전검사 없음.
 */
export const useCompanyReport = (linkId: number) => {
  const {
    link,
    responses,
    tagAverages,
    isLoading: postLoading,
    error,
  } = useScoredPostResponses(linkId);

  const institutionId = link?.institutionId;
  const offeringIds = useMemo(() => link?.offerings.map((o) => o.offeringId) ?? [], [link]);
  const ready = link !== undefined;

  const pre = usePreOrg(institutionId);
  const preMembers = usePreMembers(institutionId);
  // 회차를 고른 링크는 그 회차로, 예전 링크는 기업 번호로 모은다.
  const metrics = useQuery({
    queryKey:
      offeringIds.length > 0
        ? referenceKeys.offeringsMetrics(offeringIds)
        : referenceKeys.institutionMetrics(institutionId ?? 0),
    queryFn: () =>
      offeringIds.length > 0
        ? referenceService.fetchOfferingsMetrics(offeringIds)
        : referenceService.fetchInstitutionMetrics(institutionId ?? 0),
    enabled: ready,
  });
  const satisfactionList = useInstitutionSatisfactions();
  const courses = useInstitutionCohorts(institutionId);
  const overviews = useCourseOverviews(offeringIds);
  const questions = useOfferingsQuestions(offeringIds);
  const choices = useOfferingsChoices(offeringIds);

  const optional = [metrics, satisfactionList, courses, overviews, questions, choices];
  const isLoading =
    postLoading || pre.isLoading || preMembers.isLoading || optional.some((q) => q.isLoading);

  const data = useMemo<CompanyReport | null | undefined>(() => {
    if (isLoading || !link || !responses || !tagAverages || pre.data === undefined)
      return undefined;
    if (pre.data === null) return null;
    return computeCompanyReport({
      link,
      pre: pre.data,
      preMembers: preMembers.data ?? [],
      responses,
      tagAverages,
      metrics: metrics.data ?? [],
      satisfactionList: satisfactionList.data ?? [],
      courses: courses.data ?? [],
      overviews: overviews.data ?? [],
      questionResults: questions.data ?? { stars: [], freeText: [] },
      choices: choices.data ?? [],
    });
  }, [
    isLoading,
    link,
    responses,
    tagAverages,
    pre.data,
    preMembers.data,
    metrics.data,
    satisfactionList.data,
    courses.data,
    overviews.data,
    questions.data,
    choices.data,
  ]);

  return { data, isLoading, error: error ?? pre.error ?? preMembers.error };
};
