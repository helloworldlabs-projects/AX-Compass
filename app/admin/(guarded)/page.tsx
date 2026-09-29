'use client';

import Link from 'next/link';

import {
  Badge,
  Card,
  ErrorState,
  LinkButton,
  LoadingState,
  PageHeader,
  ROW_CLASS,
  StatCard,
  Table,
  Td,
} from '@/components/admin/ui';
import { lowestMetric, metricMeans } from '@/components/admin/satisfaction/metric-means';
import { useCohorts } from '@/hooks/useReference';
import {
  SCALE_MAX,
  cohortLabel,
  hasSatisfaction,
  overallScore,
  responseRate,
  todayKST,
} from '@/lib/admin/metrics';
import { cn } from '@/lib/utils';
import type { Cohort } from '@/types/reference';

const TITLE = '운영 대시보드';

/**
 * 운영 대시보드.
 * 숫자를 늘어놓는 화면이 아니라 다음에 무엇을 해야 하는지 보여주는 화면이다.
 * 조치가 필요한 것을 맨 위에, 그 아래에 현황을 둔다.
 */
export default function AdminDashboardPage() {
  const query = useCohorts();

  if (query.isPending) return <LoadingState />;
  if (query.isError) {
    return (
      <>
        <PageHeader title={TITLE} />
        <ErrorState
          error={query.error}
          onRetry={() => query.refetch()}
          fallback="SafariOn 에 연결하지 못했습니다."
        />
      </>
    );
  }

  return <Dashboard cohorts={query.data} />;
}

function Dashboard({ cohorts }: { cohorts: Cohort[] }) {
  const operators = new Set(cohorts.map((c) => c.operator).filter(Boolean));
  const running = cohorts.filter((c) => c.operationStatus === 'IN_OPERATION');
  const completed = cohorts.filter((c) => c.operationStatus === 'COMPLETED');
  const collected = cohorts.filter(hasSatisfaction);

  /*
    교육이 끝났는가. 만족도는 교육이 끝나야 받는다.
    종료일을 먼저 본다 — 운영 상태는 끝났는데도 한동안 "운영 중" 으로 남아 있곤 한다.
  */
  const today = todayKST();
  const ended = (c: Cohort) =>
    c.endDate !== null ? c.endDate < today : c.operationStatus === 'COMPLETED';

  const todos = [
    {
      key: 'survey',
      label: '만족도 응답이 아직 없는 회차',
      detail:
        '교육이 끝났고 설문도 열려 있는데 제출이 한 건도 없습니다. 담당자에게 설문 안내를 다시 부탁해 주세요. 아직 진행 중이거나 시작 전인 회차는 여기에 넣지 않습니다.',
      items: cohorts.filter((c) => c.surveyEnabled && ended(c) && !hasSatisfaction(c)),
    },
    {
      key: 'rate',
      label: '응답이 절반에 못 미치는 회차',
      detail:
        '수강 인원에 견주어 응답이 적습니다. 이대로 보고서에 실으면 몇 사람의 의견이 회차 전체의 평가처럼 보입니다. 응답 기간을 늘리거나 미응답자에게 다시 안내해 주세요.',
      items: collected.filter((c) => {
        const r = responseRate(c);
        return r !== null && r < 50;
      }),
    },
  ].filter((t) => t.items.length > 0);

  const todoCount = todos.reduce((n, t) => n + t.items.length, 0);

  const means = metricMeans(collected).filter((m) => m.mean !== null);
  const weakest = lowestMetric(means);

  /* 사후검사를 보낼 만한 대상 — 최근 종료된 회차 */
  const postCandidates = completed.filter((c) => c.enrolled > 0).slice(0, 6);

  return (
    <>
      <PageHeader title={TITLE} description="교육 운영 현황과 조치가 필요한 항목을 확인합니다." />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard label="운영 기관" sub="교육을 진행한 기관" value={operators.size} unit="곳" />
        <StatCard label="운영 중" sub="진행 중인 회차" value={running.length} unit="개" />
        <StatCard
          label="만족도 수집"
          sub={`전체 ${cohorts.length}개 회차 중`}
          value={collected.length}
          unit="개"
          tone="success"
        />
        <StatCard
          label="만족도 보완 필요"
          sub="응답이 없거나 절반 미만"
          value={todoCount}
          unit="개 회차"
          tone={todoCount > 0 ? 'accent' : 'default'}
        />
      </div>

      {todos.length > 0 && (
        <Card
          title="만족도가 모자란 교육 회차"
          description="사후검사 보고서는 교육 만족도를 함께 싣습니다. 아래 회차로 보고서를 내면 만족도 부분이 비거나 몇 사람의 응답으로 채워집니다."
          padded={false}
        >
          <ul className="divide-y divide-gray-100">
            {todos.map((t) => (
              <li key={t.key} className="px-5 py-6 lg:px-6">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="txt-b-bold flex flex-wrap items-center gap-2.5 text-gray-900">
                      {t.label}
                      <span className="txt-c2-bold bg-special-pink-0 text-special-pink-600 shrink-0 rounded-full px-2.5 py-0.5">
                        {t.items.length}개 회차
                      </span>
                    </p>
                    <p className="txt-c1-regular mt-1.5 text-gray-700">{t.detail}</p>
                  </div>
                  <LinkButton href="/admin/satisfaction">회차 목록</LinkButton>
                </div>

                {/* 한 줄에 하나씩, 기관과 과정과 인원을 자리를 나눠 적는다. */}
                <ul className="divide-adm-line-soft mt-4 divide-y overflow-hidden rounded-[16px] border border-gray-100">
                  {t.items.slice(0, 3).map((c) => (
                    <li
                      key={c.offeringId}
                      className="bg-gray-0 flex flex-col gap-1 px-4 py-3 lg:flex-row lg:items-baseline lg:gap-3"
                    >
                      <span className="txt-c1-bold truncate text-gray-900 lg:w-[112px] lg:shrink-0">
                        {c.operator ?? '기관 미상'}
                      </span>
                      <span className="txt-c1-regular min-w-0 flex-1 truncate text-gray-700">
                        {c.programTitle}
                      </span>
                      {/* 같은 과정을 여러 차수로 열면 이름만으로는 갈리지 않는다. */}
                      <span className="txt-c1-regular shrink-0 text-gray-500 tabular-nums">
                        {cohortLabel(c)} · {c.startDate ?? '기간 미정'} · 수강 {c.enrolled}명
                      </span>
                    </li>
                  ))}
                  {t.items.length > 3 && (
                    <li className="txt-c1-regular bg-gray-0 px-4 py-3 text-gray-500">
                      외 {t.items.length - 3}개 회차가 더 있습니다
                    </li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="만족도 지표" description={`수집된 ${collected.length}개 회차 평균`}>
          <ul className="space-y-3">
            {means.map((m) => {
              const weak = weakest?.code === m.code;
              return (
                <li key={m.code}>
                  <div className="flex items-baseline justify-between">
                    <span className="txt-c1-regular text-gray-700">{m.label}</span>
                    <span
                      className={cn(
                        'txt-b-bold tabular-nums',
                        weak ? 'text-special-pink-600' : 'text-gray-900',
                      )}
                    >
                      {m.mean}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        weak ? 'bg-special-pink-600' : 'bg-adm-brand',
                      )}
                      style={{ width: `${((m.mean ?? 0) / SCALE_MAX) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          {weakest && (
            <p className="txt-c2-regular mt-5 text-gray-500">
              <b className="text-special-pink-600">{weakest.label}</b> 이 가장 낮습니다. 보고서의
              보완 포인트로 쓰기 좋습니다.
            </p>
          )}
        </Card>

        <div className="lg:col-span-2">
          <Card
            title="사후검사 대상"
            description="교육이 끝난 회차입니다. 사후검사를 발송할 대상입니다."
            padded={false}
            action={
              <Link
                href="/admin/sessions"
                className="txt-c1-bold text-special-blue-500 hover:underline"
              >
                발송 화면
              </Link>
            }
          >
            <Table columns={['운영 기관', '차수', '과정', '학습 기업', '종료', '수강생', '만족도']}>
              {postCandidates.map((c) => {
                const score = overallScore(c);
                return (
                  <tr key={c.offeringId} className={ROW_CLASS}>
                    <Td className="txt-c1-bold whitespace-nowrap">{c.operator ?? '—'}</Td>
                    <Td className="whitespace-nowrap">
                      <span className="txt-c2-bold bg-adm-line-soft rounded-full px-2.5 py-1 text-gray-700">
                        {cohortLabel(c)}
                      </span>
                    </Td>
                    <Td className="text-gray-900">{c.programTitle}</Td>
                    <Td className="txt-c2-regular text-gray-500">
                      {c.orgs.length ? c.orgs.join(', ') : '미연결'}
                    </Td>
                    <Td className="whitespace-nowrap text-gray-500 tabular-nums">
                      {c.endDate ?? '—'}
                    </Td>
                    <Td className="tabular-nums">{c.enrolled}명</Td>
                    <Td>
                      {score === null ? (
                        <Badge tone="neutral">미수집</Badge>
                      ) : (
                        <span className="txt-c1-bold text-gray-900 tabular-nums">{score}</span>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </Table>
          </Card>
        </div>
      </div>

      <div className="rounded-[16px] border border-gray-100 bg-white px-6 py-5">
        <p className="txt-c1-bold text-gray-900">지금 보이는 데이터</p>
        <p className="txt-c1-regular mt-2 text-gray-500">
          운영 기관 · 교육 운영 · 만족도는 SafariOn 에서 실시간으로 읽어옵니다. 학습 기업 연결은
          선택 사항이라 비어 있는 회차가 많은 것이 정상이고, 차수 없이 단건으로 끝난 교육도
          있습니다. 사전검사와 사후검사는 아직 연동 전이라, 연결되면 같은 자리에 매칭률과 향상도가
          채워집니다.
        </p>
      </div>
    </>
  );
}
