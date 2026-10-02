'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import {
  ChangeTable,
  deltaClass,
  deltaText,
  FIRST_COL,
  VALUE_COL,
  Panel,
  Trace,
} from '@/components/admin/post/ChangeTable';
import { PendingActions } from '@/components/admin/post/PendingActions';
import { RematchButton } from '@/components/admin/post/RematchButton';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  PageHeader,
  paginate,
  Pagination,
  ROW_CLASS,
  SearchBox,
  StatCard,
  Table,
  Td,
} from '@/components/admin/ui';
import { usePostLink } from '@/hooks/usePostLink';
import { useRawPostResponses, useScoredPostResponses } from '@/hooks/usePostResponse';
import { usePreNameHits, usePreOrg } from '@/hooks/useReference';
import type { ProfileId } from '@/lib/admin/ax-scoring';
import { levelOf, score } from '@/lib/admin/metrics';
import {
  competencyChanges,
  departmentChanges,
  matchedOf,
  mean,
  profileShifts,
  sectionChanges,
  type PostResponse,
} from '@/lib/admin/post-stats';
import type { ExamLink } from '@/types/postLink';
import type { PreOrgDetail } from '@/types/reference';

const COMPONENT_SECTION: Record<string, string> = {
  SELF_ESTIMATE: 'A',
  SITUATIONAL_JUDGMENT: 'B',
  BEHAVIOR_HABIT: 'C',
};

/**
 * 한 기업(검사 링크)의 사후검사. 위에 명단, 아래에 통계.
 * 주소의 번호는 검사(링크) 번호다 — 한 기업이 사후검사를 여러 번 받을 수 있다.
 * 운영 화면이므로 이름을 그대로 보여준다. 기업에 가는 보고서에는 이름도 개인 점수도 없다.
 */
export default function PostOrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const linkId = Number(id);

  if (!Number.isInteger(linkId) || linkId <= 0) {
    return (
      <>
        <BackLink />
        <Card>
          <EmptyState message="검사를 찾을 수 없습니다." />
        </Card>
      </>
    );
  }
  return <PostOrgDetail linkId={linkId} />;
}

function BackLink() {
  return (
    <Link
      href="/admin/post"
      className="txt-c1-regular text-gray-500 transition-colors duration-200 hover:text-gray-900"
    >
      ← 사후검사 조회
    </Link>
  );
}

function PostOrgDetail({ linkId }: { linkId: number }) {
  const scored = useScoredPostResponses(linkId);
  // 재시도용. 같은 쿼리 키라 새로 부르지 않고 캐시를 함께 쓴다.
  const linkQuery = usePostLink(linkId);
  const rawQuery = useRawPostResponses(linkId);
  // 이 기업에서 사전검사를 치른 사람 전체. 못 읽으면 매칭된 사람의 사전으로 대신한다.
  const preOrg = usePreOrg(scored.link?.institutionId);

  const orphanNames = useMemo(
    () => (scored.responses ?? []).filter((r) => r.match === '사전없음').map((r) => r.name),
    [scored.responses],
  );
  // 원본처럼 추적이 끝난 뒤에 그린다. 먼저 그리면 조회 중인 이름이 "어디에도 없음"으로 보인다.
  const { hitsByName, isLoading: tracing } = usePreNameHits(orphanNames);

  if (scored.error) {
    return (
      <>
        <BackLink />
        <Card>
          <ErrorState
            error={scored.error}
            fallback="검사를 찾을 수 없습니다."
            onRetry={() => {
              void linkQuery.refetch();
              void rawQuery.refetch();
            }}
          />
        </Card>
      </>
    );
  }
  if (!scored.link || !scored.responses || !scored.tagAverages || preOrg.isLoading || tracing) {
    return <LoadingState />;
  }

  return (
    <Detail
      link={scored.link}
      rows={scored.responses}
      tagAverages={scored.tagAverages}
      preOrg={preOrg.data ?? null}
      hitsByName={hitsByName}
    />
  );
}

function Detail({
  link,
  rows,
  tagAverages,
  preOrg,
  hitsByName,
}: {
  link: ExamLink;
  rows: PostResponse[];
  tagAverages: Record<string, number>;
  preOrg: PreOrgDetail | null;
  hitsByName: ReturnType<typeof usePreNameHits>['hitsByName'];
}) {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get('q') ?? '').trim();
  const page = Number(searchParams.get('page') ?? 1);

  // 통계는 늘 전체 응답 기준이다. 명단만 검색으로 거른다.
  const matched = matchedOf(rows);
  const orphan = rows.filter((r) => r.match === '사전없음');
  const preMean = mean(matched.map((r) => r.pre!.total));
  // 사후는 응답한 사람 전부로 낸다.
  const postMean = mean(rows.map((r) => r.post.total));

  const found = keyword
    ? rows.filter((r) => r.name.includes(keyword) || (r.department ?? '').includes(keyword))
    : rows;
  const view = paginate(found, page);

  const preAll = preOrg
    ? {
        n: preOrg.org.respondents,
        total: preOrg.org.avgScore,
        sections: Object.fromEntries(
          preOrg.sections.map((x) => [COMPONENT_SECTION[x.component] ?? x.component, x.avg]),
        ) as Record<string, number | null>,
        competencies: Object.fromEntries(preOrg.competencies.map((x) => [x.code, x.avg])) as Record<
          string,
          number | null
        >,
        profiles: Object.fromEntries(
          preOrg.profiles.map((x) => [
            x.type,
            preOrg.org.respondents > 0 ? Math.round((x.n / preOrg.org.respondents) * 1000) / 10 : 0,
          ]),
        ) as Record<string, number>,
        profileCounts: Object.fromEntries(preOrg.profiles.map((x) => [x.type, x.n])) as Record<
          string,
          number
        >,
      }
    : null;

  /** 사전 전부의 평균 → 사후 전부의 평균. 같은 사람끼리 짝지은 값이 아니다. */
  const baseline = preAll?.total ?? preMean;
  const delta =
    baseline === null || postMean === null ? null : Math.round((postMean - baseline) * 10) / 10;

  /** 역량 아래에 펼칠 하위 역량. */
  const tagsOf = new Map(
    (preOrg?.competencies ?? []).map((c) => [
      c.code,
      c.tags.map((t) => ({ label: t.name, pre: t.avg, post: tagAverages[t.code] ?? null })),
    ]),
  );

  const sections = sectionChanges(rows);
  const competencies = competencyChanges(rows);
  const departments = departmentChanges(rows);
  const profiles = profileShifts(rows, preAll ? (Object.keys(preAll.profiles) as ProfileId[]) : []);

  return (
    <>
      <BackLink />

      <PageHeader
        title={link.org}
        description={[link.code, link.course, `마감 ${link.dueOn}`].filter(Boolean).join(' · ')}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="응답"
          sub={preOrg ? `대상 ${preOrg.org.respondents}명` : '대상 확인 안 됨'}
          value={rows.length}
          unit="명"
        />
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
              : `사전 ${score(baseline)} → 사후 ${score(postMean)}`
          }
          value={deltaText(delta)}
          unit={delta === null ? undefined : '점'}
          tone={delta !== null && delta > 0 ? 'success' : 'default'}
        />
      </div>

      {orphan.length > 0 && (
        <Notice bordered title={`사전검사 기록을 찾지 못한 응답이 ${orphan.length}건 있습니다`}>
          {/*
            두 가지를 말한다 — 들어간다는 것과, 어디서만 빠진다는 것. 한
            덩어리로 붙여 두면 앞 문장을 읽다가 뒤 문장을 놓친다. 줄을 나눈다.
          */}
          <p>
            <b className="text-gray-900">응답 자체는 그대로 집계에 들어갑니다.</b> 사후 평균과
            등급·프로필 분포에 모두 반영됩니다.
            <br />
            다만 사전 점수를 짝지을 수 없어, 같은 사람끼리 비교와 부서별 집계에서만 빠집니다 —
            부서는 사전검사에서 따라오기 때문입니다. 적힌 이름을 사전검사 전체에서 찾아 봤습니다.
          </p>

          {/*
            건수가 늘면 이 목록만으로 화면이 한참 길어져 아래 응답 목록이 밀린다.
            늘 접어 두고 필요할 때 연다 — 건수에 따라 열렸다 닫혔다 하면 어제 본
            화면과 오늘 본 화면이 달라진다.
          */}
          <details className="group mt-4">
            <summary className="txt-c1-bold text-special-pink-600 inline-flex cursor-pointer list-none items-center gap-1.5 select-none">
              <span className="transition group-open:rotate-90">▸</span>
              <span className="group-open:hidden">{orphan.length}건 자세히 보기</span>
              <span className="hidden group-open:inline">접기</span>
            </summary>

            {/* 다시 맞추기는 펼친 뒤에 보인다. 누르기 전에 아래 목록을 먼저 봐야 한다. */}
            <div className="mt-4">
              <RematchButton linkId={link.id} />
            </div>

            <ul className="mt-4 space-y-3">
              {orphan.map((r) => (
                <li key={r.id} className="rounded-[16px] bg-white px-5 py-4">
                  <p className="txt-c1-bold text-gray-900">{r.name}</p>
                  <div className="mt-2">
                    <Trace orgName={link.org} hits={hitsByName.get(r.name) ?? []} />
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </Notice>
      )}

      <Card
        title="응답 목록"
        action={<SearchBox placeholder="이름 또는 부서" value={keyword} />}
        padded={false}
      >
        {view.rows.length === 0 ? (
          <EmptyState
            message={
              keyword ? `"${keyword}" 와 맞는 응답이 없습니다.` : '아직 수집된 응답이 없습니다.'
            }
          />
        ) : (
          <Table
            columns={[
              '이름',
              '소속',
              '제출 시각',
              '종합',
              '수준',
              '자기평가',
              '상황판단',
              '행동빈도',
              '사전',
              '변화',
              '관리',
            ]}
            minWidth={1320}
            /*
              접히면 안 되는 열에만 너비를 준다. 재어 보고 정한 값이다.

              · 제출 시각 — "2026-09-21 07:49" 가 한 줄에 들어가야 한다
              · 소속     — "이문체육문화센터" 가 한 줄에 들어가야 한다
              · 관리     — 알약 둘이 한 줄에 들어가야 한다

              나머지는 숫자뿐이라 남는 자리를 똑같이 나눠 써도 남는다.
            */
            columnWidths={[140, 172, 200, null, null, null, null, null, null, null, 148]}
          >
            {view.rows.map((r) => {
              const d = r.pre === null ? null : Math.round((r.post.total - r.pre.total) * 10) / 10;
              return (
                <tr key={r.id} className={ROW_CLASS}>
                  <Td className="txt-c1-bold text-gray-900">{r.name}</Td>
                  <Td>
                    {r.match === '매칭' && r.department ? (
                      <span className="text-gray-500">{r.department}</span>
                    ) : (
                      <Badge tone="warn">매칭 안 됨</Badge>
                    )}
                  </Td>
                  <Td className="text-gray-500 tabular-nums">{r.submittedAt}</Td>
                  <Td className="txt-c1-bold tabular-nums">{score(r.post.total)}</Td>
                  <Td className="txt-c1-bold text-adm-brand">{levelOf(r.post.total) ?? '—'}</Td>
                  <Td className="text-gray-500 tabular-nums">{score(r.post.sections.A)}</Td>
                  <Td className="text-gray-500 tabular-nums">{score(r.post.sections.B)}</Td>
                  <Td className="text-gray-500 tabular-nums">{score(r.post.sections.C)}</Td>
                  <Td className="text-gray-500 tabular-nums">
                    {r.pre === null ? '—' : score(r.pre.total)}
                  </Td>
                  <Td className={deltaClass(d)}>{deltaText(d)}</Td>
                  {/* 손댈 수 있는 것을 한 칸에 모은다. 아직은 백엔드가 없어 눌리지 않는다. */}
                  <Td>
                    <PendingActions matched={r.match === '매칭'} />
                  </Td>
                </tr>
              );
            })}
          </Table>
        )}

        <Pagination {...view} query={keyword} />
      </Card>

      {matched.length === 0 ? (
        <Card title="사전 대비 변화">
          <EmptyState message="매칭된 응답이 없어 사전과 비교할 수 없습니다." />
        </Card>
      ) : (
        <>
          <Card title="종합">
            <div className="grid gap-4 lg:grid-cols-3">
              <Panel
                label="사전"
                sub={preAll ? `사전검사 ${preAll.n}명` : `매칭 ${matched.length}명`}
                value={baseline}
                level={levelOf(baseline)}
              />
              <Panel
                label="사후"
                sub={`응답 ${rows.length}명`}
                value={postMean}
                level={levelOf(postMean)}
                tone="brand"
              />
              <Panel label="변화" value={delta} tone="delta" />
            </div>
            <p className="txt-c1-regular mt-4 text-gray-500">
              양쪽 모두 그 시점에 검사를 치른 사람 전부입니다. 같은 사람들이 아니므로, 사이에 빠지고
              들어온 만큼은 교육이 아니라 사람이 바뀌어 생긴 차이일 수 있습니다.
            </p>
          </Card>

          <Card title="영역별 변화" padded={false}>
            <ChangeTable
              rows={sections}
              firstColumn="영역"
              all={rows.length}
              preAll={preAll ? { n: preAll.n, values: preAll.sections } : null}
            />
          </Card>

          <Card title="역량별 변화" padded={false}>
            <ChangeTable
              rows={competencies}
              firstColumn="역량"
              all={rows.length}
              preAll={preAll ? { n: preAll.n, values: preAll.competencies } : null}
              subRows={tagsOf}
              showLevel
            />
          </Card>

          {/* 유형은 모수가 달라 인원이 아니라 비중으로 본다. */}
          <Card title="프로필 유형 변화" padded={false}>
            <Table
              columns={[
                '유형',
                preAll ? `사전(${preAll.n}명)` : `사전(${matched.length}명)`,
                `사후(${rows.length}명)`,
                '변화',
              ]}
              minWidth={1100}
              columnWidths={[FIRST_COL, VALUE_COL, VALUE_COL, null]}
            >
              {profiles.map((p) => {
                const basePct = preAll ? (preAll.profiles[p.code] ?? 0) : p.prePct;
                const shift = basePct === null ? null : Math.round((p.postPct - basePct) * 10) / 10;
                return (
                  <tr key={p.code} className={ROW_CLASS}>
                    <Td className="txt-c1-bold text-gray-900">{p.label}</Td>
                    <Td className="text-gray-500 tabular-nums">
                      {basePct ?? 0}%
                      <span className="txt-c2-regular ml-1.5 text-gray-500">
                        {preAll ? (preAll.profileCounts[p.code] ?? 0) : p.preN}명
                      </span>
                    </Td>
                    <Td className="txt-c1-bold tabular-nums">
                      {p.postPct}%
                      <span className="txt-c2-regular ml-1.5 text-gray-500">{p.postN}명</span>
                    </Td>
                    <Td className={deltaClass(shift)}>
                      {shift === null ? '—' : shift > 0 ? `+${shift}%p` : `${shift}%p`}
                    </Td>
                  </tr>
                );
              })}
            </Table>
            <div className="border-adm-line-soft border-t px-6 py-4">
              <p className="txt-c1-regular text-gray-500">
                모수가 달라 인원이 아니라 비중으로 비교합니다. 변화는 비중의 차이(%p)입니다.
              </p>
            </div>
          </Card>

          <Card title="부서별 변화" padded={false}>
            <Table
              columns={[
                '부서',
                '인원',
                `사전(${matched.length}명)`,
                `사후(${matched.length}명)`,
                '변화',
              ]}
              minWidth={1400}
              columnWidths={[FIRST_COL, VALUE_COL, VALUE_COL, VALUE_COL, null]}
            >
              {departments.map((d) => (
                <tr key={d.key} className={ROW_CLASS}>
                  <Td className="txt-c1-bold text-gray-900">{d.label}</Td>
                  <Td className="tabular-nums">{d.n}명</Td>
                  <Td className="text-gray-500 tabular-nums">{score(d.pre)}</Td>
                  <Td className="txt-c1-bold tabular-nums">{score(d.post)}</Td>
                  <Td className={deltaClass(d.delta)}>{deltaText(d.delta)}</Td>
                </tr>
              ))}
            </Table>
            <div className="border-adm-line-soft border-t px-6 py-4">
              <p className="txt-c1-regular text-gray-500">
                부서는 사전검사에서 따라옵니다. 매칭되지 않은 응답은 소속을 알 수 없어 여기서
                빠지므로, 사후도 매칭된 {matched.length}명 기준입니다.
              </p>
            </div>
          </Card>
        </>
      )}

      <Card title="이 화면에서 할 수 없는 것">
        <ul className="txt-c1-regular space-y-2 text-gray-500">
          <li>
            · 응답을 고치거나 지울 수 없습니다. 관리자가 고칠 수 있으면 보고서 수치의 근거가
            흔들립니다. 잘못된 응답은 무효로 두고 다시 응시하게 하는 방식으로만 정정합니다.
          </li>
          <li>
            · 이름은 운영에만 씁니다. 기업에 전달하는 보고서에는 이름도 개인 점수도 올라가지 않으며,
            집계는 기업·부서 단위로만 나갑니다.
          </li>
        </ul>
      </Card>
    </>
  );
}
