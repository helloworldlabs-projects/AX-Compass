'use client';

import { CourseCell } from '@/components/admin/common/CourseCell';
import { ExtendLinkButton } from '@/components/admin/post/ExtendLinkButton';
import { CopyLinkButton } from '@/components/admin/post/CopyLinkButton';
import { DeleteLinkButton } from '@/components/admin/post/DeleteLinkButton';
import { IssueLinkForm } from '@/components/admin/post/IssueLinkForm';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  PageHeader,
  ROW_CLASS,
  StatCard,
  Table,
  Td,
} from '@/components/admin/ui';
import { useIssueOptions, usePostLinks } from '@/hooks/usePostLink';
import { usePostResponseCounts } from '@/hooks/usePostResponse';
import { getApiErrorDetail } from '@/types/common';
import type { LinkStatus } from '@/types/postLink';

const TONE: Record<LinkStatus, 'info' | 'neutral'> = { 진행중: 'info', 마감: 'neutral' };

/**
 * 사후검사 발송. 링크는 사람마다가 아니라 **기업마다 하나**다 — 사람마다 만들려면
 * 명단을 받아야 하는데, 그 명단이 곧 개인정보다.
 *
 * 연동 정보(발급 선택지)를 읽지 못하면 발급만 막고 목록은 보여준다.
 */
export default function SessionsPage() {
  const links = usePostLinks();
  const options = useIssueOptions();
  // 응답 수는 링크마다 부르지 않고 한 번에 받는다. 못 읽으면 0 으로 보인다.
  const counts = usePostResponseCounts();
  const countOf = (linkId: number) => counts.data?.get(linkId) ?? 0;

  // 대상 인원은 그 기업에서 사전검사를 치른 사람 수다.
  const targetOf = new Map(
    (options.data?.companies ?? []).map((c) => [c.institutionId, c.preRespondents]),
  );
  const list = links.data ?? [];
  const active = list.filter((l) => l.status === '진행중');
  const totalTarget = list.reduce((a, l) => a + (targetOf.get(l.institutionId) ?? 0), 0);
  const totalResponses = list.reduce((a, l) => a + countOf(l.id), 0);

  return (
    <>
      <PageHeader
        title="사후검사 발송"
        description="기업마다 링크 하나를 발급합니다. 응시자는 링크를 열고 이름을 적어 본인을 밝힙니다."
        action={options.data ? <IssueLinkForm options={options.data} /> : undefined}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard label="발급 링크" sub="기업 단위" value={list.length} unit="건" />
        <StatCard
          label="진행 중"
          sub="응답 받는 중"
          value={active.length}
          unit="건"
          tone="success"
        />
        <StatCard label="대상" sub="사전검사 응시자" value={totalTarget} unit="명" />
        <StatCard
          label="응답"
          sub={
            totalTarget > 0
              ? `응답률 ${Math.round((totalResponses / totalTarget) * 100)}%`
              : '대상 없음'
          }
          value={totalResponses}
          unit="명"
        />
      </div>

      {options.error && (
        <Notice bordered title="연동 정보를 읽지 못해 링크를 발급할 수 없습니다">
          {getApiErrorDetail(options.error) ?? '연동 정보를 읽지 못했습니다.'}
        </Notice>
      )}

      <Card padded={false}>
        {links.isPending ? (
          <LoadingState />
        ) : links.isError ? (
          <ErrorState error={links.error} onRetry={() => links.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState message="발급된 링크가 없습니다." />
        ) : (
          <Table
            columns={['기업', '코드', '과정', '대상', '응답', '마감', '상태', '']}
            minWidth={1060}
            /*
              마지막 칸은 버튼 셋이 한 줄에 들어갈 만큼. 재어 보니 링크 복사 82
              + 마감일 변경 94 + 마감 54 + 사이 간격 16 = 246 이고, 좌우 여백
              28 을 더해 274 가 필요하다. 글자가 조금 길어질 자리를 두어 290.
            */
            columnWidths={[200, 110, null, 90, 110, 120, 90, 290]}
          >
            {list.map((l) => {
              const target = targetOf.get(l.institutionId) ?? 0;
              const rate = target > 0 ? Math.round((countOf(l.id) / target) * 100) : 0;
              return (
                <tr key={l.id} className={ROW_CLASS}>
                  <Td className="txt-c1-bold text-gray-900">{l.org}</Td>
                  <Td className="text-gray-500 tabular-nums">{l.code}</Td>
                  <Td className="text-gray-500">
                    <CourseCell offerings={l.offerings} fallback={l.course} />
                    {l.offerings.length > 1 && (
                      <span className="txt-c2-regular mt-0.5 block text-gray-400">
                        {l.offerings.map((o) => o.title).join(' · ')}
                      </span>
                    )}
                  </Td>
                  <Td className="tabular-nums">{target > 0 ? `${target}명` : '—'}</Td>
                  <Td className="txt-c1-bold tabular-nums">
                    {countOf(l.id)}명
                    <span className="txt-c2-regular ml-1.5 text-gray-500">{rate}%</span>
                  </Td>
                  <Td className="text-gray-500 tabular-nums">{l.dueOn}</Td>
                  <Td>
                    <Badge tone={TONE[l.status]}>{l.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <span className="flex flex-wrap items-center justify-end gap-2">
                      <CopyLinkButton slug={l.slug} />
                      {/*
                        진행중이든 마감이든 보인다. 마감된 뒤에 늘리면 그
                        사이에 들어오려던 사람이 "종료되었습니다"를 보고
                        돌아간다. 새로 발급하면 주소가 바뀌어 이미 안내한
                        링크가 죽으므로, 같은 링크의 날짜를 바꾼다.
                      */}
                      <ExtendLinkButton link={l} />
                      {l.status === '진행중' && (
                        <DeleteLinkButton id={l.id} org={l.org} responses={countOf(l.id)} />
                      )}
                    </span>
                  </Td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>

      <Card title="링크를 다루는 방식">
        <ul className="txt-c1-regular space-y-2 text-gray-500">
          <li>
            · 링크는 <b className="text-gray-900">기업마다 하나</b>입니다. 사람마다 만들지 않습니다
            — 그러려면 명단을 먼저 받아야 하는데, 그 명단이 곧 개인정보입니다.
          </li>
          <li>
            · 링크만으로는 누가 응답했는지 알 수 없어, 응시자가{' '}
            <b className="text-gray-900">이름</b>을 적습니다. 사전검사 때와 다르게 적으면 그 사람은
            향상도 계산에서 빠집니다.
          </li>
          <li>
            · 대상 인원은 그 기업에서 사전검사를 치른 사람 수입니다. 사후검사만 응답한 사람은 비교할
            상대가 없습니다.
          </li>
          <li>
            · 발급은 <b className="text-gray-900">사전검사와 교육 만족도가 모두 연동된 기업</b>에만
            합니다. 사전이 없으면 향상도를 낼 수 없고, 만족도가 없으면 교육이 어땠는지 물을 자리가
            없습니다.
          </li>
          <li>
            · 잘못 보냈다면 <b className="text-gray-900">마감</b>합니다. 그 주소로는 응시할 수 없게
            되고 같은 기업에 다시 발급할 수 있습니다. 이미 들어온 응답은 그 기업에 그대로 남습니다.
          </li>
          <li>
            · 교육은 차수를 나눠 운영하지만 사후검사는{' '}
            <b className="text-gray-900">기업 단위로 한 번</b> 실시합니다. 사전검사도 같은 방식이라
            두 결과가 기업에서 그대로 맞물립니다.
          </li>
          <li>
            · 한 기업이 여러 과정을 들었다면 발급할 때{' '}
            <b className="text-gray-900">과정을 여러 개 고를 수 있습니다</b>. 고른 과정들의 만족도가
            한 보고서에 함께 실립니다. 과정 이름은 첫 과정에 &quot;외 N건&quot;을 붙여 적고, 묶인
            과정은 위 표의 과정 칸에 모두 나옵니다.
          </li>
        </ul>
      </Card>

      <Notice bordered title="응답을 고칠 수는 없습니다">
        제출된 응답은 수정하거나 지울 수 없습니다. 링크를 마감해도 남습니다. 잘못 들어온 응답이
        있으면 담당자에게 문의해 주세요.
      </Notice>
    </>
  );
}
