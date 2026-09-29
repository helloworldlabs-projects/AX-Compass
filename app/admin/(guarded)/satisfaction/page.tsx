'use client';

import { useSearchParams } from 'next/navigation';

import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LinkButton,
  LoadingState,
  PageHeader,
  Pagination,
  ROW_CLASS,
  SearchBox,
  StatCard,
  Table,
  Td,
  paginate,
} from '@/components/admin/ui';
import { lowestMetric, metricMeans } from '@/components/admin/satisfaction/metric-means';
import { useCohorts } from '@/hooks/useReference';
import {
  METRICS,
  SCALE_MAX,
  cohortLabel,
  hasSatisfaction,
  overallScore,
  rating,
  responseRate,
  weakestMetric,
} from '@/lib/admin/metrics';
import { cn } from '@/lib/utils';
import type { Cohort } from '@/types/reference';

const TITLE = '교육 만족도';

/**
 * 교육 만족도 — SafariOn 실데이터.
 * 만족도는 기업이 아니라 회차 단위로 붙는다. 한 회차에 수강 기업이 둘 이상이면
 * 같은 값이 양쪽에 걸리므로, 화면에서 그 사실을 드러낸다.
 */
export default function SatisfactionPage() {
  const query = useCohorts();

  if (query.isPending) return <LoadingState />;
  if (query.isError) {
    return (
      <>
        <PageHeader title={TITLE} description="SafariOn 설문 결과를 조회합니다." />
        <ErrorState
          error={query.error}
          onRetry={() => query.refetch()}
          fallback="SafariOn 에 연결하지 못했습니다."
        />
      </>
    );
  }

  return <Satisfaction cohorts={query.data} />;
}

function Satisfaction({ cohorts }: { cohorts: Cohort[] }) {
  const params = useSearchParams();
  const keyword = (params.get('q') ?? '').trim();

  const collected = cohorts.filter(hasSatisfaction);
  const surveyOn = cohorts.filter((c) => c.surveyEnabled);
  const waiting = surveyOn.filter((c) => !hasSatisfaction(c));

  const allScores = collected.map(overallScore).filter((v): v is number => v !== null);
  const average =
    allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100) / 100
      : null;

  // 지표별 전체 평균 — 어느 영역이 약한지 한눈에 본다.
  const byMetric = metricMeans(collected);
  const lowest = lowestMetric(byMetric);

  const found = keyword
    ? cohorts.filter((c) =>
        [c.programTitle, c.operator ?? '', ...c.orgs].some((v) => v.includes(keyword)),
      )
    : cohorts;
  const view = paginate(found, Number(params.get('page') ?? 1));

  return (
    <>
      <PageHeader
        title={TITLE}
        description="SafariOn 설문 결과입니다. 회차 단위로 집계하며 개인 응답은 가져오지 않습니다."
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard label="수집된 회차" sub="만족도 응답 있음" value={collected.length} unit="개" />
        <StatCard
          label="설문 사용 회차"
          sub="전체 회차 중"
          value={`${surveyOn.length} / ${cohorts.length}`}
        />
        <StatCard
          label="수집 대기"
          sub="설문은 켜져 있으나 응답 없음"
          value={waiting.length}
          unit="개"
          tone={waiting.length > 0 ? 'accent' : 'default'}
        />
        <StatCard
          label="전체 평균"
          sub={`${SCALE_MAX}점 만점`}
          value={rating(average)}
          tone="success"
        />
      </div>

      <Card
        title="지표별 평균"
        description="SafariOn 이 문항을 분류해 둔 기준을 그대로 씁니다."
        action={
          lowest ? (
            <Badge tone="warn">가장 낮음 · {lowest.label}</Badge>
          ) : (
            <Badge tone="success">지표별 차이 없음</Badge>
          )
        }
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {byMetric.map((m) => {
            const weak = lowest?.code === m.code;
            return (
              <div key={m.code} className="bg-gray-0 rounded-[16px] px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <p className="txt-c1-bold text-gray-900">{m.label}</p>
                  <p
                    className={cn(
                      'txt-st2-bold tabular-nums',
                      weak ? 'text-special-pink-600' : 'text-gray-900',
                    )}
                  >
                    {rating(m.mean)}
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      weak ? 'bg-special-pink-600' : 'bg-adm-brand',
                    )}
                    style={{ width: `${((m.mean ?? 0) / SCALE_MAX) * 100}%` }}
                  />
                </div>
                <p className="txt-c2-regular mt-2 text-gray-500">{m.cohorts}개 회차 기준</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card
        title="회차별 만족도"
        action={<SearchBox placeholder="과정명 · 운영 기관 · 학습 기업" value={keyword} />}
        padded={false}
      >
        {view.rows.length === 0 ? (
          <EmptyState
            message={keyword ? `"${keyword}" 와 맞는 회차가 없습니다.` : '회차가 없습니다.'}
          />
        ) : (
          <Table
            minWidth={1560}
            // 글이 긴 열만 폭을 잡는다. 지표 점수 열은 균등하게 나눈다.
            columnWidths={[180, 96, 260, 150, 120, 120, 96, ...Array(7).fill(null), 70]}
            columns={[
              '운영 기관',
              '차수',
              '과정',
              '학습 기업',
              '기간',
              '응답률',
              '종합',
              ...METRICS.map((m) => m.label),
              '보완',
              '',
            ]}
          >
            {view.rows.map((c) => {
              const score = overallScore(c);
              const rate = responseRate(c);
              const weak = weakestMetric(c);

              return (
                <tr key={c.offeringId} className={ROW_CLASS}>
                  <Td className="txt-c1-bold whitespace-nowrap text-gray-900">
                    {c.operator ?? '—'}
                  </Td>
                  <Td className="whitespace-nowrap">
                    <span className="txt-c2-bold bg-adm-line-soft rounded-full px-2.5 py-1 text-gray-700">
                      {cohortLabel(c)}
                    </span>
                  </Td>
                  <Td className="min-w-[260px]">
                    <p className="txt-c1-regular text-gray-900">{c.programTitle}</p>
                    {c.category && (
                      <p className="txt-c2-regular mt-0.5 text-gray-500">{c.category}</p>
                    )}
                  </Td>
                  <Td>
                    {c.orgs.length === 0 ? (
                      <span className="txt-c2-regular text-gray-500">미연결</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {c.orgs.map((o) => (
                          <span
                            key={o}
                            className="txt-c2-bold bg-adm-line-soft rounded-full px-2.5 py-1 whitespace-nowrap text-gray-700"
                          >
                            {o}
                          </span>
                        ))}
                      </div>
                    )}
                  </Td>
                  <Td className="txt-c2-regular whitespace-nowrap text-gray-500 tabular-nums">
                    {c.startDate ?? '—'}
                    <br />~ {c.endDate ?? '—'}
                  </Td>
                  <Td>
                    {rate === null ? (
                      <span className="text-gray-500">—</span>
                    ) : (
                      <>
                        <span
                          className={cn(
                            'txt-c1-bold tabular-nums',
                            rate < 50 ? 'text-special-pink-600' : 'text-gray-900',
                          )}
                        >
                          {rate}%
                        </span>
                        <span className="txt-c2-regular ml-1 text-gray-500">
                          {c.respondents}/{c.enrolled}
                        </span>
                      </>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap">
                    {score === null ? (
                      <span className="-ml-2.5 inline-block">
                        <Badge tone="neutral">미수집</Badge>
                      </span>
                    ) : (
                      <span className="txt-c1-bold text-gray-900 tabular-nums">
                        {rating(score)}
                      </span>
                    )}
                  </Td>

                  {METRICS.map((m) => {
                    const v = c.scores[m.code];
                    return (
                      <Td key={m.code} className="whitespace-nowrap tabular-nums">
                        {v === undefined ? (
                          <span className="text-gray-500">—</span>
                        ) : (
                          <span
                            className={
                              weak?.code === m.code ? 'txt-c1-bold text-special-pink-600' : ''
                            }
                          >
                            {rating(v)}
                          </span>
                        )}
                      </Td>
                    );
                  })}

                  <Td className="whitespace-nowrap">
                    {weak ? (
                      <span className="txt-c2-bold text-special-pink-600">{weak.label}</span>
                    ) : score !== null ? (
                      // 지표가 전부 만점이거나 값이 같으면 짚을 자리가 없다.
                      <span className="txt-c2-bold text-green-700">없음</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <LinkButton href={`/admin/satisfaction/${c.offeringId}`}>상세</LinkButton>
                  </Td>
                </tr>
              );
            })}
          </Table>
        )}

        <Pagination {...view} query={keyword} />
      </Card>

      <div className="rounded-[16px] border border-gray-100 bg-white px-6 py-5">
        <p className="txt-c1-bold text-gray-900">읽는 기준</p>
        <ul className="txt-c1-regular mt-2 space-y-1.5 text-gray-500">
          <li>
            · 만족도는 <b className="text-gray-900">회차 단위</b>로 집계됩니다. 설문이 학습 기업별로
            나뉘어 있지 않아, 한 회차를 두 기업이 함께 들으면 같은 값이 양쪽에 걸립니다.
          </li>
          <li>
            · <b className="text-gray-900">학습 기업 미연결</b>이 정상입니다. 연결하지 않고 운영하는
            회차가 더 많습니다. 기업 보고서를 만들 때 어느 회차를 묶을지는 운영 기관과 과정을 보고
            정합니다.
          </li>
          <li>
            · <b className="text-gray-900">단건 운영</b>은 차수를 나누지 않고 한 번으로 끝난
            교육입니다. 빠진 정보가 아닙니다.
          </li>
        </ul>
      </div>
    </>
  );
}
