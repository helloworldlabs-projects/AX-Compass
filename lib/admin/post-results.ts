/**
 * 사후 응답 채점(제출할 때) · 사전검사 매칭(읽을 때).
 *
 * 원본처럼 점수는 제출 시점에 계산해 함께 저장한다. 나중에 등급 기준을 손보더라도
 * 이미 낸 사람의 점수가 저절로 달라지면 안 된다.
 * 사전 점수는 GET /pre/orgs/{id}/members 에서 pre_user_id 로 찾아 붙인다.
 */
import {
  normalizeAnswer,
  score,
  type Answers,
  type CompetencyId,
  type ProfileId,
  type Tag,
} from '@/lib/admin/ax-scoring';
import { EXAM_ITEMS, SPEC_META } from '@/lib/admin/instrument';
import type { PostResponse, Scores } from '@/lib/admin/post-stats';
import type { PreMember } from '@/types/reference';
import type {
  PostScoreDto,
  StoredPostResponse,
  SubmitPostResponseRequestDto,
} from '@/types/postResponse';

const round1 = (v: number) => Math.round(v * 10) / 10;

/** 제출 본문. 원본 saveResponse 와 같은 값을 만든다. */
export function buildSubmitBody(
  name: string,
  department: string | null,
  answers: Answers,
): SubmitPostResponseRequestDto {
  const result = score(EXAM_ITEMS, answers);

  // 하위 역량(a~l)별 평균. score() 가 돌려주지 않아 여기서 낸다.
  const byTag = new Map<Tag, number[]>();
  for (const item of EXAM_ITEMS) {
    const value = normalizeAnswer(item, answers[item.id]);
    if (value === null) continue;
    byTag.set(item.tag, [...(byTag.get(item.tag) ?? []), value]);
  }

  const scores: PostScoreDto[] = [
    { kind: 'section', code: 'A', value: result.se },
    { kind: 'section', code: 'B', value: result.sj },
    { kind: 'section', code: 'C', value: result.bh },
    ...(['U', 'P', 'E', 'R'] as CompetencyId[]).map((id) => ({
      kind: 'competency' as const,
      code: id,
      value: result.competencies[id].score,
    })),
    ...[...byTag].map(([tag, values]) => ({
      kind: 'tag' as const,
      code: tag,
      value: round1(values.reduce((a, b) => a + b, 0) / values.length),
    })),
  ];

  return {
    name,
    department,
    instrumentVersion: SPEC_META.parsedAt,
    overall: result.overall,
    baseLevel: result.baseLevel,
    level: result.level,
    capReason: result.capReason,
    profile: result.profile,
    profileGroup: result.group,
    se: result.se,
    sj: result.sj,
    bh: result.bh,
    gapSr: result.gapSR,
    gapSb: result.gapSB,
    // 적은 그대로 두고, 환산값을 옆에 붙인다.
    answers: EXAM_ITEMS.flatMap((item) => {
      const raw = answers[item.id];
      if (raw === undefined || raw === null || raw === '') return [];
      return [{ itemCode: item.id, rawValue: String(raw), scoredValue: normalizeAnswer(item, raw) }];
    }),
    scores,
  };
}

function preScores(m: PreMember): Scores {
  return {
    total: m.total ?? 0,
    sections: { A: m.sections.A ?? 0, B: m.sections.B ?? 0, C: m.sections.C ?? 0 },
    competencies: {
      UNDERSTAND: m.competencies.UNDERSTAND ?? 0,
      USE_AND_APPLY: m.competencies.USE_AND_APPLY ?? 0,
      EVALUATE: m.competencies.EVALUATE ?? 0,
      RESPONSIBLE: m.competencies.RESPONSIBLE ?? 0,
    },
  };
}

/** 저장된 응답에 사전 기록을 붙인다 (원본 responsesOf). 한 링크의 응답은 모두 같은 기업이다. */
export function toPostResponses(
  stored: StoredPostResponse[],
  institutionId: number,
  preMembers: PreMember[],
): PostResponse[] {
  return stored.map((r) => {
    const pre =
      r.preUserId === null ? null : (preMembers.find((m) => m.userId === r.preUserId) ?? null);
    return {
      id: r.id,
      institutionId,
      name: r.name,
      // 부서는 사전검사에서 따라온다. 매칭되지 않으면 응답에 적힌 값.
      department: pre?.department ?? r.department,
      submittedAt: r.submittedAt,
      match: pre ? '매칭' : '사전없음',
      post: r.post,
      pre: pre ? preScores(pre) : null,
      postProfile: r.profile ?? 'BALANCED',
      preProfile: (pre?.profile ?? null) as ProfileId | null,
    };
  });
}
