'use client';

import { useMemo } from 'react';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';

import { postResponseKeys } from '@/api/keys/postResponse.keys';
import { referenceKeys } from '@/api/keys/reference.keys';
import { postResponseService } from '@/api/services/postResponse.service';
import { referenceService } from '@/api/services/reference.service';
import { buildSubmitBody, toPostResponses } from '@/lib/admin/post-results';
import type { Answers } from '@/lib/admin/ax-scoring';
import type { PostResponse } from '@/lib/admin/post-stats';
import type { ExamLink } from '@/types/postLink';
import type { StoredPostResponse } from '@/types/postResponse';
import type { PreMember } from '@/types/reference';
import { usePostLink } from './usePostLink';
import { usePreMembers } from './useReference';

const validId = (linkId: number) => Number.isInteger(linkId) && linkId > 0;

/* ── 공개 응시 화면 ──────────────────────────────────────── */

interface SubmitInput {
  slug: string;
  name: string;
  department?: string | null;
  answers: Answers;
}

/** 제출. 이름 공백은 하나로 맞추고, 채점해 점수와 함께 보낸다. */
export const useSubmitPostResponse = () =>
  useMutation({
    mutationFn: ({ slug, name, department = null, answers }: SubmitInput) =>
      postResponseService.createPostResponse(
        slug,
        buildSubmitBody(name.trim().replace(/\s+/g, ' '), department, answers),
      ),
  });

/** 이름 사전 확인. true 면 이미 제출한 이름. */
export const useCheckPostResponseName = () =>
  useMutation({
    mutationFn: ({ slug, name }: { slug: string; name: string }) =>
      postResponseService.checkPostResponseName(slug, name.trim().replace(/\s+/g, ' ')),
  });

/* ── 운영 화면 ───────────────────────────────────────────── */

/** 저장된 응답 그대로. 보통은 아래 useScoredPostResponses 를 쓴다. */
export const useRawPostResponses = (linkId: number) =>
  useQuery({
    queryKey: postResponseKeys.byLink(linkId),
    queryFn: () => postResponseService.fetchPostResponses(linkId),
    enabled: validId(linkId),
  });

export const usePostResponseCount = (linkId: number) =>
  useQuery({
    queryKey: postResponseKeys.count(linkId),
    queryFn: () => postResponseService.fetchPostResponseCount(linkId),
    enabled: validId(linkId),
  });

/** linkId → 응답 수. 응답이 없는 링크도 0 으로 담겨 온다. */
export const usePostResponseCounts = () =>
  useQuery({
    queryKey: postResponseKeys.counts(),
    queryFn: postResponseService.fetchPostResponseCounts,
  });

export const useTagAverages = (linkId: number) =>
  useQuery({
    queryKey: postResponseKeys.tagAverages(linkId),
    queryFn: () => postResponseService.fetchTagAverages(linkId),
    enabled: validId(linkId),
  });

export const useRematchPostResponses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: number) => postResponseService.rematchPostResponses(linkId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postResponseKeys.all }),
  });
};

/**
 * 한 검사의 응답에 사전검사를 잇는다 (원본 responsesOf + tagAveragesOf).
 * 사전검사를 못 읽으면 사전 없이 보여준다 — 사후 응답까지 감출 이유는 없다.
 */
export const useScoredPostResponses = (linkId: number) => {
  const link = usePostLink(linkId);
  const raw = useRawPostResponses(linkId);
  const tags = useTagAverages(linkId);
  const preMembers = usePreMembers(link.data?.institutionId);

  const preReady = !preMembers.isLoading;
  const responses = useMemo(() => {
    if (!raw.data || !link.data || !preReady) return undefined;
    return toPostResponses(raw.data, link.data.institutionId, preMembers.data ?? []);
  }, [raw.data, link.data, preMembers.data, preReady]);

  return {
    link: link.data,
    responses,
    tagAverages: tags.data,
    isLoading: link.isLoading || raw.isLoading || tags.isLoading || preMembers.isLoading,
    error: link.error ?? raw.error ?? tags.error,
  };
};

/**
 * 여러 검사의 응답 (post 목록 · reports 목록). linkId → PostResponse[].
 * ponytail: 링크마다 한 번씩 부른다(원본도 같다). 링크가 수백 개가 되면 일괄 조회 API 를 요청할 것.
 */
export const useScoredPostResponsesByLinks = (links: ExamLink[] | undefined) => {
  const list = useMemo(() => links ?? [], [links]);
  const institutionIds = useMemo(() => [...new Set(list.map((l) => l.institutionId))], [list]);

  const raws = useQueries({
    queries: list.map((l) => ({
      queryKey: postResponseKeys.byLink(l.id),
      queryFn: () => postResponseService.fetchPostResponses(l.id),
    })),
    combine: combineRaws,
  });
  const pres = useQueries({
    queries: institutionIds.map((id) => ({
      queryKey: referenceKeys.preMembers(id),
      queryFn: () => referenceService.fetchPreMembers(id),
    })),
    combine: combinePres,
  });

  const byLink = useMemo(() => {
    const preOf = new Map(institutionIds.map((id, i) => [id, pres.data[i] ?? []]));
    return new Map<number, PostResponse[]>(
      list.map((l, i) => [
        l.id,
        toPostResponses(raws.data[i] ?? [], l.institutionId, preOf.get(l.institutionId) ?? []),
      ]),
    );
  }, [list, institutionIds, raws.data, pres.data]);

  return { byLink, isLoading: raws.isLoading || pres.isLoading, error: raws.error };
};

// combine 을 모듈 수준에 두어야 결과가 렌더마다 새로 만들어지지 않는다.
function combineRaws(results: UseQueryResult<StoredPostResponse[]>[]) {
  return {
    data: results.map((r) => r.data),
    isLoading: results.some((r) => r.isLoading),
    error: results.find((r) => r.error)?.error ?? null,
  };
}

function combinePres(results: UseQueryResult<PreMember[]>[]) {
  return {
    data: results.map((r) => r.data),
    isLoading: results.some((r) => r.isLoading),
  };
}
