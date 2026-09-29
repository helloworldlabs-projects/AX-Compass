import { COURSES, type Course, type Level } from '@/lib/admin/courses';
import { MEMBER_COMPETENCIES, levelOf, type MemberCompetency } from '@/lib/admin/metrics';
import type { CompanyReport } from '@/lib/admin/report';
import type { ProfileId } from '@/lib/admin/ax-scoring';
import { with_ } from '@/lib/admin/josa';

/**
 * 다음 과정 추천.
 *
 * 보고서 마지막에 "그래서 다음은 무엇인가"를 답하는 자리다. 점수만 늘어놓고
 * 끝나면 기업은 무엇을 해야 할지 모른 채 문서를 덮는다.
 *
 * **규칙 기반이다.** 무엇을 보고 골랐는지가 문장으로 남아야 담당자가 기업에
 * 설명할 수 있고, 추천이 이상할 때 어느 규칙이 잘못됐는지 짚을 수 있다.
 * 점수를 내는 기준은 아래 SIGNALS 하나뿐이고, 화면은 그 결과를 읽기만 한다.
 *
 * 신호는 다섯 갈래다.
 *   1) 가장 낮은 역량과 하위 역량 — 무엇이 모자란가
 *   2) 사후에 덜 오른 역량 — 교육이 닿지 않은 곳은 어디인가
 *   3) 인식-실행 격차 — 아는데 안 하는가, 하는데 모르는가
 *   4) 프로필 분포 — 어떤 성향이 많은가
 *   5) 성숙도 목표와 관점별 격차 — 조직이 어디로 가려 하는가
 * 여기에 만족도에서 나온 요청과 이미 들은 과정을 얹어 조정한다.
 */

export interface Recommendation {
  course: Course;
  score: number;
  /** 왜 골랐는지. 보고서에 그대로 싣는다. */
  reasons: string[];
  /** 이 과정을 들으면 무엇이 달라지는지. */
  effect: string;
}

interface Signal {
  /** 몇 점을 더하는가. */
  weight: number;
  /** 이 신호가 가리키는 문장. 뽑힌 과정의 이유로 붙는다. */
  reason: string;
  /** 이 과정에 해당하는가. */
  match: (c: Course) => boolean;
}

const LEVEL_ORDER: Level[] = ['입문', '초급', '중급', '고급'];

export function recommendCourses(
  r: CompanyReport,
  limit = 3,
): { picks: Recommendation[]; signals: string[] } {
  const signals: Signal[] = [];

  /* ── 1) 지금 수준에 맞는가 ────────────────────────────── */

  const level = (levelOf(r.overall.post) ?? levelOf(r.overall.pre)) as Level | null;
  if (level) {
    signals.push({
      weight: 3,
      reason: `구성원 종합 수준이 ${level}입니다`,
      match: (c) => c.levels.includes(level),
    });
    // 한 단계 위까지는 무리가 아니다. 같은 자리만 맴돌면 다음이 없다.
    const next = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1];
    if (next) {
      signals.push({
        weight: 1,
        reason: `${next} 단계로 올라설 여지가 있습니다`,
        match: (c) => c.levels.includes(next),
      });
    }
  }

  /* ── 2) 가장 낮은 역량 ───────────────────────────────── */

  const byPost = r.competencies.filter((c) => c.post !== null).sort((a, b) => a.post! - b.post!);
  const weakest = byPost[0];
  if (weakest) {
    signals.push({
      weight: 5,
      reason: `${weakest.short} 역량이 ${weakest.post}점으로 가장 낮습니다`,
      match: (c) => c.competencies.includes(weakest.code as MemberCompetency),
    });
  }

  /* ── 3) 교육이 닿지 않은 역량 ────────────────────────── */

  const byChange = r.competencies.filter((c) => c.diff !== null).sort((a, b) => a.diff! - b.diff!);
  const leastMoved = byChange[0];
  if (leastMoved && byChange.length > 1) {
    signals.push({
      weight: 4,
      reason: `${leastMoved.short} 역량은 교육 뒤에도 가장 적게 움직였습니다 (${fmt(leastMoved.diff)}점)`,
      match: (c) => c.competencies.includes(leastMoved.code as MemberCompetency),
    });
  }

  /* ── 4) 가장 낮은 하위 역량 두 가지 ──────────────────── */

  const weakTags = r.tags
    .filter((t) => t.post !== null)
    .sort((a, b) => a.post! - b.post!)
    .slice(0, 2);
  for (const t of weakTags) {
    signals.push({
      weight: 3,
      reason: `${with_(t.name, '이')} ${t.post}점으로 낮습니다`,
      match: (c) => c.tags.includes(t.code),
    });
  }

  /* ── 5) 인식과 실행의 거리 ───────────────────────────── */

  // 아는 것보다 덜 한다 → 손을 움직이는 과정이 필요하다.
  if (r.gaps.sb.post !== null && r.gaps.sb.post > 5) {
    signals.push({
      weight: 4,
      reason: `판단은 되는데 실제로 하는 빈도가 ${Math.round(r.gaps.sb.post)}점 낮습니다. 배운 것이 습관으로 가지 않았습니다`,
      match: (c) =>
        c.family === '주제별 레시피' || c.family === '직무별 키트' || c.tags.includes('f'),
    });
  }
  // 스스로를 높게 보는데 판단이 못 따라온다 → 검증·평가가 필요하다.
  if (r.gaps.sr.post !== null && r.gaps.sr.post > 5) {
    signals.push({
      weight: 4,
      reason: `자기평가가 상황판단보다 ${Math.round(r.gaps.sr.post)}점 높습니다. 결과를 따져 보는 힘이 필요합니다`,
      match: (c) => c.competencies.includes('EVALUATE'),
    });
  }

  /* ── 6) 프로필 분포 ──────────────────────────────────── */

  const topProfile = [...r.profile.rows].sort((a, b) => b.postShare - a.postShare)[0];
  if (topProfile && topProfile.postShare >= 30) {
    signals.push({
      weight: 3,
      reason: `${with_(topProfile.name, '이')} ${topProfile.postShare}%로 가장 많습니다`,
      match: (c) => c.profiles.includes(topProfile.id as ProfileId),
    });
  }

  /* ── 7) 성숙도가 가리키는 방향 ───────────────────────── */

  const maturityGaps = r.pre.maturity.competencies
    .filter((c) => c.current !== null && c.target !== null)
    .map((c) => ({ name: c.name.split('(')[0].trim(), gap: c.target! - c.current! }))
    .sort((a, b) => b.gap - a.gap);
  const topGap = maturityGaps[0];
  if (topGap && topGap.gap > 0) {
    signals.push({
      weight: 3,
      reason: `경영진이 본 ${topGap.name} 관점의 목표 격차가 +${Math.round(topGap.gap)}로 가장 큽니다`,
      match: (c) => c.maturityViews.some((v) => v.startsWith(topGap.name.slice(0, 3))),
    });
  }

  /* ── 8) 만족도가 낮은 지표 ───────────────────────────── */

  const weakMetric = r.satisfaction.metrics
    .filter((m) => m.mean !== null)
    .sort((a, b) => a.mean! - b.mean!)[0];
  if (weakMetric && weakMetric.label.includes('현업')) {
    signals.push({
      weight: 3,
      reason: `만족도에서 '${weakMetric.label}'이 ${weakMetric.mean}점으로 가장 낮습니다. 현업에 바로 쓰는 실습이 더 필요합니다`,
      match: (c) => c.family === '직무별 키트' || c.family === '주제별 레시피',
    });
  }

  /* ── 9) 직무 ─────────────────────────────────────────── */

  // 인원이 가장 많은 부서의 이름으로 직무를 짐작한다. 정확한 직무 정보는
  // 우리에게 없고, 부서 이름이 그나마 가장 가까운 단서다.
  const biggest = [...r.department.rows]
    .filter((d) => d.name !== '미기재')
    .sort((a, b) => b.postN + b.preN - (a.postN + a.preN))[0];
  if (biggest) {
    signals.push({
      weight: 2,
      reason: `인원이 가장 많은 소속이 '${biggest.name}'입니다`,
      match: (c) =>
        c.roleKeywords.some((k) => biggest.name.toLowerCase().includes(k.toLowerCase())),
    });
  }

  /* ── 점수 매기기 ─────────────────────────────────────── */

  // 이번에 들은 과정은 빼고, 진단 과정 중 사전 진단도 뺀다.
  const taken = (r.link.course ?? '').trim();
  const pool = COURSES.filter((c) => {
    if (c.no === 1) return false; // 사전 진단은 이미 지난 단계다
    if (taken && (c.title === taken || c.shortTitle === taken)) return false;
    return true;
  });

  const scored = pool.map((course) => ({
    course,
    hit: signals.filter((s) => s.match(course)),
  }));

  const chosen = scored
    .filter((s) => s.hit.length > 0)
    .map((s) => ({ ...s, score: s.hit.reduce((a, x) => a + x.weight, 0) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        // 점수가 같으면 짧은 과정을 먼저 권한다. 시작이 쉬워야 실제로 연다.
        a.course.hours - b.course.hours ||
        a.course.no - b.course.no,
    )
    .slice(0, limit);

  /**
   * 이유는 **그 과정에만 걸린 것부터** 적는다.
   *
   * 가중치 순으로만 뽑으면 세 과정의 이유가 똑같아진다 — 가장 무거운 신호는
   * 대개 여러 과정에 함께 걸리기 때문이다. 그러면 왜 1순위가 1순위인지가
   * 보이지 않는다. 뽑힌 과정들 사이에서 드문 이유를 앞세운다.
   */
  const shared = new Map<string, number>();
  for (const c of chosen) {
    for (const h of c.hit) {
      shared.set(h.reason, (shared.get(h.reason) ?? 0) + 1);
    }
  }

  const picks: Recommendation[] = chosen.map((c) => ({
    course: c.course,
    score: c.score,
    reasons: [...c.hit]
      .sort(
        (a, b) => (shared.get(a.reason) ?? 0) - (shared.get(b.reason) ?? 0) || b.weight - a.weight,
      )
      .slice(0, 3)
      .map((s) => s.reason),
    effect: c.course.effect,
  }));

  return { picks, signals: signals.map((s) => s.reason) };
}

function fmt(v: number | null): string {
  if (v === null) return '—';
  const r = Math.round(v * 10) / 10;
  return r > 0 ? `+${r}` : `${r}`;
}

/** 역량 기호를 짧은 이름으로. 이유 문장에 쓴다. */
export const COMPETENCY_SHORT: Record<MemberCompetency, string> = Object.fromEntries(
  MEMBER_COMPETENCIES.map((c) => [c.code, c.short]),
) as Record<MemberCompetency, string>;
