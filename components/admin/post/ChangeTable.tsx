import { Fragment } from 'react';

import { Badge, ROW_CLASS, Table, Td } from '@/components/admin/ui';
import { levelOf, score } from '@/lib/admin/metrics';
import type { Change } from '@/lib/admin/post-stats';
import { cn } from '@/lib/utils';
import type { NameHit } from '@/types/reference';

/**
 * 아래로 이어지는 표들의 첫 열 너비. 영역·역량·유형·부서가 같은 자리에서 시작해야
 * 화면을 내릴 때 눈이 흔들리지 않는다.
 */
export const FIRST_COL = 380;

export function deltaText(v: number | null): string {
  if (v === null) return '—';
  return v > 0 ? `+${score(v)}` : score(v);
}

export function deltaClass(v: number | null): string {
  if (v === null) return 'tabular-nums text-gray-500';
  return cn('txt-c1-bold tabular-nums', v > 0 ? 'text-green-700' : 'text-special-pink-600');
}

/** 못 붙은 이름이 사전검사 어디에 있는지. */
export function Trace({ orgName, hits }: { orgName: string; hits: NameHit[] }) {
  if (hits.length === 0) {
    return (
      <p className="txt-c1-regular text-gray-500">
        사전검사 명단 어디에도 같은 이름이 없습니다. 사전검사를 치르지 않은 사람으로 보입니다.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {hits.map((h) => {
        const here = h.org === orgName;
        return (
          <li key={`${h.institutionId}-${h.department}`} className="txt-c1-regular">
            <span className="flex flex-wrap items-center gap-2">
              <Badge tone={here ? 'info' : 'warn'}>{here ? '같은 기업' : '다른 기업'}</Badge>
              <b className="text-gray-900">{h.org ?? `기관 ${h.institutionId}`}</b>
              {h.code && (
                <span className="txt-c2-regular text-gray-500 tabular-nums">{h.code}</span>
              )}
              {h.department && <span className="text-gray-500">· {h.department}</span>}
            </span>
            <p className="txt-c1-regular mt-1 text-gray-500">
              {here
                ? '같은 기업 명단에 있습니다. 이름을 다르게 적어 매칭 되지 않았습니다 — 띄어쓰기나 표기를 확인해 주세요.'
                : '다른 기업 명단에 있습니다. 링크를 잘못 받았거나 소속이 바뀐 사람일 수 있습니다.'}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export function Panel({
  label,
  sub,
  value,
  level,
  tone = 'default',
}: {
  label: string;
  sub?: string;
  value: number | null;
  /** 점수만 두면 등급이 갈렸는지가 보이지 않는다. */
  level?: string | null;
  tone?: 'default' | 'brand' | 'delta';
}) {
  const color =
    tone === 'brand'
      ? 'text-adm-brand'
      : tone === 'delta'
        ? value !== null && value > 0
          ? 'text-green-700'
          : 'text-special-pink-600'
        : 'text-gray-900';

  return (
    <div className="bg-gray-0 rounded-[16px] px-5 py-4">
      <p className="txt-c2-bold text-gray-500">{label}</p>
      {sub && <p className="txt-c2-regular mt-0.5 text-gray-500">{sub}</p>}
      <p className={cn('txt-t3 mt-2 tabular-nums', color)}>
        {tone === 'delta' ? deltaText(value) : score(value)}
        <span className="txt-c1-regular ml-1 text-gray-500">점</span>
      </p>
      {level && <p className="txt-c1-bold mt-1 text-gray-500">{level}</p>}
    </div>
  );
}

export interface ChangeTableProps {
  rows: Change[];
  firstColumn: string;
  /** 응답한 사람 수. 열 이름에 적어 어느 기준인지 드러낸다. */
  all: number;
  /** 사전검사를 치른 사람 전체의 평균. */
  preAll?: { n: number; values: Record<string, number | null> } | null;
  /** 역량 아래에 펼칠 하위 역량. 수준은 역량 단위로만 매긴다. */
  subRows?: Map<string, { label: string; pre: number | null; post: number | null }[]>;
  /** 입문·초급·중급·고급은 종합과 역량에만 매긴다. 영역에는 붙이지 않는다. */
  showLevel?: boolean;
}

/**
 * 사전 → 사후 변화. 양쪽 모두 그 시점에 검사를 치른 사람 전부로 낸다 — 같은 사람끼리
 * 짝지은 값이 아니다.
 */
export function ChangeTable({
  rows,
  firstColumn,
  all,
  preAll = null,
  subRows,
  showLevel = false,
}: ChangeTableProps) {
  return (
    <>
      <Table
        columns={[
          firstColumn,
          preAll ? `사전(${preAll.n}명)` : '사전',
          `사후(${all}명)`,
          '변화',
          ...(showLevel ? ['수준'] : []),
        ]}
        minWidth={showLevel ? 880 : 780}
        firstColumnWidth={FIRST_COL}
      >
        {rows.map((r) => {
          const base = preAll ? (preAll.values[r.key] ?? null) : r.pre;
          const delta =
            base === null || r.postAll === null ? null : Math.round((r.postAll - base) * 10) / 10;
          const tags = subRows?.get(r.key) ?? [];
          return (
            <Fragment key={r.key}>
              <tr className={cn('border-adm-line-soft border-b', tags.length > 0 && 'bg-gray-0')}>
                <Td className="txt-c1-bold text-gray-900">{r.label}</Td>
                <Td className="text-gray-500 tabular-nums">{score(base)}</Td>
                <Td className="txt-c1-bold tabular-nums">{score(r.postAll)}</Td>
                <Td className={deltaClass(delta)}>{deltaText(delta)}</Td>
                {showLevel && (
                  <Td className="txt-c1-bold text-adm-brand">{levelOf(r.postAll) ?? '—'}</Td>
                )}
              </tr>

              {tags.map((t) => {
                const d =
                  t.pre === null || t.post === null ? null : Math.round((t.post - t.pre) * 10) / 10;
                return (
                  <tr key={t.label} className={ROW_CLASS}>
                    <Td className="pl-10 text-gray-500">
                      <span className="text-gray-400">└</span> {t.label}
                    </Td>
                    <Td className="text-gray-500 tabular-nums">{score(t.pre)}</Td>
                    <Td className="text-gray-700 tabular-nums">{score(t.post)}</Td>
                    <Td className={deltaClass(d)}>{deltaText(d)}</Td>
                    {showLevel && <Td>{null}</Td>}
                  </tr>
                );
              })}
            </Fragment>
          );
        })}
      </Table>
      <div className="border-adm-line-soft border-t px-6 py-4">
        <p className="txt-c1-regular text-gray-500">
          사전은 사전검사를 치른 사람 전부, 사후는 응답한 {all}명 전부이고 변화는 그 둘의
          차이입니다. 같은 사람끼리 짝지은 값이 아닙니다.
          {subRows ? ' 수준은 역량 단위로만 매깁니다.' : ''}
        </p>
      </div>
    </>
  );
}
