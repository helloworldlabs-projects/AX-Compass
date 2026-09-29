'use client';

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { postLinkKeys } from '@/api/keys/postLink.keys';
import { postLinkService } from '@/api/services/postLink.service';
import { buildIssueOptions, type IssueOptions } from '@/lib/admin/issue-options';
import type { IssueLinkRequestDto } from '@/types/postLink';
import { useOfferingsForIssue, usePreOrgs, useSafarionInstitutions } from './useReference';

export const usePostLinks = () =>
  useQuery({ queryKey: postLinkKeys.lists(), queryFn: postLinkService.fetchPostLinks });

export const usePostLink = (linkId: number) =>
  useQuery({
    queryKey: postLinkKeys.detail(linkId),
    queryFn: () => postLinkService.fetchPostLink(linkId),
    enabled: Number.isInteger(linkId) && linkId > 0,
  });

/** 공개 응시 화면. 없는 주소는 error(ApiError 404). 마감이면 data.closed. */
export const usePublicLink = (slug: string) =>
  useQuery({
    queryKey: postLinkKeys.public(slug),
    queryFn: () => postLinkService.fetchPublicLink(slug),
  });

export const useIssuePostLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: IssueLinkRequestDto) => postLinkService.createPostLink(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postLinkKeys.all }),
  });
};

export const useClosePostLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: number) => postLinkService.closePostLink(linkId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postLinkKeys.all }),
  });
};

/**
 * 발급 폼 선택지 (운영 기관 → 교육 운영 건 → 학습 기업).
 * 참조 API 가 실패해도 링크 목록은 보여야 하므로 error 를 따로 돌려준다.
 */
export const useIssueOptions = () => {
  const preOrgs = usePreOrgs();
  const institutions = useSafarionInstitutions();
  const offerings = useOfferingsForIssue();
  const links = usePostLinks();

  const data = useMemo<IssueOptions | undefined>(() => {
    if (!preOrgs.data || !institutions.data || !offerings.data || !links.data) return undefined;
    const issued = new Set(links.data.filter((l) => !l.closed).map((l) => l.institutionId));
    return buildIssueOptions(preOrgs.data, institutions.data, offerings.data, issued);
  }, [preOrgs.data, institutions.data, offerings.data, links.data]);

  return {
    data,
    isLoading:
      preOrgs.isLoading || institutions.isLoading || offerings.isLoading || links.isLoading,
    error: preOrgs.error ?? institutions.error ?? offerings.error ?? links.error,
  };
};
