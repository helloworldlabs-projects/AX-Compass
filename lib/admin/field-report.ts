import { FIELD_ITEMS, fieldItem, type FieldOption } from '@/lib/admin/field-survey';
import type { PostResponse } from '@/lib/admin/post-stats';

/**
 * 현업 적용도 집계.
 *
 * 역량 점수와 섞지 않는다. 종합 점수나 등급을 새로 만들지 않고, 사전·사후
 * 증감에도 합산하지 않는다 — 역량 검사는 "할 수 있는가"를, 이 설문은 "실제로
 * 했는가"를 묻는다. 두 가지를 한 숫자로 합치면 무엇을 말하는지 알 수 없다.
 *
 * 시간 감소 구간을 평균 내지 않는다. "10~30% 감소"를 20%로 바꿔 평균을 내면
 * 없던 정밀도가 생긴다. 비용 절감액이나 ROI 로도 환산하지 않는다 — 응답자가
 * 체감한 변화일 뿐이다.
 */

export interface Share {
  /** 보기 코드 */
  code: string;
  label: string;
  n: number;
  /** 분모. 복수 선택 문항은 그 문항에 답한 사람 수다(고른 개수가 아니다) */
  of: number;
  /** 백분율. 분모는 쓰임새에 따라 다르다 */
  pct: number;
}

export interface Rate {
  /** 해당하는 사람 수 */
  n: number;
  /** 분모. 비교할 수 없다고 답한 사람을 뺀 수일 수 있다 */
  of: number;
  /** 백분율. 분모가 0 이면 null — 0% 가 아니라 "산출 불가" 다 */
  pct: number | null;
}

export interface FieldReport {
  /** 설문을 끝낸 사람 수. 모든 비율의 기준이다 */
  n: number;
  /** 실제 업무에 적용한 비율 (연습만 한 사람 제외) */
  applied: Rate;
  /** 이어서 쓰고 있는 비율 */
  repeated: Rate;
  /** 시간이 줄었다는 비율. "비교하기 어려움"은 분모에서 뺀다 */
  timeCut: Rate;
  /** 품질이 좋아졌다는 비율. 같은 규칙 */
  qualityUp: Rate;
  /** 적용 단계 분포 (F1) */
  stages: Share[];
  /** 대표 적용 업무 (F2) */
  tasks: Share[];
  /** 시간 변화 분포 (F3) */
  timeSpread: Share[];
  /** 품질 변화 분포 (F4) */
  qualitySpread: Share[];
  /** 비교할 수 없다고 답한 사람 수 */
  unknown: { time: number; quality: number };
  /** 장애 요인 (F5). 복수 선택이라 합이 100%를 넘을 수 있다 */
  blockers: Share[];
  /** 필요한 지원 (F6) */
  supports: Share[];
  /** 적용 사례 (F7). 쓴 그대로 둔다 */
  cases: string[];
}

const rate = (n: number, of: number): Rate => ({
  n,
  of,
  pct: of === 0 ? null : Math.round((n / of) * 1000) / 10,
});

/** 한 문항의 보기별 분포. 고르지 않은 보기도 0 으로 남긴다 — 빠지면 읽는 쪽이 헷갈린다. */
function spread(id: string, picks: string[], of: number): Share[] {
  const options = fieldItem(id)?.options ?? [];
  const count = new Map<string, number>();
  for (const code of picks) count.set(code, (count.get(code) ?? 0) + 1);
  return options.map((o) => {
    const n = count.get(o.code) ?? 0;
    return {
      code: o.code,
      label: o.label,
      n,
      of,
      pct: of === 0 ? 0 : Math.round((n / of) * 1000) / 10,
    };
  });
}

/** 그 사람이 이 문항에서 고른 것들. 단일 선택도 배열로 맞춰 둔다. */
const picked = (answers: Record<string, string | string[]>, id: string): string[] => {
  const v = answers[id];
  if (Array.isArray(v)) return v;
  return typeof v === 'string' && v !== '' ? [v] : [];
};

const optionOf = (id: string, code: string): FieldOption | undefined =>
  fieldItem(id)?.options?.find((o) => o.code === code);

/**
 * 설문을 끝낸 응답만 집계한다.
 *
 * 하다 만 응답을 섞으면 분모가 흔들린다. 지금은 마지막에 한 번 제출하므로
 * 답이 저장돼 있다는 것이 곧 끝냈다는 뜻이지만, 그 전제를 코드에 적어 둔다.
 */
export function buildFieldReport(responses: PostResponse[]): FieldReport | null {
  const done = responses.filter(
    (r) => r.fieldAnswers !== null && Object.keys(r.fieldAnswers).length > 0,
  );
  if (done.length === 0) return null;

  const n = done.length;
  const answers = done.map((r) => r.fieldAnswers!);

  // F1 — 적용 단계
  const stagePicks = answers.flatMap((a) => picked(a, 'F1'));
  const appliedN = stagePicks.filter((c) => optionOf('F1', c)?.applied).length;
  const repeatedN = stagePicks.filter((c) => optionOf('F1', c)?.repeated).length;

  // F3·F4 — "비교하기 어려움"은 분모에서 뺀다. 모른다는 답을 분모에 두면
  // 비율이 실제보다 낮게 나온다.
  const timePicks = answers.flatMap((a) => picked(a, 'F3'));
  const timeKnown = timePicks.filter((c) => optionOf('F3', c)?.effect !== 'unknown');
  const timeCutN = timeKnown.filter((c) => optionOf('F3', c)?.effect === 'cut').length;

  const qualPicks = answers.flatMap((a) => picked(a, 'F4'));
  const qualKnown = qualPicks.filter((c) => optionOf('F4', c)?.effect !== 'unknown');
  const qualUpN = qualKnown.filter((c) => optionOf('F4', c)?.effect === 'up').length;

  // F5·F6 — 복수 선택. 분모는 그 문항에 답한 사람 수다(선택 개수가 아니다).
  const blockerAnswered = answers.filter((a) => picked(a, 'F5').length > 0).length;
  const supportAnswered = answers.filter((a) => picked(a, 'F6').length > 0).length;

  return {
    n,
    applied: rate(appliedN, n),
    repeated: rate(repeatedN, n),
    timeCut: rate(timeCutN, timeKnown.length),
    qualityUp: rate(qualUpN, qualKnown.length),
    stages: spread('F1', stagePicks, n),
    tasks: spread(
      'F2',
      answers.flatMap((a) => picked(a, 'F2')),
      n,
    ),
    timeSpread: spread('F3', timePicks, n),
    qualitySpread: spread('F4', qualPicks, n),
    unknown: {
      time: timePicks.length - timeKnown.length,
      quality: qualPicks.length - qualKnown.length,
    },
    blockers: spread(
      'F5',
      answers.flatMap((a) => picked(a, 'F5')),
      blockerAnswered,
    )
      .filter((s) => s.n > 0)
      .sort((a, b) => b.n - a.n),
    supports: spread(
      'F6',
      answers.flatMap((a) => picked(a, 'F6')),
      supportAnswered,
    )
      .filter((s) => s.n > 0)
      .sort((a, b) => b.n - a.n),
    /*
      서술형은 쓴 그대로 싣는다. 요약하거나 다듬지 않는다 — 없는 말을 지어낼
      위험이 있고, 그 한 줄이 기업에 전달되는 문서에 들어간다.
      너무 짧은 것은 뺀다. "없음" 한 마디는 사례가 아니다.
    */
    cases: answers
      .map((a) => (typeof a.F7 === 'string' ? a.F7.trim() : ''))
      .filter((s) => s.length >= 15),
  };
}

/** 문항 수. 화면에서 "7문항" 처럼 쓴다. */
export const FIELD_ITEM_COUNT = FIELD_ITEMS.length;
