'use client';

import { Fragment } from 'react';
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
import { usePreOrg } from '@/hooks/useReference';
import { GROUP_NAMES, PROFILE_NAMES } from '@/lib/admin/ax-scoring';
import {
  LEVEL_LABEL,
  MEMBER_COMPETENCIES,
  MIN_GROUP_SIZE,
  levelOf,
  orgLabel,
  score,
  stageOf,
} from '@/lib/admin/metrics';
import { cn } from '@/lib/utils';
import type { PreOrgDetail } from '@/types/reference';

/**
 * 아래로 이어지는 표들의 첫 열 너비. 같은 자리에서 시작해야 화면을 내릴 때 눈이 흔들리지 않는다.
 * 가장 긴 하위 역량 이름이 들여쓴 자리까지 더해 한 줄에 들어가는 너비다.
 */
const FIRST_COL = 380;

function BackLink() {
  return (
    <Link href="/admin/pre" className="txt-c1-regular text-gray-500 hover:text-gray-900">
      ← 사전검사 연동
    </Link>
  );
}

/**
 * 기업 한 곳의 사전검사.
 * 최소 인원에 못 미치는 부서는 기업 보고서에서 묶인다는 사실을 함께 밝힌다.
 */
export default function PreOrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const institutionId = Number(id);
  const valid = Number.isInteger(institutionId);
  const query = usePreOrg(valid ? institutionId : undefined);

  if (valid && query.isPending) return <LoadingState />;
  if (query.isError) {
    return (
      <>
        <BackLink />
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      </>
    );
  }
  if (!query.data) {
    return (
      <>
        <BackLink />
        <Card>
          <EmptyState message="사전검사 기록이 없는 기업입니다." />
        </Card>
      </>
    );
  }

  return <Detail detail={query.data} />;
}

function Detail({ detail }: { detail: PreOrgDetail }) {
  const { org, sections, competencies, levels, profiles, departments, suppressed, maturity } =
    detail;

  const examSections = sections.filter(
    (s) => s.component !== 'CURRENT_MATURITY' && s.component !== 'TARGET_MATURITY',
  );
  const share = (n: number) => `${Math.round((n / org.respondents) * 100)}%`;

  return (
    <>
      <BackLink />

      <PageHeader
        title={orgLabel(org)}
        description={[
          org.code ? `SafariOn 코드 ${org.code}` : 'SafariOn 기관 정보 없음',
          org.lastAt ? `최근 응시 ${org.lastAt}` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      />

      {/* 카드의 이름과 순서를 목록 화면과 맞춘다. 두 검사는 대상이 달라 응시자를 합치지 않는다. */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        <StatCard label="부서" sub="응시자 소속" value={org.departments} unit="개" />
        <StatCard label="역량 검사" sub="구성원 응시" value={org.respondents} unit="명" />
        <StatCard
          label="종합 역량 수준"
          sub={org.avgScore === null ? '응시 없음' : `평균 ${score(org.avgScore)}점`}
          value={levelOf(org.avgScore) ?? '—'}
        />
        <StatCard label="성숙도 검사" sub="임원 응시" value={org.executives} unit="명" />
        <StatCard
          label="성숙도 수준"
          sub={
            org.maturityCurrent === null
              ? '성숙도 검사 없음'
              : `현재 ${score(org.maturityCurrent)}점 → 목표 ${score(org.maturityTarget)}점`
          }
          value={
            org.maturityCurrent === null
              ? '—'
              : `${stageOf(org.maturityCurrent) ?? '—'} → ${stageOf(org.maturityTarget) ?? '—'}`
          }
        />
      </div>

      {org.respondents === 0 ? (
        <Card title="역량 검사">
          <EmptyState message="이 기업에는 역량 검사 기록이 없습니다." />
        </Card>
      ) : (
        <>
          <Card title="영역별 평균">
            <div className="grid gap-4 lg:grid-cols-3">
              {examSections.map((s) => (
                <div key={s.component} className="bg-gray-0 rounded-[16px] px-5 py-4">
                  <p className="txt-c1-bold text-gray-900">{s.name}</p>
                  <p className="txt-t3 mt-3 text-gray-900 tabular-nums">
                    {s.avg === null ? '—' : score(s.avg)}
                    <span className="txt-c1-regular ml-1 text-gray-500">점</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="역량별 평균"
            description="역량 점수는 영역 가중치를 적용한 값이고, 하위 역량은 문항 단순 평균입니다. 두 값이 서로 다른 계산이라 하위 역량을 평균해도 역량 점수와 같아지지 않습니다."
            padded={false}
          >
            <Table columns={['역량', '평균', '수준']} minWidth={560} columnWidths={[null, 110, 90]}>
              {competencies.map((c) => (
                <Fragment key={c.code}>
                  <tr className="border-adm-line-soft bg-gray-0 border-b">
                    <Td className="txt-c1-bold">{c.name}</Td>
                    <Td className="txt-c1-bold tabular-nums">
                      {c.avg === null ? '—' : `${score(c.avg)}점`}
                    </Td>
                    <Td className="txt-c1-bold text-adm-brand">{levelOf(c.avg) ?? '—'}</Td>
                  </tr>

                  {/*
                    하위 역량은 역량 아래에 들여 붙인다. 수준은 역량 단위로만 매긴다.

                    예전에는 앞에 "└" 를 달았는데, 부모–자식처럼 보여 더해서 맞추려는
                    사람이 생겼다. 두 점수는 계산이 달라 맞지 않는다. 들여쓰기로만
                    묶고 위계를 나타내는 기호는 두지 않는다.
                  */}
                  {c.tags.map((t) => (
                    <tr key={t.code} className={ROW_CLASS}>
                      <Td className="pl-10 text-gray-500">{t.name}</Td>
                      <Td className="text-gray-700 tabular-nums">
                        {t.avg === null ? '—' : `${score(t.avg)}점`}
                      </Td>
                      <Td>{null}</Td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </Table>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="레벨 분포" padded={false}>
              <Table columns={['레벨', '인원', '비중']} minWidth={360} firstColumnWidth={120}>
                {levels.map((l) => (
                  <tr key={l.level} className={ROW_CLASS}>
                    <Td className="txt-c1-bold">{LEVEL_LABEL[l.level] ?? l.level}</Td>
                    <Td className="tabular-nums">{l.n}명</Td>
                    <Td className="text-gray-500 tabular-nums">{share(l.n)}</Td>
                  </tr>
                ))}
              </Table>
            </Card>

            <Card title="프로필 유형" padded={false}>
              <Table
                columns={['유형', '묶음', '인원', '비중']}
                minWidth={420}
                firstColumnWidth={120}
              >
                {profiles.map((p) => (
                  <tr key={`${p.type}-${p.group}`} className={ROW_CLASS}>
                    <Td className="txt-c1-bold">
                      {PROFILE_NAMES[p.type as keyof typeof PROFILE_NAMES] ?? p.type}
                    </Td>
                    <Td className="text-gray-500">
                      {GROUP_NAMES[p.group as keyof typeof GROUP_NAMES] ?? p.group}
                    </Td>
                    <Td className="tabular-nums">{p.n}명</Td>
                    <Td className="text-gray-500 tabular-nums">{share(p.n)}</Td>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>

          <Card title="부서별 평균" padded={false}>
            {departments.length === 0 ? (
              <EmptyState message="부서 정보가 없습니다." />
            ) : (
              <Table
                columns={[
                  '부서',
                  '응시자',
                  '비중',
                  '역량 평균',
                  '수준',
                  ...MEMBER_COMPETENCIES.map((c) => c.short),
                  '임원',
                  '성숙도 평균(현재)',
                  '수준',
                  '성숙도 평균(목표)',
                  '수준',
                ]}
                minWidth={1560}
                firstColumnWidth={FIRST_COL}
              >
                {departments.map((d) => (
                  <tr key={d.name} className={ROW_CLASS}>
                    <Td className="txt-c1-bold">
                      <span className="flex items-center gap-2">
                        {d.name}
                        {d.small && <Badge tone="warn">표본 부족</Badge>}
                      </span>
                    </Td>
                    <Td className="tabular-nums">{d.n > 0 ? `${d.n}명` : '—'}</Td>
                    <Td className="text-gray-500 tabular-nums">
                      {d.n > 0 && org.respondents > 0 ? share(d.n) : '—'}
                    </Td>
                    <Td className="txt-c1-bold tabular-nums">
                      {d.avg === null ? '—' : `${score(d.avg)}점`}
                    </Td>
                    <Td className="txt-c1-bold text-adm-brand">{levelOf(d.avg) ?? '—'}</Td>
                    {MEMBER_COMPETENCIES.map((c) => (
                      <Td key={c.code} className="text-gray-500 tabular-nums">
                        {score(d.byCompetency[c.code])}
                      </Td>
                    ))}

                    {/* 성숙도는 임원 검사라 부서마다 한두 명뿐이다. 운영 화면에서는 그대로 보여준다. */}
                    <Td className="text-gray-500 tabular-nums">
                      {d.maturity ? `${d.maturity.n}명` : '—'}
                    </Td>
                    <Td className="tabular-nums">
                      {d.maturity?.current == null ? '—' : score(d.maturity.current)}
                    </Td>
                    <Td className="txt-c1-bold text-adm-brand">
                      {stageOf(d.maturity?.current ?? null) ?? '—'}
                    </Td>
                    <Td className="tabular-nums">
                      {d.maturity?.target == null ? '—' : score(d.maturity.target)}
                    </Td>
                    <Td className="txt-c1-bold text-adm-brand">
                      {stageOf(d.maturity?.target ?? null) ?? '—'}
                    </Td>
                  </tr>
                ))}
              </Table>
            )}

            {suppressed.respondents > 0 && (
              <div className="border-adm-line-soft border-t px-5 py-4 lg:px-6">
                <p className="txt-c1-regular text-gray-500">
                  {MIN_GROUP_SIZE}명 미만인 부서가 {suppressed.departments}개 ·{' '}
                  {suppressed.respondents}명입니다. 여기서는 그대로 보이지만, 기업에 전달하는
                  보고서에서는 부서 이름 없이 묶입니다.
                </p>
                <p className="txt-c1-regular mt-2 text-gray-500">
                  성숙도는 임원 검사라 부서마다 한두 명뿐인 경우가 많습니다. 평균이 곧 그 사람의
                  답이 되므로, 기업에 전달하는 보고서에서는 부서로 나누지 않습니다.
                </p>
              </div>
            )}
          </Card>
        </>
      )}

      {org.executives > 0 && (
        <Card title="성숙도 검사" padded={false}>
          {org.executives < MIN_GROUP_SIZE && (
            <div className="border-adm-line-soft bg-special-pink-0 border-b px-5 py-4 lg:px-6">
              <p className="txt-c1-regular text-gray-500">
                응답한 임원이 {org.executives}명뿐이라 평균이 개인의 답과 다르지 않습니다. 기업에
                전달하는 보고서에는 수치를 그대로 싣지 마세요.
              </p>
            </div>
          )}
          <div className="border-adm-line-soft grid gap-4 border-b px-5 py-5 lg:grid-cols-2 lg:px-6">
            <div>
              <p className="txt-c2-bold text-gray-500">현재 성숙도</p>
              <p className="txt-t3 mt-1 text-gray-900 tabular-nums">
                {score(org.maturityCurrent)}
                <span className="txt-c1-regular ml-1 text-gray-500">점</span>
              </p>
              <p className="txt-c1-bold mt-1 text-gray-500">
                {stageOf(org.maturityCurrent) ?? '—'}
              </p>
            </div>
            <div>
              <p className="txt-c2-bold text-gray-500">목표 성숙도</p>
              <p className="txt-t3 text-adm-brand mt-1 tabular-nums">
                {score(org.maturityTarget)}
                <span className="txt-c1-regular ml-1 text-gray-500">점</span>
              </p>
              <p className="txt-c1-bold text-adm-brand mt-1">
                {stageOf(org.maturityTarget) ?? '—'}
              </p>
            </div>
          </div>

          {maturity.competencies.length > 0 && (
            <Table
              columns={['임원 역량', '현재', '목표', '격차']}
              minWidth={700}
              firstColumnWidth={FIRST_COL}
            >
              {maturity.competencies.map((c) => {
                const gap =
                  c.current !== null && c.target !== null
                    ? Math.round((c.target - c.current) * 10) / 10
                    : null;
                return (
                  <tr key={c.code} className={ROW_CLASS}>
                    <Td className="txt-c1-bold">{c.name}</Td>
                    <Td className="tabular-nums">{score(c.current)}</Td>
                    <Td className="text-adm-brand tabular-nums">{score(c.target)}</Td>
                    {/* 목표가 현재보다 낮으면 이미 넘어선 역량이다. 부호를 그대로 살린다. */}
                    <Td
                      className={cn(
                        'txt-c1-bold tabular-nums',
                        gap !== null && gap < 0 ? 'text-green-700' : 'text-special-pink-600',
                      )}
                    >
                      {gap === null ? '—' : gap > 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)}
                    </Td>
                  </tr>
                );
              })}
            </Table>
          )}
        </Card>
      )}
    </>
  );
}
