import { cn } from '@/lib/utils';

/**
 * 보고서 그래프.
 *
 * 차트 라이브러리를 쓰지 않는다. 필요한 것은 몇 가지뿐이고 전부 SVG 로
 * 그릴 수 있다. 캔버스 차트는 인쇄에서 빈칸이나 뭉개진 그림으로 나오지만
 * SVG 는 벡터라 A4 에 또렷하게 찍힌다.
 *
 * 색은 사전을 회색, 사후를 파랑으로 고정한다. 보고서 전체에서 같은 뜻을
 * 같은 색으로 써야 표와 그래프를 오가며 읽을 수 있다.
 *
 * 색은 테마 변수로 주되 값도 함께 적는다 — Tailwind 는 유틸리티로 쓰이지 않은
 * 테마 변수를 내보내지 않을 수 있어, 변수만 두면 인라인 style 에서 색이 빠진다.
 */
const PRE = 'var(--color-gray-400, #898989)';
const POST = 'var(--color-special-blue-500, #2e75cc)';
const GRID = 'var(--color-gray-100, #e1e1e1)';
const LABEL = 'var(--color-gray-500, #6b6b6b)';
const UP = 'var(--color-green-700, #02784d)';
const DOWN = 'var(--color-special-pink-600, #e60063)';

export function Legend({
  items,
  direction = 'row',
}: {
  items: { color: string; label: string }[];
  /** 그림 아래에 둘 때는 가로(row), 옆에 붙일 때는 세로(column). */
  direction?: 'row' | 'column';
}) {
  return (
    <div
      className={
        direction === 'column'
          ? 'flex shrink-0 flex-col gap-2'
          : 'mt-3 flex flex-wrap items-center gap-4'
      }
    >
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ background: i.color }}
            aria-hidden="true"
          />
          <span className="txt-c2-regular text-gray-500">{i.label}</span>
        </span>
      ))}
    </div>
  );
}

/* ── 레이더 ──────────────────────────────────────────────── */

/** 축이 적고 성격이 같은 값에 쓴다. 모양이 한쪽으로 찌그러졌는지를 한눈에 본다. */
export function Radar({
  axes,
  max = 100,
  size = 320,
  maxWidth = 360,
}: {
  axes: { label: string; pre: number | null; post: number | null }[];
  max?: number;
  size?: number;
  /** 화면에 그려지는 최대 너비(px). viewBox 는 그대로라 모양은 달라지지 않는다. */
  maxWidth?: number;
}) {
  const n = axes.length;
  if (n < 3) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 46;

  const point = (i: number, value: number) => {
    // 12시 방향에서 시작해 시계 방향으로 돈다.
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = (Math.max(0, Math.min(value, max)) / max) * r;
    return [cx + Math.cos(angle) * d, cy + Math.sin(angle) * d] as const;
  };

  const polygon = (pick: 'pre' | 'post') => {
    const values = axes.map((a) => a[pick]);
    if (values.some((v) => v === null)) return null;
    return values.map((v, i) => point(i, v!).join(',')).join(' ');
  };

  const prePath = polygon('pre');
  const postPath = polygon('post');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full"
      style={{ maxWidth: `${maxWidth}px` }}
      role="img"
      aria-label="사전과 사후 비교"
    >
      {/* 눈금 — 25 / 50 / 75 / 100 */}
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          key={ratio}
          points={axes.map((_, i) => point(i, max * ratio).join(',')).join(' ')}
          fill="none"
          stroke={GRID}
          strokeWidth={1}
        />
      ))}

      {axes.map((a, i) => {
        const [x, y] = point(i, max);
        return <line key={a.label} x1={cx} y1={cy} x2={x} y2={y} stroke={GRID} />;
      })}

      {/* 색만으로 가르지 않는다. 사전은 점선에 옅은 면, 사후는 실선에 굵은 선 — 흑백으로 뽑아도 갈린다. */}
      {prePath && (
        <polygon
          points={prePath}
          fill={PRE}
          fillOpacity={0.12}
          stroke={PRE}
          strokeWidth={1.5}
          strokeDasharray="5 3"
        />
      )}
      {postPath && (
        <polygon points={postPath} fill={POST} fillOpacity={0.2} stroke={POST} strokeWidth={2.5} />
      )}

      {axes.map((a, i) => {
        const [x, y] = point(i, max * 1.2);
        return (
          <text
            key={a.label}
            x={x}
            y={y}
            textAnchor={x > cx + 4 ? 'start' : x < cx - 4 ? 'end' : 'middle'}
            dominantBaseline={y > cy ? 'hanging' : y < cy ? 'auto' : 'middle'}
            fontSize={11}
            fill={LABEL}
            fontWeight={600}
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

/** 값 하나짜리 레이더. 한 시점의 모양 자체가 뜻을 가질 때 사전·사후를 나란히 놓는다. */
export function SingleRadar({
  axes,
  max = 40,
  size = 260,
  caption,
}: {
  axes: { label: string; value: number }[];
  max?: number;
  size?: number;
  caption?: string;
}) {
  const n = axes.length;
  if (n < 3) return null;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;

  const point = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = (Math.max(0, Math.min(value, max)) / max) * r;
    return [cx + Math.cos(angle) * d, cy + Math.sin(angle) * d] as const;
  };

  return (
    <figure className="m-0 flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full max-w-[260px]"
        role="img"
        aria-label={caption ?? '분포'}
      >
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <polygon
            key={ratio}
            points={axes.map((_, i) => point(i, max * ratio).join(',')).join(' ')}
            fill="none"
            stroke={GRID}
          />
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, max);
          return <line key={a.label} x1={cx} y1={cy} x2={x} y2={y} stroke={GRID} />;
        })}
        <polygon
          points={axes.map((a, i) => point(i, a.value).join(',')).join(' ')}
          fill={POST}
          fillOpacity={0.22}
          stroke={POST}
          strokeWidth={2}
        />
        {axes.map((a, i) => {
          const [x, y] = point(i, max * 1.24);
          return (
            <text
              key={a.label}
              x={x}
              y={y}
              textAnchor={x > cx + 4 ? 'start' : x < cx - 4 ? 'end' : 'middle'}
              dominantBaseline={y > cy ? 'hanging' : y < cy ? 'auto' : 'middle'}
              fontSize={10}
              fill={LABEL}
              fontWeight={600}
            >
              {a.label}
            </text>
          );
        })}
      </svg>
      {caption && <figcaption className="txt-c2-bold mt-1 text-gray-500">{caption}</figcaption>}
    </figure>
  );
}

/* ── 표 안의 막대 ────────────────────────────────────────── */

/** 표 한 칸에 들어가는 작은 막대 두 줄. 숫자는 정확히 읽고 크기는 눈으로 짚는다. */
export function InlineBars({
  pre,
  post,
  max = 100,
}: {
  pre: number | null;
  post: number | null;
  max?: number;
}) {
  const bar = (value: number | null, color: string) => (
    <span className="block h-1 rounded-full" style={{ background: GRID }}>
      <span
        className="block h-1 rounded-full"
        style={{
          width: `${Math.max(0, Math.min((value ?? 0) / max, 1)) * 100}%`,
          background: color,
        }}
      />
    </span>
  );

  return (
    <span className="block w-full space-y-0.5">
      {bar(pre, PRE)}
      {bar(post, POST)}
    </span>
  );
}

/* ── 증감 막대 ───────────────────────────────────────────── */

/**
 * 0 을 기준으로 좌우로 뻗는다. 부호가 뜻을 가진 값에 쓴다.
 *
 * **0 선은 한가운데에 둔다.** 값에 따라 옮기면 오른 쪽과 내린 쪽의 폭이 달라져,
 * 어느 쪽이 큰지 눈으로 가늠할 기준이 사라진다. 한가운데에 두면 좌우가 거울처럼
 * 맞아 부호가 먼저 읽힌다.
 *
 * 좌우 눈금은 같다 — 절댓값이 가장 큰 값이 절반을 꽉 채우고, 나머지는 그에 견준다.
 */
export function DivergingBars({
  rows,
  unit = '',
}: {
  rows: { label: string; value: number | null }[];
  unit?: string;
}) {
  const values = rows.map((r) => r.value ?? 0);
  /** 한쪽이 쓸 수 있는 폭은 절반이다. 그 안에서 가장 큰 값이 꽉 찬다. */
  const widest = Math.max(1, ...values.map(Math.abs));
  const ZERO = 50;

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const v = row.value ?? 0;
        const width = (Math.abs(v) / widest) * ZERO;
        return (
          <div key={row.label} className="flex items-center gap-3">
            <span className="txt-c2-regular w-[72px] shrink-0 text-right text-gray-500">
              {row.label}
            </span>
            <span className="relative block h-4 flex-1">
              {/*
                0 선. 줄 사이 틈(space-y-2 = 8px)까지 위아래로 4px 씩 넘겨,
                칸마다 끊기지 않고 한 줄로 이어 보이게 한다.
              */}
              <span
                className="absolute -inset-y-1 w-px"
                style={{ background: GRID, left: `${ZERO}%` }}
                aria-hidden="true"
              />
              {row.value !== null && (
                <span
                  className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-sm"
                  style={{
                    background: v >= 0 ? UP : DOWN,
                    width: `${width}%`,
                    left: v >= 0 ? `${ZERO}%` : `${ZERO - width}%`,
                  }}
                />
              )}
            </span>
            <span
              className={cn(
                'txt-c2-bold w-[72px] shrink-0 tabular-nums',
                row.value === null || v === 0
                  ? 'text-gray-500'
                  : v > 0
                    ? 'text-green-700'
                    : 'text-special-pink-600',
              )}
            >
              {row.value === null ? '—' : `${v > 0 ? '+' : ''}${v}${unit}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── 사분면 ──────────────────────────────────────────────── */

/** 현재 수준(가로) × 목표 수준(세로). "낮은데 목표는 높다"에 들어가는 관점이 투자 우선순위다. */
export function Quadrant({
  points,
  size = 360,
  max = 100,
}: {
  points: { label: string; x: number | null; y: number | null }[];
  size?: number;
  max?: number;
}) {
  const pad = 34;
  const inner = size - pad * 2;
  const at = (v: number) => pad + (Math.max(0, Math.min(v, max)) / max) * inner;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full max-w-[400px]"
      role="img"
      aria-label="현재 수준과 목표 수준"
    >
      <rect x={pad} y={pad} width={inner} height={inner} fill="none" stroke={GRID} />
      <line x1={at(50)} y1={pad} x2={at(50)} y2={pad + inner} stroke={GRID} strokeDasharray="3 3" />
      <line x1={pad} y1={at(50)} x2={pad + inner} y2={at(50)} stroke={GRID} strokeDasharray="3 3" />

      <text x={pad + 6} y={pad + 14} fontSize={9} fill={LABEL}>
        집중 개선
      </text>
      <text x={pad + inner - 6} y={pad + 14} fontSize={9} fill={LABEL} textAnchor="end">
        점진 개선
      </text>
      <text x={pad + 6} y={pad + inner - 6} fontSize={9} fill={LABEL}>
        모니터링
      </text>
      <text x={pad + inner - 6} y={pad + inner - 6} fontSize={9} fill={LABEL} textAnchor="end">
        유지 강화
      </text>

      {/* 점 옆에 이름을 적으면 겹친다. 번호만 찍고 이름은 아래 범례에 둔다. */}
      {points.map((p, i) => {
        if (p.x === null || p.y === null) return null;
        // 세로축은 위로 갈수록 크다. SVG 는 아래로 갈수록 크므로 뒤집는다.
        const cx = at(p.x);
        const cy = pad + inner - (at(p.y) - pad);
        return (
          <g key={p.label}>
            <circle cx={cx} cy={cy} r={11} fill={POST} />
            <text
              x={cx}
              y={cy}
              fontSize={11}
              fill="#fff"
              textAnchor="middle"
              dominantBaseline="central"
              fontWeight={700}
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      <text x={pad + inner / 2} y={size - 8} fontSize={10} fill={LABEL} textAnchor="middle">
        현재 수준 →
      </text>
      <text
        x={12}
        y={pad + inner / 2}
        fontSize={10}
        fill={LABEL}
        textAnchor="middle"
        transform={`rotate(-90 12 ${pad + inner / 2})`}
      >
        목표 수준 →
      </text>
    </svg>
  );
}

/* ── 분포 띠 ─────────────────────────────────────────────── */

/** 100% 를 채우는 한 줄. 합이 전체인 값에 쓴다. 사전과 사후를 위아래로 놓는다. */
export function StackedShare({
  rows,
  segments,
}: {
  rows: { label: string; values: number[] }[];
  segments: { label: string; color: string }[];
}) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <p className="txt-c2-bold mb-1 text-gray-500">{row.label}</p>
          {/* 칸 사이에 흰 실선을 둔다. 비슷한 두 칸이 맞붙어도 경계가 보이게. */}
          <div className="bg-adm-track-fill flex h-6 overflow-hidden rounded-[10px]">
            {row.values.map((v, i) => (
              <div
                key={segments[i]?.label ?? i}
                style={{
                  width: `${v}%`,
                  background: segments[i]?.color,
                  boxShadow: v > 0 && i > 0 ? 'inset 1px 0 0 0 #fff' : undefined,
                }}
                title={`${segments[i]?.label} ${v}%`}
              />
            ))}
          </div>
        </div>
      ))}
      <Legend items={segments} />
    </div>
  );
}

/** 사분면 + 번호 범례. 점이 겹쳐도 어느 관점인지 아래에서 찾을 수 있다. */
export function QuadrantWithLegend({
  points,
}: {
  points: { label: string; x: number | null; y: number | null }[];
}) {
  return (
    <div className="flex flex-col items-center">
      <Quadrant points={points} />
      <ol className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
        {points.map((p, i) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <span
              className="txt-c2-bold flex h-4 w-4 items-center justify-center rounded-full text-white"
              style={{ background: POST }}
            >
              {i + 1}
            </span>
            <span className="txt-c2-regular text-gray-500">{p.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 프로필 유형처럼 칸이 여럿일 때 쓰는 색. 여섯 가지까지 구분된다. */
export const SEGMENT_COLORS = [
  'var(--color-adm-brand, #001c51)',
  'var(--color-purple-400, #a771ff)',
  'var(--color-adm-point, #02c1a5)',
  'var(--color-special-pink-400, #ff7b9a)',
  'var(--color-gray-400, #898989)',
  'var(--color-purple-700, #533699)',
];

export const CHART_COLORS = { PRE, POST, UP, DOWN };
