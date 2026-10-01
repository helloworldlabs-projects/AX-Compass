import Form from 'next/form';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { getApiErrorDetail } from '@/types/common';

/*
  운영 관리자 공용 UI. 원본(AX_Compass_after/src/components/ui.tsx)의 모양을 그대로 옮겼다.
  호스트 components/ui/* 는 공개 사이트용(60px 버튼·그림자·보라 강조)이라 모양이 달라 쓰지 않는다.
*/

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-adm-brand';

/* ── 페이지 헤더 ─────────────────────────────────────────── */

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
      <div>
        <h1 className="txt-t3 tracking-tight text-gray-900">{title}</h1>
        {description && <p className="txt-c1-regular mt-2 text-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── 지표 카드 ───────────────────────────────────────────── */

export interface StatCardProps {
  label: string;
  sub?: string;
  value: string | number;
  unit?: string;
  tone?: 'default' | 'accent' | 'success';
}

const STAT_TONES: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'text-gray-900',
  accent: 'text-special-pink-600',
  success: 'text-green-700',
};

export function StatCard({ label, sub, value, unit, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-[16px] border border-gray-100 bg-white px-6 py-5">
      <p className="txt-c1-bold text-gray-500">{label}</p>
      {sub && <p className="txt-c2-regular mt-0.5 text-gray-500">{sub}</p>}
      <p className={cn('txt-t3 mt-3 tabular-nums', STAT_TONES[tone])}>
        {value}
        {unit && <span className="txt-c1-regular ml-1 text-gray-500">{unit}</span>}
      </p>
    </div>
  );
}

/* ── 배지 ────────────────────────────────────────────────── */

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-adm-line-soft text-gray-500',
  info: 'bg-special-blue-100 text-special-blue-600',
  success: 'bg-green-0 text-green-700',
  warn: 'bg-special-pink-0 text-special-pink-600',
  danger: 'bg-red-100 text-red-700',
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'txt-c2-bold inline-flex items-center rounded-full px-2.5 py-1 whitespace-nowrap',
        BADGE_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ── 안내 상자 ───────────────────────────────────────────── */

export interface NoticeProps {
  title: string;
  children?: ReactNode;
  tone?: 'warn' | 'success';
  /** 테두리를 둘지. 페이지 상단 경고는 true, 카드 안 안내는 false. */
  bordered?: boolean;
}

export function Notice({ title, children, tone = 'warn', bordered = false }: NoticeProps) {
  const warn = tone === 'warn';
  return (
    <div
      role={warn ? 'alert' : 'status'}
      className={cn(
        'rounded-[16px] px-5 py-4 lg:px-6',
        warn ? 'bg-special-pink-0' : 'bg-green-0',
        bordered && (warn ? 'border-special-pink-200 border' : 'border border-green-200'),
      )}
    >
      <p className={cn('txt-c1-bold', warn ? 'text-special-pink-600' : 'text-green-700')}>
        {title}
      </p>
      {children && <div className="txt-c1-regular mt-1.5 text-gray-500">{children}</div>}
    </div>
  );
}

/* ── 카드 / 섹션 ─────────────────────────────────────────── */

export interface CardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  padded?: boolean;
}

/** 머리는 <header> 가 아니라 <div> 다 — 호스트 인쇄 CSS 가 header/footer 를 전부 감춘다. */
export function Card({ title, description, action, children, padded = true }: CardProps) {
  return (
    <section className="rounded-[16px] border border-gray-100 bg-white">
      {(title || action) && (
        <div className="border-adm-line-soft flex flex-col gap-3 border-b px-5 py-5 lg:flex-row lg:items-start lg:justify-between lg:gap-4 lg:px-6">
          <div>
            {title && <h2 className="txt-b-bold text-gray-900">{title}</h2>}
            {description && <p className="txt-c2-regular mt-1 text-gray-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={padded ? 'px-5 py-5 lg:px-6' : ''}>{children}</div>
    </section>
  );
}

/* ── 표 ──────────────────────────────────────────────────── */

export interface TableProps {
  columns: string[];
  children: ReactNode;
  /** 열이 많은 표는 눌리지 않도록 최소 너비를 키운다. 좁은 화면에서는 가로 스크롤. */
  minWidth?: number;
  /** 첫 열 너비. 주면 나머지 열이 남은 자리를 똑같이 나눈다(table-fixed). */
  firstColumnWidth?: number;
  /** 열마다 너비. null 인 열끼리 남은 자리를 나눈다. */
  columnWidths?: (number | null)[];
  /** 줄 간격을 좁힌다(보고서 지면용). */
  dense?: boolean;
}

export function Table({
  columns,
  children,
  minWidth = 720,
  firstColumnWidth,
  columnWidths,
  dense = false,
}: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          'txt-c1-regular w-full border-collapse',
          (firstColumnWidth !== undefined || columnWidths !== undefined) && 'table-fixed',
          dense && '[&_td]:py-1.5 [&_th]:py-2',
        )}
        // 표마다 다른 값이라 토큰으로 둘 수 없다.
        style={{ minWidth }}
      >
        {columnWidths !== undefined ? (
          <colgroup>
            {columns.map((c, i) => (
              <col
                key={`${c}-${i}`}
                style={columnWidths[i] ? { width: columnWidths[i]! } : undefined}
              />
            ))}
          </colgroup>
        ) : firstColumnWidth !== undefined ? (
          <colgroup>
            <col style={{ width: firstColumnWidth }} />
          </colgroup>
        ) : null}
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((c, i) => (
              <th
                key={`${c}-${i}`}
                scope="col"
                className="txt-c2-bold px-4 py-3 text-left whitespace-nowrap text-gray-500"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** 표 한 줄. 줄 사이 옅은 선, 마지막 줄은 선 없음. */
export const ROW_CLASS = 'border-b border-adm-line-soft last:border-0';

export interface TdProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}

export function Td({ children, className, colSpan, rowSpan }: TdProps) {
  return (
    <td colSpan={colSpan} rowSpan={rowSpan} className={cn('px-3.5 py-2.5 align-middle', className)}>
      {children}
    </td>
  );
}

/* ── 빈 화면 / 불러오는 중 / 오류 ─────────────────────────── */

export function EmptyState({ message }: { message: string }) {
  return <div className="txt-c1-regular px-6 py-16 text-center text-gray-500">{message}</div>;
}

export function LoadingState({ message = '불러오는 중…' }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 px-6 py-16"
    >
      <span
        aria-hidden="true"
        className="border-t-adm-brand size-5 animate-spin rounded-full border-2 border-gray-100 motion-reduce:animate-none"
      />
      <span className="txt-c1-regular text-gray-500">{message}</span>
    </div>
  );
}

export interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  /** 서버가 이유를 주지 않았을 때 보여줄 말 */
  fallback?: string;
}

export function ErrorState({ error, onRetry, fallback = '불러오지 못했습니다.' }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <p className="txt-c1-bold text-special-pink-600">{getApiErrorDetail(error) ?? fallback}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}

/** 폼 오류 한 줄. 뮤테이션 error 를 그대로 넘긴다. */
export function FormError({ error, fallback }: { error: unknown; fallback: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="txt-c1-bold text-special-pink-600">
      {getApiErrorDetail(error) ?? fallback}
    </p>
  );
}

/* ── 버튼 ────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'ghost';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-adm-brand text-white hover:bg-special-blue-700',
  ghost: 'border border-gray-100 bg-white text-gray-900 hover:bg-adm-line-soft',
};

export interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
}

/** 버튼처럼 보이는 링크. 가운데 클릭·주소 복사가 되도록 Link 로 둔다. */
export function LinkButton({ href, children, variant = 'primary' }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'txt-c1-bold inline-flex h-9 shrink-0 items-center rounded-[10px] px-3.5 whitespace-nowrap transition-colors duration-200',
        BUTTON_VARIANTS[variant],
        FOCUS,
      )}
    >
      {children}
    </Link>
  );
}

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  /** md = h-10(표·카드 안), lg = h-12(폼 제출) */
  size?: 'md' | 'lg';
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  /** 폼 제출 버튼을 가득 채울 때 */
  block?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled,
  block = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'txt-c1-bold inline-flex items-center justify-center rounded-[10px] transition-colors duration-200 disabled:cursor-not-allowed',
        size === 'md' ? 'h-10 px-4' : 'h-12 px-6',
        block && 'w-full',
        BUTTON_VARIANTS[variant],
        variant === 'primary' ? 'disabled:bg-gray-200' : 'disabled:opacity-50',
        FOCUS,
      )}
    >
      {children}
    </button>
  );
}

/* ── 폼 ──────────────────────────────────────────────────── */

/** 입력칸 공통 모양. <input>/<select> 에 그대로 붙인다. */
export const INPUT_CLASS =
  'txt-c1-regular rounded-[10px] h-12 w-full border border-gray-100 bg-gray-0 px-4 text-gray-900 outline-none placeholder:text-gray-400 focus:border-adm-brand';

export interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, htmlFor, children, hint }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="txt-c1-bold text-gray-900">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && <p className="txt-c2-regular mt-1.5 text-gray-500">{hint}</p>}
    </div>
  );
}

/* ── 사전 → 사후 변화 막대 ───────────────────────────────── */

export function DeltaBar({ pre, post }: { pre: number; post: number }) {
  const delta = post - pre;
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  return (
    <div className="flex items-center gap-3">
      <div
        role="img"
        aria-label={`사전 ${pre.toFixed(1)}, 사후 ${post.toFixed(1)}`}
        className="bg-adm-line-soft relative h-2 w-40 overflow-hidden rounded-full"
      >
        {/* 너비는 값에 따라 바뀌므로 style 로 준다. */}
        <div
          className="bg-special-blue-200 absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${clamp(pre)}%` }}
        />
        <div
          className="bg-adm-brand absolute inset-y-0 left-0 rounded-full opacity-90 mix-blend-multiply"
          style={{ width: `${clamp(post)}%` }}
        />
      </div>
      <span
        className={cn('txt-c2-bold tabular-nums', delta >= 0 ? 'text-green-700' : 'text-red-600')}
      >
        {delta >= 0 ? '+' : ''}
        {delta.toFixed(1)}
      </span>
    </div>
  );
}

/* ── 검색과 쪽 넘김 ──────────────────────────────────────── */

/** 한 쪽에 보여줄 줄 수. */
export const PER_PAGE = 20;

export interface SearchBoxProps {
  placeholder: string;
  /** 현재 검색어. 페이지에서 useSearchParams().get('q') 로 읽어 넘긴다. */
  value?: string;
  /** 스크린리더용 이름. 기본값 '검색어' */
  label?: string;
}

/** 검색 상자. 주소(?q=)로만 동작한다(next/form GET → 클라이언트 이동). */
export function SearchBox({ placeholder, value, label = '검색어' }: SearchBoxProps) {
  return (
    <Form action="" className="flex w-full gap-2 lg:max-w-[420px]">
      <input
        type="search"
        name="q"
        aria-label={label}
        // 주소가 바뀌면 칸도 따라 바뀌도록 key 로 다시 만든다.
        key={value ?? ''}
        defaultValue={value ?? ''}
        placeholder={placeholder}
        className="txt-c1-regular focus:border-adm-brand bg-gray-0 h-11 min-w-0 flex-1 rounded-[10px] border border-gray-100 px-4 text-gray-900 outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        className={cn(
          'txt-c1-bold bg-adm-brand hover:bg-special-blue-700 h-11 shrink-0 rounded-[10px] px-5 text-white transition-colors duration-200',
          FOCUS,
        )}
      >
        검색
      </button>
    </Form>
  );
}

/** 목록을 잘라 낸다. 쪽 번호는 1부터, 범위를 벗어나면 끝 쪽으로 맞춘다. */
export function paginate<T>(items: T[], page: number, perPage = PER_PAGE) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, Number.isFinite(page) ? page : 1), pages);
  const from = (current - 1) * perPage;
  return {
    rows: items.slice(from, from + perPage),
    page: current,
    pages,
    total: items.length,
    from: items.length === 0 ? 0 : from + 1,
    to: Math.min(from + perPage, items.length),
  };
}

export interface PaginationProps {
  page: number;
  pages: number;
  from: number;
  to: number;
  total: number;
  /** 검색어를 유지한 채 쪽을 넘긴다. */
  query?: string;
}

/** 쪽 넘김. 몇 번째부터 몇 번째까지인지 함께 적는다. `{...paginate(...)}` 결과를 그대로 넘기면 된다. */
export function Pagination({ page, pages, from, to, total, query }: PaginationProps) {
  if (total === 0) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (p > 1) params.set('page', String(p));
    const s = params.toString();
    return s ? `?${s}` : '?';
  };

  const numbers: number[] = [];
  for (let p = Math.max(1, page - 2); p <= Math.min(pages, page + 2); p++) numbers.push(p);

  return (
    <div className="border-adm-line-soft flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 lg:px-6">
      <p className="txt-c2-regular text-gray-500 tabular-nums">
        전체 {total.toLocaleString()}건 중 {from}–{to}
      </p>

      {pages > 1 && (
        <nav aria-label="쪽 넘김" className="flex items-center gap-1">
          <PageLink href={href(page - 1)} disabled={page === 1}>
            이전
          </PageLink>
          {numbers[0] > 1 && <Ellipsis />}
          {numbers.map((p) => (
            <PageLink key={p} href={href(p)} active={p === page}>
              {p}
            </PageLink>
          ))}
          {numbers[numbers.length - 1] < pages && <Ellipsis />}
          <PageLink href={href(page + 1)} disabled={page === pages}>
            다음
          </PageLink>
        </nav>
      )}
    </div>
  );
}

function Ellipsis() {
  return (
    <span aria-hidden="true" className="txt-c2-regular px-1 text-gray-400">
      …
    </span>
  );
}

function PageLink({
  href,
  children,
  active = false,
  disabled = false,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  const base =
    'txt-c1-bold rounded-[10px] flex h-9 min-w-9 items-center justify-center px-3 transition-colors duration-200';

  if (disabled) {
    return (
      <span aria-disabled="true" className={cn(base, 'cursor-not-allowed text-gray-400')}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        base,
        active ? 'bg-adm-brand text-white' : 'hover:bg-adm-line-soft text-gray-900',
        FOCUS,
      )}
    >
      {children}
    </Link>
  );
}
