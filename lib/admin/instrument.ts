import specJson from '@/lib/admin/data/instrument-post.json';
import type { Item, Section } from '@/lib/admin/ax-scoring';

/**
 * 사후검사 문항 세트.
 * 설계 시트에서 뽑아낸 db/seed/instrument-post.json 을 화면과 채점이 쓰기 좋은
 * 형태로 감싼다. 문항 내용을 여기서 손대지 않는다 — 시트가 원본이다.
 */

export interface ExamOption {
  code: string;
  text: string;
}

export interface ExamItem extends Item {
  prompt: string;
  options: ExamOption[];
  scaleMin: number;
  scaleMax: number;
}

const spec = specJson as unknown as {
  items: {
    id: string;
    section: Section;
    tag: string;
    type: 'LIKERT' | 'LIKERT_FREQ' | 'SJT';
    prompt: string;
    scaleMin: number | null;
    scaleMax: number | null;
  }[];
  options: Record<string, ExamOption[]>;
  sjtKey: Record<string, { code: string; score: number; reason: string }[]>;
  subCompetencies: { tag: string; parent: string; name: string; definition: string }[];
};

export const EXAM_ITEMS: ExamItem[] = spec.items.map((i) => ({
  id: i.id,
  section: i.section,
  tag: i.tag as ExamItem['tag'],
  type: i.type,
  prompt: i.prompt,
  scaleMin: i.scaleMin ?? 1,
  scaleMax: i.scaleMax ?? 5,
  options: spec.options[i.id] ?? [],
  optionScores:
    i.type === 'SJT'
      ? Object.fromEntries((spec.sjtKey[i.id] ?? []).map((k) => [k.code, k.score]))
      : undefined,
}));

export const SUB_COMPETENCIES = spec.subCompetencies;

/** 화면에 보여줄 섹션 정보. 순서가 곧 진행 순서다. */
export const SECTIONS: {
  id: Section;
  label: string;
  english: string;
  /** 안내 화면에 함께 보여줄 문항 예시 이미지. public/exam/ 아래에 둔다. */
  intro: {
    title: string;
    guide: string[];
    caution: string[];
    example: { src: string; alt: string };
  };
}[] = [
  {
    id: 'A',
    label: '자기평가',
    english: 'Self-Estimate',
    intro: {
      title: 'Step 1. 자기평가',
      guide: [
        '지금부터는 AI와 AX 역량에 대해 스스로 어떻게 인식하고 있는지를 확인합니다.',
        '각 문항을 읽고, 현재 본인이 느끼는 이해 수준과 활용 자신감에 가장 가까운 정도를 별점으로 선택해 주세요.',
      ],
      caution: [
        '정답이 있는 평가는 아닙니다. 자신을 과하게 높이거나 낮게 평가하기보다, 현재 업무와 학습 상황에서 실제로 느끼는 수준을 기준으로 응답해 주세요.',
      ],
      example: {
        src: '/exam/example-a.png',
        alt: '자기평가 문항 예시 — 문항을 읽고 별점 다섯 개 중 하나를 고르는 화면',
      },
    },
  },
  {
    id: 'B',
    label: '상황판단',
    english: 'Situational Judgment',
    intro: {
      title: 'Step 2. 상황판단 평가',
      guide: [
        '지금부터는 AI 활용 상황에서 어떤 판단을 내리는지를 확인합니다.',
        '제시되는 업무 상황을 읽고, 4개의 선택지 중 해당 상황에서 가장 적절하다고 생각하는 답변을 선택해 주세요.',
      ],
      caution: [
        '각 문항의 상황, 요청 내용, 조건을 함께 살펴본 뒤 응답해 주세요.',
        '평소 습관이나 선호보다, 제시된 상황에서 가장 타당하다고 판단되는 선택지를 골라 주세요.',
      ],
      example: {
        src: '/exam/example-b.png',
        alt: '상황판단 문항 예시 — 상황을 읽고 A~D 보기 중 하나를 고르는 화면',
      },
    },
  },
  {
    id: 'C',
    label: '행동빈도',
    english: 'Behavior Habit',
    intro: {
      title: 'Step 3. 행동빈도 평가',
      guide: [
        '지금부터는 AI를 실제 업무나 학습 과정에서 얼마나 자주, 어떤 방식으로 활용하고 있는지를 확인합니다.',
        '각 문항을 읽고, 최근 실제 행동과 가장 가까운 빈도를 별점으로 선택해 주세요.',
      ],
      caution: [
        '잘해야 한다고 생각하는 방식이 아니라, 실제로 얼마나 자주 실행하고 있는지를 기준으로 응답해 주세요.',
        'AI 사용 횟수뿐 아니라 결과 확인, 수정, 재질문, 업무 적용 습관도 함께 고려해 주세요.',
      ],
      example: {
        src: '/exam/example-c.png',
        alt: '행동빈도 문항 예시 — 문항을 읽고 별점 다섯 개 중 하나를 고르는 화면',
      },
    },
  },
];

export const LIKERT_LABELS: Record<Section, [string, string, string]> = {
  A: ['전혀\n아니다', '보통', '매우\n그렇다'],
  B: ['', '', ''],
  C: ['전혀\n하지 않음', '보통', '매우\n자주 함'],
};

export function itemsOf(section: Section): ExamItem[] {
  return EXAM_ITEMS.filter((i) => i.section === section);
}

/* ── 설계 시트에서 함께 가져온 기준값들 ──────────────────
 * 화면에서 보여주기 위한 것이다. 채점은 ax-scoring.ts 의 상수를 쓴다.
 * 두 곳의 값이 어긋나면 안 되므로, 문항 관리 화면에서 눈으로 대조한다.
 */

const raw = specJson as unknown as {
  meta: { phase: string; source: string; parsedAt: string };
  config: Record<string, string>;
  likertMap: { likert: number; score: number }[];
  competencies: { id: string; name: string; weight: number }[];
  components: { section: string; name: string; weight: number }[];
  levels: { level: string; min: number; max: number }[];
  caps: { condition: string; capLevel: string; note: string }[];
  profiles: { id: string; name: string; description: string; condition: string }[];
  groups: { id: string; name: string; description: string }[];
  profileGroup: { profile: string; group: string }[];
};

export const SPEC_META = raw.meta;
export const LIKERT_MAP = raw.likertMap;
export const COMPETENCIES = raw.competencies;
export const COMPONENTS = raw.components;
export const LEVELS = raw.levels;
export const CAPS = raw.caps;
export const PROFILES = raw.profiles;
export const PROFILE_GROUPS = raw.groups;
export const PROFILE_GROUP_MAP = raw.profileGroup;

/** 문항의 선택지별 배점. SJT 만 해당한다. */
export function optionScoresOf(itemId: string): { code: string; score: number; reason: string }[] {
  const key = (
    specJson as unknown as {
      sjtKey: Record<string, { code: string; score: number; reason: string }[]>;
    }
  ).sjtKey;
  return key[itemId] ?? [];
}

export function subCompetencyOf(tag: string) {
  return SUB_COMPETENCIES.find((s) => s.tag === tag);
}
