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
import { usePreOrgs } from '@/hooks/useReference';
import { MEMBER_COMPETENCIES, levelOf, orgLabel, score, stageOf } from '@/lib/admin/metrics';
import { cn } from '@/lib/utils';
import type { PreOrg } from '@/types/reference';

const TITLE = '사전검사 연동';

/**
 * 사전검사 연동 — AX Compass 실데이터. 기업 단위로 보고 개인 점수는 올리지 않는다.
 * 역량 검사(구성원)와 성숙도 검사(임원)는 한 줄에 나란히 두되 섞지 않는다.
 */
export default function PreAssessmentPage() {
  const query = usePreOrgs();

  if (query.isPending) return <LoadingState />;
  if (query.isError) {
    return (
      <>
        <PageHeader
          title={TITLE}
          description="AX Compass 사전검사 결과를 기업 단위로 조회합니다."
        />
        <ErrorState
          error={query.error}
          onRetry={() => query.refetch()}
          fallback="사전검사에 연결하지 못했습니다."
        />
      </>
    );
  }

  return <PreOrgs orgs={query.data} />;
}

/** 기업 평균의 평균. 사람 수로 가중하면 응시자가 많은 한 곳이 전체를 대표해 버린다. */
function mean(values: (number | null)[]) {
  const v = values.filter((x): x is number => x !== null);
  return v.length > 0 ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
}

function PreOrgs({ orgs }: { orgs: PreOrg[] }) {
  const params = useSearchParams();
  const keyword = (params.get('q') ?? '').trim();

  // 기업명과 코드로 찾는다. 담당자는 둘 중 손에 잡히는 쪽으로 기억한다.
  const found = keyword
    ? orgs.filter(
        (o) =>
          (o.name ?? '').includes(keyword) ||
          (o.code ?? '').toLowerCase().includes(keyword.toLowerCase()),
      )
    : orgs;
  const view = paginate(found, Number(params.get('page') ?? 1));

  const withRegular = orgs.filter((o) => o.respondents > 0);
  const totalRespondents = orgs.reduce((a, o) => a + o.respondents, 0);
  const totalExecutives = orgs.reduce((a, o) => a + o.executives, 0);

  // 기업 평균을 다시 평균 낸 값이다. 사람 수로 가중하지 않으므로 3명짜리 기업과
  // 22명짜리 기업이 같은 무게를 갖는다. 바로 옆 카드가 응시 인원이라 그 인원의
  // 평균으로 읽히기 쉬워, 무엇을 몇 개 평균했는지 화면에 적는다.
  const average = mean(withRegular.map((o) => o.avgScore));
  const withExec = orgs.filter((o) => o.executives > 0);
  const maturity = mean(withExec.map((o) => o.maturityCurrent));
  const maturityTarget = mean(withExec.map((o) => o.maturityTarget));

  return (
    <>
      <PageHeader
        title={TITLE}
        description="AX Compass 사전검사 결과를 기업 단위로 조회합니다. 개인 점수는 표시하지 않습니다."
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        <StatCard label="기업" sub="사전검사 실시" value={withRegular.length} unit="곳" />
        <StatCard label="역량 검사" sub="구성원 응시" value={totalRespondents} unit="명" />
        <StatCard
          label="종합 역량 수준"
          sub={
            average === null ? '응시 없음' : `기업 ${withRegular.length}곳 평균 ${score(average)}점`
          }
          value={levelOf(average) ?? '—'}
        />
        <StatCard label="성숙도 검사" sub="임원 응시" value={totalExecutives} unit="명" />
        <StatCard
          label="성숙도 수준"
          sub={
            maturity === null
              ? '평균 없음'
              : `기업 ${withExec.length}곳 · 현재 ${score(maturity)}점 → 목표 ${score(maturityTarget)}점`
          }
          value={`${stageOf(maturity) ?? '—'} → ${stageOf(maturityTarget) ?? '—'}`}
        />
      </div>

      <Card
        title="기업별 현황"
        action={<SearchBox placeholder="기업명 또는 코드" value={keyword} />}
        padded={false}
      >
        {view.rows.length === 0 ? (
          <EmptyState
            message={keyword ? `"${keyword}" 와 맞는 기업이 없습니다.` : '사전검사 기록이 없습니다.'}
          />
        ) : (
          <Table
            columns={[
              '기업',
              '코드',
              '역량 검사',
              '종합',
              ...MEMBER_COMPETENCIES.map((c) => c.short),
              '성숙도 검사',
              '현재 수준',
              '목표 수준',
              '최근 응시',
              '',
            ]}
            minWidth={1340}
            // 기업명과 코드만 폭을 잡고, 숫자 열은 남은 자리를 똑같이 나눈다.
            columnWidths={[220, 110, ...Array(9).fill(null), 130, 72]}
          >
            {view.rows.map((o) => (
              <tr key={o.institutionId} className={ROW_CLASS}>
                <Td className="txt-c1-bold">{orgLabel(o)}</Td>
                <Td className="text-gray-500 tabular-nums">{o.code ?? '—'}</Td>
                <Td>
                  {o.respondents > 0 ? (
                    <Badge tone="neutral">{o.respondents}명</Badge>
                  ) : (
                    <span className="txt-c2-regular text-gray-500">미실시</span>
                  )}
                </Td>
                <Td>
                  <Level value={o.avgScore} label={levelOf(o.avgScore)} />
                </Td>
                {MEMBER_COMPETENCIES.map((c) => (
                  <Td key={c.code}>
                    <Level value={o.byCompetency[c.code]} label={levelOf(o.byCompetency[c.code])} />
                  </Td>
                ))}
                <Td>
                  {o.executives > 0 ? (
                    <Badge tone="info">{o.executives}명</Badge>
                  ) : (
                    <span className="txt-c2-regular text-gray-500">미실시</span>
                  )}
                </Td>
                <Td>
                  <Level value={o.maturityCurrent} label={stageOf(o.maturityCurrent)} />
                </Td>
                <Td>
                  <Level value={o.maturityTarget} label={stageOf(o.maturityTarget)} target />
                </Td>
                <Td className="whitespace-nowrap text-gray-500 tabular-nums">{o.lastAt ?? '—'}</Td>
                <Td className="text-right">
                  <LinkButton href={`/admin/pre/${o.institutionId}`}>상세</LinkButton>
                </Td>
              </tr>
            ))}
          </Table>
        )}

        <Pagination {...view} query={keyword} />
      </Card>

      <Card title="읽는 범위">
        <ul className="txt-c1-regular space-y-2 text-gray-500">
          <li>
            · 위 카드의 평균은 <b className="text-gray-900">기업별 평균을 다시 평균 낸 값</b>
            입니다. 응시 인원으로 가중하지 않으므로, 인원이 적은 기업과 많은 기업이 같은 무게를
            가집니다. 아래 표에서 기업별 숫자를 함께 봐 주세요.
          </li>
          <li>
            · 수준 옆의 숫자가 평균 점수입니다.{' '}
            <b className="text-gray-900">50 미만 입문 · 70 미만 초급 · 90 미만 중급</b> 으로
            나뉘며, 성숙도는 같은 구간을 도입·활용·통합·혁신이라 부릅니다.
          </li>
          <li>
            · 역량 검사는 <b className="text-gray-900">정밀검사(72문항)</b>만 가져옵니다. 간이검사는
            로그인 없이 치러 누구인지도 어느 기업인지도 알 수 없어 대상이 아닙니다.
          </li>
          <li>
            · 기업은 응시자 계정의 소속으로 붙습니다. 이 번호는 SafariOn 기관 번호와 같아 만족도와
            같은 기업으로 이어집니다.
          </li>
          <li>
            · 사후검사와의 매칭은 <b className="text-gray-900">이름</b>으로 합니다. 이름은 두 결과를
            맞추는 데만 쓰고, 보고서에는 개인이 등장하지 않습니다.
          </li>
          <li>
            · 교육은 차수를 나눠 운영하지만 사전·사후검사는 모두{' '}
            <b className="text-gray-900">기업 단위로 한 번</b> 실시합니다. 그래서 두 결과가
            기업에서 그대로 맞물립니다.
          </li>
        </ul>
      </Card>
    </>
  );
}

function Level({
  value,
  label,
  target = false,
}: {
  value: number | null;
  label: string | null;
  target?: boolean;
}) {
  if (value === null || label === null) {
    return <span className="txt-c2-regular text-gray-500">—</span>;
  }
  return (
    <span className="block whitespace-nowrap">
      <b className={cn('txt-c1-bold', target ? 'text-adm-brand' : 'text-gray-900')}>{label}</b>
      <span className="txt-c2-regular ml-1.5 text-gray-500 tabular-nums">{score(value)}</span>
    </span>
  );
}
