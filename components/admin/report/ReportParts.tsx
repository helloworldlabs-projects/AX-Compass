import type { ReactNode } from 'react';

import type { ChapterInsight } from '@/lib/admin/insight';
import { pLabel, type TestResult } from '@/lib/admin/stats';
import { cn } from '@/lib/utils';

/**
 * 보고서를 이루는 조각들.
 *
 * 기존 사전검사 리포트와 같은 틀을 쓴다 — 번호, 제목, 한 줄 설명, 그리고
 * 내용. 기업 담당자가 이미 본 문서와 이어져 읽히려면 생김새가 같아야 한다.
 *
 * 머리·꼬리는 <header>/<footer> 가 아니라 <div> 다 — 호스트 인쇄 CSS 가 header/footer 를 감춘다.
 */

/**
 * 한 장(章)이 곧 한 쪽(頁)이다.
 *
 * 인쇄물로 나갈 문서라 화면에서도 A4 종이로 보이게 한다. 내용이 길면
 * 종이가 길어지고, 인쇄할 때 그 안에서 자연스럽게 나뉜다.
 */
export function Chapter({
  no,
  title,
  description,
  cont = false,
  children,
}: {
  no: string;
  title: string;
  description?: string;
  /** 앞 지면에서 이어지는 장인가. 번호와 제목을 다시 적어 "(계속)"을 붙인다. */
  cont?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="report-sheet">
      <div className="sheet-head">
        <span className="txt-c2-bold tracking-wide text-gray-900">AX Compass</span>
      </div>

      <div className="flex-1 pt-7">
        <div className={cont ? 'pb-2.5' : 'pb-3.5'}>
          <p className="txt-c2-bold text-special-pink-600 tracking-wide">{no}</p>
          <h2 className="txt-t3 mt-1 text-gray-900">
            {title}
            {cont && <span className="txt-c1-regular ml-2 text-gray-500">(계속)</span>}
          </h2>
          {description && <p className="txt-c1-regular mt-2 text-gray-700">{description}</p>}
        </div>
        <div className="space-y-4">{children}</div>
      </div>

      <div className="sheet-foot">
        <span className="txt-c2-regular text-gray-500">Copyright 2026. HelloworldLabs Inc.</span>
        {/* 쪽 번호는 CSS 로 센다. 장을 더하거나 빼도 손댈 곳이 없다. */}
        <span className="txt-c2-bold sheet-page-no text-gray-500 tabular-nums" />
      </div>
    </section>
  );
}

/**
 * 표지.
 *
 * 배경은 디자인 자산을 그대로 깐다. 파일이 없으면 남색 바탕만 깔리고 글자는
 * 그대로 읽힌다 — 이미지 하나 때문에 보고서가 열리지 않으면 안 된다.
 * 세로 자리는 mm 로 잡는다(% 여백은 너비 기준이라 글자가 위로 쏠린다).
 */
export function CoverSheet({
  org,
  title,
  date,
  background = '/admin/report/cover.webp',
}: {
  org: string;
  /** 표지 제목. 줄 단위로 넘긴다. */
  title: string[];
  /** 2026.05.22 처럼 점으로 끊는다. */
  date: string;
  background?: string;
}) {
  return (
    <section className="report-sheet bg-special-blue-900 relative overflow-hidden !p-0 text-white">
      {/* 인쇄 지면용 배경이라 next/image 최적화가 필요 없다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={background}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative flex h-full flex-col items-center px-[20mm] text-center">
        {/* 표지가 남색이라 흰색으로 칠한 로고를 쓴다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/admin/report/logo-white.svg"
          alt="AX Compass"
          className="mt-[62mm] h-auto w-[66mm]"
        />

        <Rule className="mt-[26mm]" />

        <h1 className="txt-h2 mt-[14mm] text-white">
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="txt-st-bold mt-[10mm] text-purple-200">{org}</p>

        <Rule className="mt-[14mm]" />

        <p className="txt-c1-regular mt-[62mm] tracking-wide text-white/65">{date}</p>
      </div>
    </section>
  );
}

/** 가운데 마름모가 박힌 가는 선. 기존 표지의 구분선이다. */
function Rule({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)} aria-hidden="true">
      <span className="h-px w-[26mm] bg-gradient-to-r from-transparent to-white/30" />
      <span className="h-1 w-1 rotate-45 bg-white/50" />
      <span className="h-px w-[26mm] bg-gradient-to-l from-transparent to-white/30" />
    </span>
  );
}

/** 카드 하나. 인쇄할 때 쪽 경계에서 잘리지 않는다. */
export function Block({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="report-block rounded-[16px] border border-gray-100 bg-white px-6 py-4">
      {title && <h3 className="txt-st2-bold text-gray-900">{title}</h3>}
      {description && <p className="txt-c1-regular mt-1 text-gray-500">{description}</p>}
      <div className={title || description ? 'mt-3.5' : ''}>{children}</div>
    </div>
  );
}

/** 큰 숫자 하나. 사전 → 사후 → 변화처럼 나란히 둔다. */
export function Figure({
  label,
  value,
  unit,
  sub,
  tone = 'default',
  size = 'lg',
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  tone?: 'default' | 'up' | 'down';
  /** 요지인 수는 크게(lg), 곁들이는 사실은 한 단계 낮춘다(sm). */
  size?: 'lg' | 'sm';
}) {
  const color =
    tone === 'up' ? 'text-green-700' : tone === 'down' ? 'text-special-pink-600' : 'text-gray-900';
  return (
    <div className="report-block bg-gray-0 rounded-[16px] px-4 py-3">
      <p className="txt-c2-bold text-gray-500">{label}</p>
      <p className={cn(size === 'sm' ? 'txt-st2-bold' : 'txt-t3', 'mt-1.5 tabular-nums', color)}>
        {value}
        {unit && <span className="txt-c1-bold ml-1">{unit}</span>}
      </p>
      {sub && <p className="txt-c2-regular mt-1 text-gray-500">{sub}</p>}
    </div>
  );
}

/** +3.2 / −1.6 처럼 부호를 붙여 읽기 쉽게. */
export function delta(v: number | null, unit = ''): string {
  if (v === null) return '—';
  const rounded = Math.round(v * 10) / 10;
  if (rounded > 0) return `+${rounded}${unit}`;
  return `${rounded}${unit}`;
}

export function deltaTone(v: number | null): 'default' | 'up' | 'down' {
  if (v === null || v === 0) return 'default';
  return v > 0 ? 'up' : 'down';
}

/**
 * 검정 결과 한 줄.
 *
 * p 값만 두면 "몇 명을 모았는가"를 "얼마나 달라졌는가"로 착각한다.
 * 효과 크기와 인원을 함께 적고, 쓸 수 없는 경우에는 왜인지를 적는다.
 */
export function TestLine({
  label,
  result,
  extra,
}: {
  label: string;
  result: TestResult;
  /** t=…, d=… 처럼 검정마다 다른 수치. */
  extra?: string;
}) {
  return (
    <div className="report-block bg-gray-0 rounded-[16px] px-4 py-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="txt-c1-bold text-gray-900">{label}</span>
        {result.usable ? (
          <>
            <span className="txt-c1-bold text-gray-900 tabular-nums">{pLabel(result.p)}</span>
            <span
              className={cn(
                'txt-c2-bold rounded-full px-2 py-0.5',
                result.significant
                  ? 'bg-green-0 text-green-700'
                  : 'bg-adm-track-fill text-gray-500',
              )}
            >
              {result.significant ? '통계적으로 유의' : '유의하지 않음'}
            </span>
            {extra && <span className="txt-c2-regular text-gray-500 tabular-nums">{extra}</span>}
          </>
        ) : (
          <span className="txt-c1-regular text-gray-500">계산하지 않음</span>
        )}
      </div>
      {result.note && <p className="txt-c2-regular mt-2 text-gray-500">· {result.note}</p>}
    </div>
  );
}

/** 분석 절의 도입 설명. 무엇을 왜 어떤 방법으로 봤는지를 먼저 한두 문단으로 적는다. */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <div className="report-block max-w-[860px] space-y-2">
      {Array.isArray(children) ? (
        // 조건에 따라 빠지는 문장이 있다. 거짓값을 그대로 그리면 빈 문단이 자리를 차지한다.
        children.filter(Boolean).map((line, i) => (
          <p key={i} className="txt-c1-regular text-gray-700">
            {line}
          </p>
        ))
      ) : (
        <p className="txt-c1-regular text-gray-700">{children}</p>
      )}
    </div>
  );
}

/** 표 위에 붙는 제목. 기존 리포트의 [ … ] 표기를 따른다. */
export function TableCaption({ children }: { children: ReactNode }) {
  return <p className="txt-c1-bold mb-3 text-center text-gray-900">[ {children} ]</p>;
}

/** 표 아래 각주. 유의 표시 기준 같은 것. */
export function TableNote({ children }: { children: ReactNode }) {
  return <p className="txt-c2-regular mt-2.5 text-right text-gray-500">{children}</p>;
}

/** 절 끝의 해설. 문장은 전부 보고서 안의 수치에서 나온다(lib/admin/insight). */
export function Insight({ insight }: { insight: ChapterInsight }) {
  if (insight.paragraphs.length === 0) return null;
  return (
    <div className="report-block max-w-[860px] space-y-2.5">
      {insight.paragraphs.map((text, i) => (
        <p key={i} className="txt-c1-regular text-gray-700">
          {text}
        </p>
      ))}
    </div>
  );
}

/** 읽는 사람이 오해하지 않도록 붙이는 주의 문구. */
export function Caveat({ children }: { children: ReactNode }) {
  return (
    <div className="report-block border-special-pink-200 bg-special-pink-0 rounded-[16px] border px-6 py-4">
      <p className="txt-c1-regular text-gray-500">{children}</p>
    </div>
  );
}
