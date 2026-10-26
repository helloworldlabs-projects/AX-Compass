import spec from '@/lib/admin/data/field-survey.json';

/**
 * 현업 적용도 검사.
 *
 * 사후 역량 검사 뒤에 붙는 **선택형 부가 설문**이다. 링크를 발급할 때 포함
 * 여부를 정하고, 포함한 링크만 진행한다.
 *
 * 역량 점수와 섞지 않는다. 별도 점수나 등급을 만들지 않고, 사전·사후 증감에도
 * 합산하지 않는다 — 묻는 것이 다르기 때문이다. 역량 검사는 "할 수 있는가"를,
 * 이 설문은 "실제로 했는가"를 묻는다.
 *
 * 문항과 선택지는 테스트하면서 바뀔 수 있다. 바뀐 뒤에 예전 응답을 새 선택지로
 * 읽으면 집계가 어긋나므로 응답마다 판(version)을 함께 저장한다.
 */

export type FieldItemType = 'SINGLE' | 'MULTI' | 'TEXT';

export interface FieldOption {
  code: string;
  label: string;
  /** F1 전용 — 연습이 아니라 실제 업무에 적용했는가 */
  applied?: boolean;
  /** F1 전용 — 한 번이 아니라 이어서 쓰고 있는가 */
  repeated?: boolean;
  /** F3·F4 전용 — 집계에서 이 보기를 어느 쪽으로 세는가 */
  effect?: 'cut' | 'up' | 'none' | 'unknown';
  /** 고르면 입력란이 따로 열린다 */
  etc?: boolean;
  /** 다른 보기와 함께 고를 수 없다 ("어려움 없음" 같은 것) */
  exclusive?: boolean;
}

export interface FieldItem {
  id: string;
  type: FieldItemType;
  prompt: string;
  hint?: string;
  placeholder?: string;
  /** 비워 두고 넘어갈 수 있다 */
  optional?: boolean;
  /**
   * 비워 두고 넘어갈 수 있을 때 보여 주는 안내.
   *
   * 없으면 "비워 두고 넘어가셔도 됩니다." 를 쓴다. 어려움·지원처럼 "해당
   * 없음" 보기를 두지 않은 문항은 언제 넘어가라는 말인지 따로 적어야 한다.
   */
  optionalNote?: string;
  /** 복수 선택에서 고를 수 있는 최대 개수 */
  maxPick?: number;
  /**
   * "기타" 입력란의 이름표와 보기글.
   *
   * 문항마다 묻는 것이 다르다 — 업무인지, 어려움인지, 필요한 지원인지.
   * 화면에 if 를 쌓는 대신 문항 곁에 둔다.
   */
  etcLabel?: string;
  etcPlaceholder?: string;
  options?: FieldOption[];
}

export const FIELD_VERSION: string = spec.meta.version;
export const FIELD_INTRO = spec.intro;
export const FIELD_ITEMS = spec.items as FieldItem[];

export const fieldItem = (id: string): FieldItem | undefined =>
  FIELD_ITEMS.find((i) => i.id === id);

/** 한 문항의 답. 복수 선택은 배열, 나머지는 문자열. */
export type FieldValue = string | string[];
export type FieldAnswers = Record<string, FieldValue>;

/**
 * 보여 줄 문항.
 *
 * 처음에는 1번 답에 따라 2·3·4·7번을 건너뛰게 했는데, 그러면 "기회가 없었다"를
 * 고른 사람의 답이 비어 집계의 분모가 문항마다 달라진다. 1번 보기를 **적용했다는
 * 전제**로 다섯 단계로 바꾸면서 분기를 없앴다 — 묻는 것이 모두에게 같으면 읽는
 * 쪽도 단순해진다.
 *
 * 함수는 남겨 둔다. 부르는 자리가 여럿이라, 조건부 문항이 다시 생기면 여기에
 * 답을 받아 거르면 된다.
 */
export function visibleItems(): FieldItem[] {
  return FIELD_ITEMS;
}

/**
 * 제출할 답만 남긴다.
 *
 * 고르다 지운 자리가 빈 문자열이나 빈 배열로 남는다. 그대로 보내면 "답했는데
 * 비어 있는" 칸이 되어 집계에서 0 으로 세어진다.
 */
export function prunedAnswers(answers: FieldAnswers): FieldAnswers {
  const out: FieldAnswers = {};
  for (const [key, value] of Object.entries(answers)) {
    if (value === '' || (Array.isArray(value) && value.length === 0)) continue;
    out[key] = value;
  }
  return out;
}

/**
 * 이 문항에 답했는가. 넘어가도 되는 문항은 늘 참이다.
 *
 * "기타"를 골랐으면 입력란도 채워야 한다 — 기타만 고르고 비워 두면 무엇이
 * 어려웠는지 알 길이 없다.
 */
export function isAnswered(item: FieldItem, answers: FieldAnswers): boolean {
  if (item.optional) return true;
  return hasAnswer(item, answers);
}

/**
 * 실제로 적은 것이 있는가. 넘어가도 되는 문항이라고 봐 주지 않는다.
 *
 * 진행률은 이쪽을 쓴다. isAnswered 로 세면 선택 문항이 시작부터 "답함" 이 되어
 * 아무것도 안 한 화면이 2% 로 뜨고, 마지막 선택 문항을 비워 둔 채 100% 가 된다.
 */
export function hasAnswer(item: FieldItem, answers: FieldAnswers): boolean {
  const value = answers[item.id];

  if (item.type === 'MULTI') {
    if (!Array.isArray(value) || value.length === 0) return false;
    return !needsEtc(item, value) || hasEtcText(item, answers);
  }

  if (typeof value !== 'string' || value === '') return false;
  return !needsEtc(item, value) || hasEtcText(item, answers);
}

/** 고른 보기 중에 입력란이 열리는 것이 있는가. */
export function needsEtc(item: FieldItem, value: FieldValue): boolean {
  const picked = Array.isArray(value) ? value : [value];
  return (item.options ?? []).some((o) => o.etc && picked.includes(o.code));
}

const hasEtcText = (item: FieldItem, answers: FieldAnswers): boolean => {
  const text = answers[`${item.id}_etc`];
  return typeof text === 'string' && text.trim() !== '';
};

/**
 * 복수 선택에서 보기를 눌렀을 때의 다음 상태.
 *
 * "어려움 없음"처럼 혼자만 고를 수 있는 보기가 있다. 그것을 고르면 나머지를
 * 비우고, 나머지를 고르면 그것을 뺀다 — 둘을 함께 둔 답은 뜻이 없다.
 * 최대 개수를 넘기면 가장 먼저 고른 것을 밀어낸다. 눌렀는데 아무 일도
 * 일어나지 않으면 고장으로 읽힌다.
 */
export function togglePick(item: FieldItem, current: string[], code: string): string[] {
  if (current.includes(code)) return current.filter((c) => c !== code);

  const option = item.options?.find((o) => o.code === code);
  if (option?.exclusive) return [code];

  const exclusives = new Set((item.options ?? []).filter((o) => o.exclusive).map((o) => o.code));
  const next = [...current.filter((c) => !exclusives.has(c)), code];

  const max = item.maxPick ?? next.length;
  return next.length > max ? next.slice(next.length - max) : next;
}
