'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Level } from '@/constants/levelConfig';
import { Search, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CurriculumTreeChartProps {
  roadmapType?: string;
  activeNodes: string[];
  activeEdges: Array<{ from: string; to: string }>;
}

interface TreeNode {
  id: string;
  label: string;
  level: Level;
  durationHour: number;
  x: number;
  y: number;
}

interface TreeEdge {
  from: string;
  to: string;
  branchLabel?: string;
}

interface TreeLayout {
  width: number;
  height: number;
  nodes: TreeNode[];
  edges: TreeEdge[];
}

const LEGACY_ID_MAP: Record<string, string> = {
  ELEMENTARY_COST_DOWN_1: 'ELEMENTARY_COST_DOWN',
  INTERMEDIATE_N8N_NEW_BIZ_1: 'INTERMEDIATE_NEW_BIZ_1',
  INTERMEDIATE_COPILOT_NEW_BIZ_1: 'INTERMEDIATE_NEW_BIZ_2',
  INTERMEDIATE_CLAUDE_NEW_BIZ_1: 'INTERMEDIATE_NEW_BIZ_3',
  INTERMEDIATE_ORG_1: 'INTERMEDIATE_BUILD_COMMUNITY_1',
  INTERMEDIATE_N8N_COST_DOWN_1: 'INTERMEDIATE_COST_DOWN_1',
  INTERMEDIATE_COPILOT_COST_DOWN_1: 'INTERMEDIATE_COST_DOWN_2',
  INTERMEDIATE_CLAUDE_COST_DOWN_1: 'INTERMEDIATE_COST_DOWN_3',
  ADVANCED_FINAL_1: 'ADVANCED_COMMON_1',
};

// ─── Layout constants ─────────────────────────────────────────────────────────
// node size: 300 x 85
// overall x: 0, 400, 800, 1200  (container left padding = 50)
// overall y: beginner/advanced=445, elementary=340/550, intermediate=25~865(step 140)

const NODE_WIDTH = 300;
const NODE_HEIGHT = 85;
const BADGE_OFFSET = 30; // 24px height + 6px margin-bottom
const EDGE_ANCHOR_Y_OFFSET = BADGE_OFFSET + NODE_HEIGHT / 2;

// ─── Node style constants ─────────────────────────────────────────────────────

const levelBadgeStyleMap: Record<Level, string> = {
  입문: 'bg-special-orange-500 text-white',
  초급: 'bg-special-orange-600 text-white',
  중급: 'bg-special-orange-700 text-white',
  고급: 'bg-special-orange-800 text-white',
};

// ─── Hardcoded layout data ────────────────────────────────────────────────────

const OVERALL_NODES: TreeNode[] = [
  {
    id: 'BEGINNER_COMMON_1',
    label: '[사전 진단 및 목표 수립] AX 성숙도 역량 진단 및 데이터 기반 AX 조직 목표 수립',
    level: '입문',
    durationHour: 8,
    x: 0,
    y: 445,
  },
  {
    id: 'ELEMENTARY_NEW_BIZ_1',
    label: '[맞춤 처방: 신사업] AI 리터러시 향상 및 신규 비즈니스 기획 창출',
    level: '초급',
    durationHour: 16,
    x: 400,
    y: 340,
  },
  {
    id: 'ELEMENTARY_COST_DOWN',
    label: '[맞춤 처방: 비용절감] AI 리터러시 향상 및 워크플로우 세분화 실무',
    level: '초급',
    durationHour: 16,
    x: 400,
    y: 550,
  },
  {
    id: 'INTERMEDIATE_NEW_BIZ_1',
    label: '[역량 강화: N8N] 지능형 업무 워크플로우 설계 및 자동화 시스템 구축',
    level: '중급',
    durationHour: 24,
    x: 800,
    y: 25,
  },
  {
    id: 'INTERMEDIATE_NEW_BIZ_2',
    label: '[역량 강화: Copilot] 비즈니스 인텔리전스 및 전략 기획 자동화 시스템 구축',
    level: '중급',
    durationHour: 24,
    x: 800,
    y: 165,
  },
  {
    id: 'INTERMEDIATE_NEW_BIZ_3',
    label: '[역량 강화: Claude] 고난도 추론 기반 비즈니스 시뮬레이션 및 인터랙티브 솔루션 구현',
    level: '중급',
    durationHour: 24,
    x: 800,
    y: 305,
  },
  {
    id: 'INTERMEDIATE_BUILD_COMMUNITY_1',
    label: '[조직 역량 강화] Human-AI 협업 인터페이스 및 조직 프로세스 최적화',
    level: '중급',
    durationHour: 24,
    x: 800,
    y: 445,
  },
  {
    id: 'INTERMEDIATE_COST_DOWN_1',
    label: '[역량 강화: N8N] 에이전틱 워크플로우를 활용한 전사적 비용 절감 솔루션 구축',
    level: '중급',
    durationHour: 24,
    x: 800,
    y: 585,
  },
  {
    id: 'INTERMEDIATE_COST_DOWN_2',
    label: '[역량 강화: Copilot] 스마트 오피스 환경 및 커뮤니케이션 자동화 에이전트 구축',
    level: '중급',
    durationHour: 24,
    x: 800,
    y: 725,
  },
  {
    id: 'INTERMEDIATE_COST_DOWN_3',
    label: '[역량 강화: Claude] 기업 지식 자산화 및 지능형 업무 서포트 시스템 구현',
    level: '중급',
    durationHour: 24,
    x: 800,
    y: 865,
  },
  {
    id: 'ADVANCED_COMMON_1',
    label: '[사후 진단 및 최적화] AI 관리 체계 최적화 및 비즈니스 가치 극대화 실무',
    level: '고급',
    durationHour: 8,
    x: 1200,
    y: 445,
  },
];

const OVERALL_EDGES: TreeEdge[] = [
  { from: 'BEGINNER_COMMON_1', to: 'ELEMENTARY_NEW_BIZ_1' },
  { from: 'BEGINNER_COMMON_1', to: 'ELEMENTARY_COST_DOWN' },
  {
    from: 'ELEMENTARY_NEW_BIZ_1',
    to: 'INTERMEDIATE_NEW_BIZ_1',
    branchLabel: '[AX 컨설팅 및 분기 추천]',
  },
  { from: 'ELEMENTARY_NEW_BIZ_1', to: 'INTERMEDIATE_NEW_BIZ_2' },
  { from: 'ELEMENTARY_NEW_BIZ_1', to: 'INTERMEDIATE_NEW_BIZ_3' },
  { from: 'ELEMENTARY_NEW_BIZ_1', to: 'INTERMEDIATE_BUILD_COMMUNITY_1' },
  {
    from: 'ELEMENTARY_COST_DOWN',
    to: 'INTERMEDIATE_BUILD_COMMUNITY_1',
    branchLabel: '[AX 컨설팅 및 분기 추천]',
  },
  { from: 'ELEMENTARY_COST_DOWN', to: 'INTERMEDIATE_COST_DOWN_1' },
  { from: 'ELEMENTARY_COST_DOWN', to: 'INTERMEDIATE_COST_DOWN_2' },
  { from: 'ELEMENTARY_COST_DOWN', to: 'INTERMEDIATE_COST_DOWN_3' },
  { from: 'INTERMEDIATE_NEW_BIZ_1', to: 'ADVANCED_COMMON_1' },
  { from: 'INTERMEDIATE_NEW_BIZ_2', to: 'ADVANCED_COMMON_1' },
  { from: 'INTERMEDIATE_NEW_BIZ_3', to: 'ADVANCED_COMMON_1' },
  { from: 'INTERMEDIATE_BUILD_COMMUNITY_1', to: 'ADVANCED_COMMON_1' },
  { from: 'INTERMEDIATE_COST_DOWN_1', to: 'ADVANCED_COMMON_1' },
  { from: 'INTERMEDIATE_COST_DOWN_2', to: 'ADVANCED_COMMON_1' },
  { from: 'INTERMEDIATE_COST_DOWN_3', to: 'ADVANCED_COMMON_1' },
];

const OVERALL_LAYOUT: TreeLayout = {
  width: 1500,
  height: 1000,
  nodes: OVERALL_NODES,
  edges: OVERALL_EDGES,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function edgePath(fromNode: TreeNode, toNode: TreeNode): string {
  const x1 = fromNode.x + NODE_WIDTH;
  const y1 = fromNode.y + EDGE_ANCHOR_Y_OFFSET;
  const x2 = toNode.x;
  const y2 = toNode.y + EDGE_ANCHOR_Y_OFFSET;
  const cp = (x2 - x1) * 0.45;
  // Stop the line 8px before the target box so it penetrates the 10px-long triangle just enough (2px)
  // to avoid poking out of its tip, while aligning perfectly.
  const pathEndX = x2 - 8;
  return `M${x1},${y1} C${x1 + cp},${y1} ${x2 - cp},${y2} ${pathEndX},${y2}`;
}

function isEdgeActive(edge: TreeEdge, activeEdges: Array<{ from: string; to: string }>): boolean {
  return activeEdges.some((e) => e.from === edge.from && e.to === edge.to);
}

function normalizeNodeId(id: string): string {
  return LEGACY_ID_MAP[id] ?? id;
}

function normalizeEdges(
  edges: Array<{ from: string; to: string }>,
): Array<{ from: string; to: string }> {
  return edges.map((edge) => ({
    from: normalizeNodeId(edge.from),
    to: normalizeNodeId(edge.to),
  }));
}

// ─── NodeBox ──────────────────────────────────────────────────────────────────

function NodeBox({ node, active }: { node: TreeNode; active: boolean }) {
  return (
    <div
      className="absolute"
      style={{
        left: node.x,
        top: node.y,
      }}
    >
      <div className="mb-1.5 flex h-[24px] items-center gap-1">
        <span
          className={`txt-c2-bold rounded-[12px] px-1.5 py-0.5 ${levelBadgeStyleMap[node.level]}`}
        >
          {node.level}
        </span>
        <span className="bg-special-navy-400 txt-c2-bold rounded-[12px] px-1.5 py-0.5 text-white">
          {node.durationHour}시간
        </span>
      </div>
      <div
        className={`border-special-dark-blue-100 flex h-[85px] w-[300px] items-center justify-center rounded-[6px] border-3 p-2.5 ${
          active ? 'bg-special-dark-blue-500 text-white' : 'bg-special-dark-blue-200 text-black'
        }`}
      >
        <p className="txt-b-bold text-center">{node.label}</p>
      </div>
    </div>
  );
}

// ─── ChartCanvas ──────────────────────────────────────────────────────────────

function ChartCanvas({
  layout,
  nodeMap,
  normalizedActiveNodes,
  normalizedActiveEdges,
  stageScale,
  idSuffix = '',
}: {
  layout: TreeLayout;
  nodeMap: Record<string, TreeNode>;
  normalizedActiveNodes: string[];
  normalizedActiveEdges: Array<{ from: string; to: string }>;
  stageScale: number;
  idSuffix?: string;
}) {
  const arrowActiveId = `arrow-active${idSuffix}`;
  const arrowInactiveId = `arrow-inactive${idSuffix}`;

  return (
    <div
      className="absolute top-0 left-0 h-[1000px] w-[1600px] origin-top-left overflow-hidden rounded-[20px] bg-white shadow"
      style={{ transform: `scale(${stageScale})` }}
    >
      <div className="bg-special-navy-500 absolute top-0 left-0 inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-tl-[20px] rounded-br-[20px] px-6 py-3">
        <span className="text-st-bold text-white">※ AX 전환 커리큘럼 가이드 트리</span>
      </div>

      <div className="relative px-[50px]">
        <div className="relative" style={{ width: layout.width, height: layout.height }}>
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={layout.width}
            height={layout.height}
            aria-hidden="true"
          >
            <defs>
              <marker
                id={arrowActiveId}
                markerWidth="10"
                markerHeight="8"
                refX="4"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L0,8 L10,4 z" fill="#F4A418" />
              </marker>
              <marker
                id={arrowInactiveId}
                markerWidth="10"
                markerHeight="8"
                refX="4"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L0,8 L10,4 z" fill="#FDEDD1" />
              </marker>
            </defs>

            {layout.edges.map((edge) => {
              const fromNode = nodeMap[edge.from];
              const toNode = nodeMap[edge.to];
              if (!fromNode || !toNode) return null;
              const active = isEdgeActive(edge, normalizedActiveEdges);
              const d = edgePath(fromNode, toNode);
              const branchLabelX =
                fromNode.id === 'ELEMENTARY_NEW_BIZ_1' || fromNode.id === 'ELEMENTARY_COST_DOWN'
                  ? 590
                  : fromNode.x + NODE_WIDTH + 6;
              const branchLabelY =
                fromNode.id === 'ELEMENTARY_NEW_BIZ_1'
                  ? 254
                  : fromNode.id === 'ELEMENTARY_COST_DOWN'
                    ? 814
                    : fromNode.y + EDGE_ANCHOR_Y_OFFSET - 14;

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke={active ? '#F4A418' : '#FDEDD1'}
                    strokeWidth={active ? 2.5 : 2}
                    markerEnd={active ? `url(#${arrowActiveId})` : `url(#${arrowInactiveId})`}
                  />
                  {edge.branchLabel && (
                    <text
                      x={branchLabelX}
                      y={branchLabelY}
                      fontSize={14}
                      fill="#FF9CB3"
                      fontWeight={700}
                    >
                      {edge.branchLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {layout.nodes.map((node) => (
            <NodeBox key={node.id} node={node} active={normalizedActiveNodes.includes(node.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CurriculumTreeChart ──────────────────────────────────────────────────────

export function CurriculumTreeChart({ activeNodes, activeEdges }: CurriculumTreeChartProps) {
  const layout = OVERALL_LAYOUT;
  const nodeMap: Record<string, TreeNode> = Object.fromEntries(layout.nodes.map((n) => [n.id, n]));
  const normalizedActiveNodes = activeNodes.map(normalizeNodeId);
  const normalizedActiveEdges = normalizeEdges(activeEdges);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageScale, setStageScale] = useState(1);

  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenScale, setFullscreenScale] = useState(1);

  // 인라인 차트 스케일
  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const updateScale = () => {
      const width = element.clientWidth;
      if (!width) return;
      setStageScale(width / 1600);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // 풀스크린 스케일 — 창 크기 기준
  useEffect(() => {
    if (!fullscreen) return;
    const compute = () => {
      const vw = window.innerWidth - 64; // 32px padding 양쪽
      const vh = window.innerHeight - 64;
      const scaleByW = vw / 1600;
      const scaleByH = vh / 1000;
      setFullscreenScale(Math.min(scaleByW, scaleByH));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [fullscreen]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen]);

  // body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullscreen]);

  const sharedProps = { layout, nodeMap, normalizedActiveNodes, normalizedActiveEdges };

  return (
    <>
      <div className="bg-special-orange-0 relative w-full overflow-hidden p-[30px]">
        {/* 돋보기 버튼 */}
        <button
          type="button"
          aria-label="전체 화면으로 보기"
          onClick={() => setFullscreen(true)}
          className="bg-special-dark-blue-500 border-special-navy-100 absolute top-[30px] right-[30px] z-10 flex items-center justify-center rounded-[12px] border-2 p-2"
        >
          <Search className="size-6 text-white" strokeWidth={3} />
        </button>

        <div
          ref={stageRef}
          className="relative w-full"
          style={{ height: `${1000 * stageScale}px` }}
        >
          <ChartCanvas {...sharedProps} stageScale={stageScale} idSuffix="-inline" />
        </div>
      </div>

      {/* 풀스크린 오버레이 — createPortal로 body에 마운트 */}
      {fullscreen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setFullscreen(false);
            }}
          >
            <div
              ref={fullscreenRef}
              className="relative"
              style={{
                width: 1600 * fullscreenScale,
                height: 1000 * fullscreenScale,
              }}
            >
              <ChartCanvas {...sharedProps} stageScale={fullscreenScale} idSuffix="-fullscreen" />
            </div>

            {/* 닫기 버튼 */}
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setFullscreen(false)}
              className="absolute top-5 right-5 flex cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow"
            >
              <X className="size-6 text-black" />
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
