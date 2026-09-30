'use client';

import { CourseCell } from '@/components/admin/common/CourseCell';
import { useSearchParams } from 'next/navigation';

import { deltaClass, deltaText } from '@/components/admin/post/ChangeTable';
import {
  Card,
  EmptyState,
  ErrorState,
  LinkButton,
  LoadingState,
  PageHeader,
  paginate,
  Pagination,
  ROW_CLASS,
  SearchBox,
  StatCard,
  Table,
  Td,
} from '@/components/admin/ui';
import { usePostLinks } from '@/hooks/usePostLink';
import { useScoredPostResponsesByLinks } from '@/hooks/usePostResponse';
import { usePreOrgs } from '@/hooks/useReference';
import { score } from '@/lib/admin/metrics';
import { matchedOf, mean } from '@/lib/admin/post-stats';
import { cn } from '@/lib/utils';

const diff = (pre: number | null, post: number | null) =>
  pre === null || post === null ? null : Math.round((post - pre) * 10) / 10;

/**
 * 사후검사 조회. 기업 단위로만 본다 — 응답 하나하나는 그 기업 안에서 본다.
 * 점수는 상세와 같은 기준이다. 사전은 사전검사를 치른 사람 전부, 사후는 응답한 사람 전부.
 */
export default function PostPage() {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get('q') ?? '').trim();
  const page = Number(searchParams.get('page') ?? 1);

  const links = usePostLinks();
  const scored = useScoredPostResponsesByLinks(links.data);
  // 사전 평균은 사전검사 DB 에서 그대로 읽는다. 못 읽으면 사전 없이 보여준다.
  const preOrgs = usePreOrgs();

  // 사전검사 기업 목록도 기다린다. 먼저 그리면 대상·사전 평균이 0·— 으로 보였다가 바뀐다.
  if (links.isPending || scored.isLoading || preOrgs.isPending) return <LoadingState />;
  if (links.isError || scored.error) {
    return (
      <Card>
        <ErrorState error={links.error ?? scored.error} onRetry={() => links.refetch()} />
      </Card>
    );
  }

  const list = links.data;
  const byLink = scored.byLink;
  const found = keyword
    ? list.filter(
        (l) =>
          l.org.includes(keyword) ||
          l.code.toLowerCase().includes(keyword.toLowerCase()) ||
          (l.course ?? '').includes(keyword),
      )
    : list;
  const view = paginate(found, page);

  const rows = [...byLink.values()].flat();
  const matched = matchedOf(rows);
  const orphan = rows.filter((r) => r.match === '사전없음');

  const preOf = new Map((preOrgs.data ?? []).map((o) => [o.institutionId, o]));
  const postMean = mean(rows.map((r) => r.post.total));
  const preMean = mean(
    list.flatMap((l) => {
      const pre = preOf.get(l.institutionId)?.avgScore;
      return typeof pre === 'number' ? [pre] : [];
    }),
  );
  // 두 값의 집계 방식이 다르다. 사후는 응답 한 건씩 모은 평균이라 인원이 많은
  // 기업이 더 끌어당기고, 사전은 기업 평균을 다시 평균 낸 값이라 기업마다 무게가
  // 같다. 그래서 이 향상도가 아래 기업별 향상도와 방향이 어긋날 수 있다.
  // 계산을 바꾸면 이미 이 숫자를 본 사람과 어긋나므로, 기준을 화면에 적는다.
  const delta = diff(preMean, postMean);

  return (
    <>
      <PageHeader
        title="사후검사 조회"
        description="수집된 응답과 사전검사와의 매칭 상태를 확인합니다. 응답은 고칠 수 없습니다."
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard label="응답" sub="제출 완료" value={rows.length} unit="명" />
        <StatCard
          label="사전 매칭"
          sub="이름이 사전과 맞음"
          value={matched.length}
          unit="명"
          tone="success"
        />
        <StatCard
          label="사전 없음"
          sub="이름 불일치 의심"
          value={orphan.length}
          unit="명"
          tone={orphan.length > 0 ? 'accent' : 'default'}
        />
        <StatCard
          label="향상도"
          sub={
            delta === null
              ? '비교할 사전 기록 없음'
              : `기업 평균 사전 ${score(preMean)} → 응답자 사후 ${score(postMean)}`
          }
          value={deltaText(delta)}
          unit={delta === null ? undefined : '점'}
          tone={delta !== null && delta > 0 ? 'success' : 'default'}
        />
      </div>

      <Card
        title="기업별 현황"
        action={<SearchBox placeholder="기업명 또는 코드" value={keyword} />}
        padded={false}
      >
        {view.rows.length === 0 ? (
          <EmptyState
            message={keyword ? `"${keyword}" 와 맞는 기업이 없습니다.` : '수집된 응답이 없습니다.'}
          />
        ) : (
          <Table
            columns={[
              '기업',
              '과정',
              '대상',
              '응답',
              '매칭',
              '미매칭',
              '사전 평균',
              '사후 평균',
              '향상도',
              '',
            ]}
            minWidth={960}
          >
            {view.rows.map((l) => {
              const r = byLink.get(l.id) ?? [];
              const m = matchedOf(r);
              const unmatched = r.length - m.length;
              const org = preOf.get(l.institutionId);
              const pre = org?.avgScore ?? null;
              const post = mean(r.map((x) => x.post.total));
              const d = diff(pre, post);
              return (
                <tr key={l.id} className={ROW_CLASS}>
                  <Td className="txt-c1-bold text-gray-900">{l.org}</Td>
                  <Td className="text-gray-500">
                    <CourseCell offerings={l.offerings} fallback={l.course} />
                  </Td>
                  <Td className="tabular-nums">{org?.respondents ?? 0}명</Td>
                  <Td className="tabular-nums">{r.length}명</Td>
                  <Td className="tabular-nums">{m.length}명</Td>
                  <Td
                    className={cn(
                      'tabular-nums',
                      unmatched > 0 ? 'txt-c1-bold text-special-pink-600' : 'text-gray-500',
                    )}
                  >
                    {unmatched > 0 ? `${unmatched}명` : '—'}
                  </Td>
                  <Td className="text-gray-500 tabular-nums">{score(pre)}</Td>
                  <Td className="txt-c1-bold tabular-nums">{score(post)}</Td>
                  <Td className={deltaClass(d)}>{deltaText(d)}</Td>
                  <Td className="text-right">
                    <LinkButton href={`/admin/post/${l.id}`}>상세</LinkButton>
                  </Td>
                </tr>
              );
            })}
          </Table>
        )}

        <Pagination {...view} query={keyword} />
      </Card>

      <div className="rounded-[16px] border border-gray-100 bg-white px-6 py-4">
        <p className="txt-c1-bold text-gray-900">향상도를 읽는 기준</p>
        <p className="txt-c1-regular mt-1.5 text-gray-500">
          사전은 그 기업에서 사전검사를 치른 사람 전부, 사후는 응답한 사람 전부입니다. 같은 사람끼리
          짝지은 수가 아니므로, 변화의 일부는 응답한 사람이 달라 생긴 차이입니다. 응답률이 낮을수록
          이 차이가 커집니다.
        </p>
        <p className="txt-c1-regular mt-1.5 text-gray-500">
          위 요약의 향상도는 <b className="text-gray-900">기업별 사전 평균을 다시 평균 낸 값</b>과{' '}
          <b className="text-gray-900">응답자 전체의 사후 평균</b>을 견준 것입니다. 아래 기업별
          향상도와 기준이 달라 방향이 어긋날 수 있습니다. 기업 단위로 판단할 때는 아래 표를 봐
          주세요.
        </p>
      </div>
    </>
  );
}
