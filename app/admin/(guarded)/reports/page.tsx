'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  Badge,
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
import { GenerateButton } from '@/components/admin/report/GenerateButton';
import { usePostLinks } from '@/hooks/usePostLink';
import { useReportRecords } from '@/hooks/usePostReport';
import { useScoredPostResponsesByLinks } from '@/hooks/usePostResponse';
import { useInstitutionSatisfactions, usePreOrgs } from '@/hooks/useReference';
import { score } from '@/lib/admin/metrics';
import { mean } from '@/lib/admin/post-stats';
import { cn } from '@/lib/utils';

/**
 * 기업 보고서.
 *
 * 보고서 한 건은 검사(링크) 하나다. 사전검사, 사후검사, 교육 만족도 세 가지가
 * 모두 있어야 말이 되는 문서가 나온다 — 셋 중 무엇이 비었는지 목록에서 바로 보이게 한다.
 * "생성" 을 눌러 발행한 보고서만 열 수 있다. 발행 시점의 전문을 그대로 그린다.
 */
export default function ReportsPage() {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get('q') ?? '').trim();
  const page = Number(searchParams.get('page') ?? 1);

  const links = usePostLinks();
  // 사전검사·만족도는 못 읽어도 목록은 보인다(원본의 .catch(() => [])). 해당 칸만 "없음"이 된다.
  const preOrgs = usePreOrgs();
  const satisfaction = useInstitutionSatisfactions();
  const scored = useScoredPostResponsesByLinks(links.data);
  const records = useReportRecords();

  const rows = useMemo(() => {
    const preById = new Map((preOrgs.data ?? []).map((o) => [o.institutionId, o]));
    const satById = new Map((satisfaction.data ?? []).map((s) => [s.institutionId, s]));
    return (links.data ?? []).map((link) => {
      const pre = preById.get(link.institutionId) ?? null;
      const sat = satById.get(link.institutionId) ?? null;
      // 응답은 링크로 모은다. 한 기업에 검사가 여럿이면 과정이 서로 다르다.
      const responses = scored.byLink.get(link.id) ?? [];
      const post = mean(responses.map((r) => r.post.total));
      const delta =
        pre?.avgScore == null || post === null ? null : Math.round((post - pre.avgScore) * 10) / 10;
      return {
        link,
        pre,
        sat,
        responses: responses.length,
        post,
        delta,
        /** 셋이 다 있어야 보고서를 만들 수 있다. */
        ready: pre !== null && responses.length > 0 && sat !== null,
        record: records.data?.get(link.id) ?? null,
      };
    });
  }, [links.data, preOrgs.data, satisfaction.data, scored.byLink, records.data]);

  const header = (
    <PageHeader
      title="검사 보고서"
      description="사전검사·사후검사·교육 만족도를 사후검사 한 건 단위로 엮어 보여줍니다."
    />
  );

  if (links.isError || scored.error || records.isError) {
    return (
      <>
        {header}
        <Card padded={false}>
          <ErrorState
            error={links.error ?? scored.error ?? records.error}
            onRetry={() => {
              void links.refetch();
              void records.refetch();
            }}
          />
        </Card>
      </>
    );
  }

  if (
    links.isPending ||
    preOrgs.isPending ||
    satisfaction.isPending ||
    scored.isLoading ||
    records.isPending
  ) {
    return (
      <>
        {header}
        <Card padded={false}>
          <LoadingState />
        </Card>
      </>
    );
  }

  const found = keyword
    ? rows.filter(
        (r) =>
          r.link.org.includes(keyword) ||
          r.link.code.toLowerCase().includes(keyword.toLowerCase()),
      )
    : rows;
  const view = paginate(found, page);
  const readyCount = rows.filter((r) => r.ready).length;

  return (
    <>
      {header}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="대상 검사" sub="링크 발급됨" value={rows.length} unit="건" />
        <StatCard
          label="자료 준비됨"
          sub="세 가지 모두 있음"
          value={readyCount}
          unit="건"
          tone={readyCount > 0 ? 'success' : 'default'}
        />
        <StatCard
          label="발행됨"
          sub="보고서를 만든 검사"
          value={rows.filter((r) => r.record !== null).length}
          unit="건"
        />
        <StatCard
          label="응답"
          sub="사후검사 제출"
          value={rows.reduce((a, r) => a + r.responses, 0)}
          unit="명"
        />
      </div>

      <Card
        title="검사별 자료"
        action={<SearchBox placeholder="기업명 또는 코드" value={keyword} />}
        padded={false}
      >
        {view.rows.length === 0 ? (
          <EmptyState
            message={keyword ? `"${keyword}" 와 맞는 검사가 없습니다.` : '발급한 검사가 없습니다.'}
          />
        ) : (
          <Table
            columns={['기업', '과정', '사전검사', '사후검사', '만족도', '사전 → 사후', '변화', '발행', '']}
            // 1100 을 넘기지 않는다. 사이드바를 뺀 본문이 그만큼이라, 더 벌리면 오른쪽 버튼이 화면 밖으로 나간다.
            // 맨 끝 칸은 버튼 두 개가 나란히 들어갈 만큼 준다.
            minWidth={1100}
            columnWidths={[170, null, 88, 88, 100, 130, 72, 104, 170]}
          >
            {view.rows.map((r) => (
              <tr key={r.link.id} className={ROW_CLASS}>
                {/* 기관 코드는 적지 않는다. 보고서를 고를 때 쓰는 것은 기업명과 과정명이다. */}
                <Td className="txt-c1-bold">{r.link.org}</Td>

                {/* 같은 기업이 두 줄로 뜰 수 있어 과정명으로 가린다. 한 줄로 자르고 전체 이름은 title 로. */}
                <Td className="text-gray-500">
                  <span
                    className="block truncate"
                    title={r.link.offerings[0]?.title ?? r.link.course ?? undefined}
                  >
                    {r.link.offerings[0]?.title ?? r.link.course ?? '과정 미지정'}
                  </span>
                </Td>

                <Td className="tabular-nums">
                  {r.pre ? `${r.pre.respondents}명` : <Badge tone="warn">없음</Badge>}
                </Td>

                <Td className="tabular-nums">
                  {r.responses > 0 ? (
                    `${r.responses}명`
                  ) : (
                    <span className="text-gray-500">수집 중</span>
                  )}
                </Td>

                <Td className="tabular-nums">
                  {r.sat ? (
                    <>
                      {r.sat.mean ?? '—'}
                      <span className="txt-c2-regular ml-1.5 text-gray-500">
                        {r.sat.respondents}명
                      </span>
                    </>
                  ) : (
                    <Badge tone="warn">없음</Badge>
                  )}
                </Td>

                <Td className="text-gray-500 tabular-nums">
                  {r.pre?.avgScore == null || r.post === null
                    ? '—'
                    : `${score(r.pre.avgScore)} → ${score(r.post)}`}
                </Td>

                <Td
                  className={cn(
                    'txt-c1-bold tabular-nums',
                    r.delta === null
                      ? 'text-gray-500'
                      : r.delta > 0
                        ? 'text-green-700'
                        : 'text-special-pink-600',
                  )}
                >
                  {r.delta === null ? '—' : r.delta > 0 ? `+${score(r.delta)}` : score(r.delta)}
                </Td>

                <Td className="tabular-nums">
                  {r.record ? (
                    <span className="flex flex-col">
                      <span className="txt-c1-bold text-gray-900">{r.record.issuedOn}</span>
                      {r.record.revision > 1 && (
                        <span className="txt-c2-regular text-gray-500">{r.record.revision}판</span>
                      )}
                    </span>
                  ) : r.ready ? (
                    <Badge tone="neutral">미발행</Badge>
                  ) : (
                    <Badge tone="warn">자료 부족</Badge>
                  )}
                </Td>

                <Td className="text-right">
                  {r.ready ? (
                    <span className="flex items-center justify-end gap-2">
                      {r.record && (
                        <LinkButton href={`/admin/reports/${r.link.id}`}>열기</LinkButton>
                      )}
                      <GenerateButton link={r.link} issuedOn={r.record?.issuedOn} />
                    </span>
                  ) : (
                    <span className="txt-c2-regular text-gray-500">—</span>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        )}

        <Pagination
          page={view.page}
          pages={view.pages}
          from={view.from}
          to={view.to}
          total={view.total}
          query={keyword}
        />
      </Card>

      <Card title="보고서를 만들기 전에">
        <ul className="txt-c1-regular space-y-2 text-gray-500">
          <li>
            · 사전검사·사후검사·만족도 <b className="text-gray-900">세 가지가 모두</b> 있어야
            합니다. 하나라도 비면 보고서가 반쪽이 됩니다.
          </li>
          <li>
            · <b className="text-gray-900">생성하기</b>를 눌러야 보고서가 발행됩니다. 누른 날짜가
            표지에 찍히는 발행일입니다 — 화면을 열 때마다 날짜가 바뀌면 기업에 건넨 문서와 대조할
            수가 없습니다.
          </li>
          <li>
            · 응답이 더 들어온 뒤 <b className="text-gray-900">다시 생성</b>하면 수치가 갱신되고
            발행일이 오늘로 바뀝니다. 몇 번째 판인지 함께 적힙니다.
          </li>
          <li>
            · 사후 응답률이 낮으면 향상도를 기업 전체의 변화라고 말할 수 없습니다. 보고서에
            응답률을 함께 싣습니다.
          </li>
          <li>
            · 기업에 전달하는 문서에는 개인 이름과 개인 점수가 들어가지 않습니다. 인원이 적은
            부서는 이름을 가립니다.
          </li>
        </ul>
      </Card>
    </>
  );
}
