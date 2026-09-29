'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  ROW_CLASS,
  StatCard,
  Table,
  Td,
} from '@/components/admin/ui';
import { useCohort, useOfferingQuestions } from '@/hooks/useReference';
import {
  METRICS,
  SCALE_MAX,
  cohortLabel,
  overallScore,
  rating,
  responseRate,
  weakestMetric,
} from '@/lib/admin/metrics';
import { cn } from '@/lib/utils';
import type { Cohort, QuestionBundle } from '@/types/reference';

/** 문항 분류 이름. 별점은 METRICS 여섯 가지, 서술형은 두 가지를 따로 쓴다. */
const METRIC_LABEL = new Map<string, string>([
  ...METRICS.map((m) => [m.code, m.label] as [string, string]),
  ['RECOMMENDATION', '추천·후속 니즈'],
  ['FEEDBACK', '개선 의견'],
]);

function BackLink() {
  return (
    <Link href="/admin/satisfaction" className="txt-c1-regular text-gray-500 hover:text-gray-900">
      ← 교육 만족도
    </Link>
  );
}

/**
 * 한 회차의 만족도 전체 결과.
 * 지표 요약을 위에 한 번만 보여주고, 문항은 하나의 표로 모은다.
 */
export default function CohortSatisfactionPage() {
  const { offeringId } = useParams<{ offeringId: string }>();
  const cohort = useCohort(offeringId);
  const questions = useOfferingQuestions(offeringId);

  if (cohort.isPending || questions.isPending) return <LoadingState />;

  const error = cohort.error ?? questions.error;
  if (error) {
    return (
      <>
        <BackLink />
        <ErrorState
          error={error}
          onRetry={() => {
            if (cohort.isError) cohort.refetch();
            if (questions.isError) questions.refetch();
          }}
        />
      </>
    );
  }

  if (!cohort.data || !questions.data) {
    return (
      <>
        <BackLink />
        <Card>
          <EmptyState message="없는 회차입니다." />
        </Card>
      </>
    );
  }

  return <Detail cohort={cohort.data} bundle={questions.data} />;
}

function Detail({ cohort, bundle }: { cohort: Cohort; bundle: QuestionBundle }) {
  const { stars, freeText } = bundle;

  const score = overallScore(cohort);
  const rate = responseRate(cohort);
  const weak = weakestMetric(cohort);
  const scored = METRICS.filter((m) => (cohort.scores[m.code] ?? 0) > 0);

  // 설문에 실린 문항 순서 그대로 — 응답자가 본 순서와 같아야 "몇 번 문항"으로 통한다.
  const sorted = [...stars].sort((a, b) => a.order - b.order);
  const totalStarAnswers = stars.reduce((n, q) => n + q.answers, 0);

  return (
    <>
      <BackLink />

      <PageHeader
        title={cohort.programTitle}
        description={[
          cohort.operator,
          cohortLabel(cohort),
          cohort.startDate && cohort.endDate ? `${cohort.startDate} ~ ${cohort.endDate}` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
        action={
          cohort.orgs.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {cohort.orgs.map((o) => (
                <Badge key={o} tone="info">
                  {o}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge tone="neutral">학습 기업 미연결</Badge>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="종합 만족도"
          sub={`${SCALE_MAX}점 만점`}
          value={score ?? '—'}
          tone="success"
        />
        <StatCard
          label="응답률"
          sub={`제출 ${cohort.respondents} / 등록 ${cohort.enrolled}`}
          value={rate === null ? '—' : `${rate}%`}
          tone={rate !== null && rate < 50 ? 'accent' : 'default'}
        />
        <StatCard label="문항" sub="별점 문항 수" value={stars.length} unit="개" />
        <StatCard label="별점 응답" sub="문항별 응답 합계" value={totalStarAnswers} unit="건" />
      </div>

      {stars.length === 0 ? (
        <Card>
          <EmptyState message="이 회차에는 아직 별점 응답이 없습니다." />
        </Card>
      ) : (
        <>
          <Card
            title="지표별 평균"
            action={
              weak ? (
                <Badge tone="warn">보완 · {weak.label}</Badge>
              ) : (
                <Badge tone="success">보완 요소 없음</Badge>
              )
            }
          >
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
              {scored.map((m) => {
                const v = cohort.scores[m.code]!;
                const isWeak = weak?.code === m.code;
                return (
                  <div key={m.code}>
                    <p className="txt-c2-regular text-gray-500">{m.label}</p>
                    <p
                      className={cn(
                        'txt-t3 mt-1 tabular-nums',
                        isWeak ? 'text-special-pink-600' : 'text-gray-900',
                      )}
                    >
                      {rating(v)}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          isWeak ? 'bg-special-pink-600' : 'bg-adm-brand',
                        )}
                        style={{ width: `${(v / SCALE_MAX) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card
            title="문항별 결과"
            description="설문에 실린 문항 순서 그대로입니다."
            padded={false}
          >
            <Table
              minWidth={900}
              columns={['번호', '지표', '문항', '평균', '응답', '점수별 응답 수']}
            >
              {sorted.map((q) => {
                const isWeak = q.metric !== null && weak?.code === q.metric;
                return (
                  <tr key={q.questionId} className={ROW_CLASS}>
                    <Td className="txt-c2-regular whitespace-nowrap text-gray-500 tabular-nums">
                      {q.order}
                    </Td>
                    <Td className="whitespace-nowrap">
                      <span
                        className={cn(
                          'txt-c2-bold rounded-full px-2.5 py-1',
                          isWeak
                            ? 'bg-special-pink-100 text-special-pink-600'
                            : 'bg-adm-line-soft text-gray-700',
                        )}
                      >
                        {q.metric ? (METRIC_LABEL.get(q.metric) ?? q.metric) : '미분류'}
                      </span>
                    </Td>
                    <Td className="w-full min-w-[320px] text-gray-700">{q.content}</Td>
                    <Td className="txt-c1-bold whitespace-nowrap text-gray-900 tabular-nums">
                      {rating(q.mean)}
                    </Td>
                    <Td className="whitespace-nowrap text-gray-500 tabular-nums">{q.answers}건</Td>
                    <Td>
                      <Distribution counts={q.distribution} />
                    </Td>
                  </tr>
                );
              })}
            </Table>
          </Card>
        </>
      )}

      {/* 서술형도 같은 설문의 문항이다. 번호를 빼면 위 별점 표와 짝지을 수 없다. */}
      {[...freeText]
        .sort((a, b) => a.order - b.order)
        .map((q) => {
          const invalid = q.answers.filter((a) => a.valid === false).length;
          const unjudged = q.answers.filter((a) => a.valid === null).length;
          return (
            <Card
              key={q.questionId}
              title={`${q.order}. ${q.content}`}
              description={[
                `${q.answers.length}건`,
                invalid > 0 ? `무효 ${invalid}건` : null,
                unjudged > 0 ? `미판정 ${unjudged}건` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
              action={
                q.metric ? (
                  <Badge tone="neutral">{METRIC_LABEL.get(q.metric) ?? q.metric}</Badge>
                ) : undefined
              }
              padded={false}
            >
              <ul className="divide-adm-line-soft divide-y">
                {q.answers.map((a, i) => (
                  <li
                    key={i}
                    className={cn(
                      'flex items-center gap-4 px-5 py-4 lg:px-6',
                      a.valid === false && 'bg-gray-0',
                    )}
                  >
                    <span className="txt-c2-regular w-6 shrink-0 text-gray-500 tabular-nums">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'txt-c1-regular whitespace-pre-line',
                          a.valid === false ? 'text-gray-500 line-through' : 'text-gray-700',
                        )}
                      >
                        {a.text}
                      </p>
                      {a.valid === false && (
                        <span className="txt-c2-bold text-special-pink-600 mt-1.5 inline-block">
                          유효하지 않은 응답으로 표시됨
                        </span>
                      )}
                    </div>
                    <span className="txt-c2-regular shrink-0 text-gray-500 tabular-nums">
                      {a.submittedAt?.split(' ')[0] ?? ''}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
    </>
  );
}

/**
 * 점수별 응답 수. 색으로 한 번 더 표현하지 않는다 — 숫자가 이미 같은 말을 한다.
 * 가장 많이 나온 점수만 진하게 해서 어디에 몰렸는지 보이게 한다.
 */
function Distribution({ counts }: { counts: [number, number, number, number, number] }) {
  const max = Math.max(...counts);

  return (
    <div className="flex w-[180px] gap-1">
      {counts.map((n, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 rounded-[8px] py-1.5 text-center',
            n > 0 && n === max && 'bg-special-blue-100',
          )}
        >
          <p
            className={cn(
              'tabular-nums',
              n === 0
                ? 'txt-c1-regular text-gray-500'
                : n === max
                  ? 'txt-c1-bold text-adm-brand'
                  : 'txt-c1-bold text-gray-900',
            )}
          >
            {n}
          </p>
          <p className="txt-c2-regular mt-0.5 text-gray-500">{i + 1}점</p>
        </div>
      ))}
    </div>
  );
}
