export const postLinkKeys = {
  all: ['postLink'] as const,
  lists: () => [...postLinkKeys.all, 'list'] as const,
  detail: (linkId: number) => [...postLinkKeys.all, 'detail', linkId] as const,
  public: (slug: string) => [...postLinkKeys.all, 'public', slug] as const,
};
