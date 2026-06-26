import type { AxCorrelationMatrixItem } from '../../types/ax-report';

const TAG_CODES = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
] as const;

type TagCode = (typeof TAG_CODES)[number];

const COMPETENCY_GROUPS: { label: string; codes: TagCode[] }[] = [
  { label: '이해', codes: ['a', 'b', 'c'] },
  { label: '활용', codes: ['d', 'e', 'f'] },
  { label: '평가·개선', codes: ['g', 'h', 'i'] },
  { label: '책임·거버넌스', codes: ['j', 'k', 'l'] },
];

const CELL_PX = 20;
const GAP_PX = 2;
const GROUP_HEIGHT_PX = CELL_PX * 3 + GAP_PX * 2;

const GROUP_LABEL_W = 52;
const ROW_CODE_W = 16;

function getCellBgClass(value: number | undefined): string {
  if (value === undefined || value < 0.5) return 'bg-special-dark-blue-0';
  if (value < 0.6) return 'bg-special-dark-blue-100';
  if (value < 0.7) return 'bg-special-dark-blue-200';
  if (value < 0.8) return 'bg-special-dark-blue-300';
  if (value < 0.9) return 'bg-special-dark-blue-400';
  return 'bg-special-dark-blue-500';
}

function isSameGroup(code1: TagCode, code2: TagCode): boolean {
  return COMPETENCY_GROUPS.some(
    (g) => g.codes.includes(code1) && g.codes.includes(code2),
  );
}

function buildCorrelationMap(
  matrix: AxCorrelationMatrixItem[],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const code of TAG_CODES) {
    map.set(`${code}-${code}`, 1.0);
  }
  for (const c of matrix) {
    const code1 = c.tagCode1.toLowerCase();
    const code2 = c.tagCode2.toLowerCase();
    map.set(`${code1}-${code2}`, c.correlationCoefficient);
    map.set(`${code2}-${code1}`, c.correlationCoefficient);
  }
  return map;
}

interface AxCorrelationHeatmapProps {
  correlationMatrix: AxCorrelationMatrixItem[];
}

export function AxCorrelationHeatmap({
  correlationMatrix,
}: AxCorrelationHeatmapProps) {
  const map = buildCorrelationMap(correlationMatrix);

  return (
    <div className="flex">
      {/* Left labels */}
      <div className="flex flex-col" style={{ gap: GAP_PX }}>
        <div style={{ height: CELL_PX }} />
        {COMPETENCY_GROUPS.map((group) => (
          <div
            key={group.label}
            className="flex"
            style={{ height: GROUP_HEIGHT_PX, gap: GAP_PX }}
          >
            <div
              className="flex shrink-0 items-center justify-end text-gray-600"
              style={{ width: GROUP_LABEL_W, fontSize: 8, fontWeight: 700 }}
            >
              {group.label}
            </div>
            <div className="flex flex-col" style={{ gap: GAP_PX }}>
              {group.codes.map((code) => (
                <div
                  key={code}
                  className="flex items-center justify-center text-gray-600"
                  style={{
                    width: ROW_CODE_W,
                    height: CELL_PX,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {code.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap matrix */}
      <div className="flex flex-col" style={{ gap: GAP_PX }}>
        {/* Column headers */}
        <div className="flex" style={{ gap: GAP_PX }}>
          {TAG_CODES.map((code) => (
            <div
              key={code}
              className="flex items-center justify-center text-gray-600"
              style={{
                width: CELL_PX,
                height: CELL_PX,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {code.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Rows */}
        {TAG_CODES.map((rowCode) => (
          <div key={rowCode} className="flex" style={{ gap: GAP_PX }}>
            {TAG_CODES.map((colCode) => {
              const value = map.get(`${rowCode}-${colCode}`);
              const showLabel =
                value !== undefined && value >= 0.6 && isSameGroup(rowCode, colCode);
              return (
                <div
                  key={colCode}
                  className={`${getCellBgClass(value)} flex items-center justify-center rounded-[4px]`}
                  style={{ width: CELL_PX, height: CELL_PX }}
                >
                  {showLabel && (
                    <span
                      className="font-bold text-white"
                      style={{ fontSize: 8 }}
                    >
                      {value!.toFixed(2)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
