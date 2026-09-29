import { levelOf, MEMBER_COMPETENCIES, type MemberCompetency } from '@/lib/admin/metrics';
import type {
  ChoiceQuestion,
  CourseOverview,
  FreeTextQuestion,
  InstitutionCohort,
  InstitutionSatisfaction,
  MetricAverage,
  PreMember,
  PreOrgDetail,
  QuestionBundle,
  QuestionResult,
} from '@/types/reference';
import type { ExamLink } from '@/types/postLink';
import type { PostResponse } from '@/lib/admin/post-stats';
import {
  chiSquare,
  manova,
  oneWayAnova,
  pairedTTest,
  welchTTest,
  mean,
  sd,
  type AnovaResult,
  type ChiSquareResult,
  type ManovaResult,
  type PairedResult,
  type WelchResult,
} from '@/lib/admin/stats';
import { PROFILE_NAMES, type ProfileId } from '@/lib/admin/ax-scoring';

/**
 * 기업 보고서 자료 모으기.
 *
 * 세 곳에서 읽어 한 기업으로 엮는다 — 사전검사(axcompass), 사후검사(우리 DB),
 * 교육 만족도(safarion). 화면은 이 결과를 받아 그리기만 한다. 계산이 화면에
 * 흩어지면 같은 수를 두 자리에서 다르게 내게 된다.
 *
 * **비교의 기준은 전체 대 전체다.** 사전은 사전검사를 치른 사람 전부, 사후는
 * 응답한 사람 전부. 다만 이름으로 이어진 사람들만 따로 모아 대응 검정도
 * 함께 낸다 — 통계적으로는 그쪽이 강하고, 두 결과가 갈리면 그 자체가
 * "응답한 사람이 한쪽으로 쏠렸다"는 신호다.
 */

/** 사후검사 역량 기호를 사전검사 쪽 이름으로. */
const COMPETENCY_OF: Record<MemberCompetency, MemberCompetency> = {
  UNDERSTAND: 'UNDERSTAND',
  USE_AND_APPLY: 'USE_AND_APPLY',
  EVALUATE: 'EVALUATE',
  RESPONSIBLE: 'RESPONSIBLE',
};

export interface CompetencyChange {
  code: MemberCompetency;
  short: string;
  pre: number | null;
  post: number | null;
  diff: number | null;
  /** 전체 대 전체 */
  welch: WelchResult;
  /** 같은 사람끼리 */
  paired: PairedResult;
}

export interface SectionChange {
  code: 'A' | 'B' | 'C';
  label: string;
  pre: number | null;
  post: number | null;
  diff: number | null;
  welch: WelchResult;
}

/** 입문·초급·중급·고급. 사전검사와 같은 기준(50/70/90)으로 나눈다. */
export type LevelName = '입문' | '초급' | '중급' | '고급';
export const LEVEL_NAMES: LevelName[] = ['입문', '초급', '중급', '고급'];

export interface LevelDistribution {
  /** 무엇의 분포인가 — "종합" 또는 역량 이름. */
  name: string;
  pre: Record<LevelName, number>;
  post: Record<LevelName, number>;
  preN: number;
  postN: number;
  /** 가장 많은 등급. 기존 리포트의 "대표등급"이다. */
  preMode: LevelName | null;
  postMode: LevelName | null;
}

export interface ProfileChange {
  id: ProfileId;
  name: string;
  preN: number;
  postN: number;
  preShare: number;
  postShare: number;
  diff: number;
}

export interface CompanyReport {
  link: ExamLink;
  pre: PreOrgDetail;
  preMembers: PreMember[];
  responses: PostResponse[];
  matched: PostResponse[];

  /** 응답률. 이 수가 낮으면 아래 모든 변화를 기업 전체의 변화라 말할 수 없다. */
  coverage: { preN: number; postN: number; matchedN: number; rate: number | null };

  /** 종합 점수 변화 */
  overall: {
    pre: number | null;
    post: number | null;
    diff: number | null;
    welch: WelchResult;
    paired: PairedResult;
  };

  sections: SectionChange[];
  competencies: CompetencyChange[];

  /**
   * 등급 분포.
   *
   * 평균만 보면 "모두가 조금씩 오른 것"과 "몇 명이 크게 오른 것"이 같아
   * 보인다. 분포를 보면 교육이 어느 층에 닿았는지가 드러난다.
   */
  levels: LevelDistribution[];

  /** 하위 역량 12가지 */
  tags: {
    code: string;
    name: string;
    pre: number | null;
    post: number | null;
    diff: number | null;
  }[];

  /** 소속별 다변량 분석 */
  department: {
    manovaPost: ManovaResult;
    /**
     * 소속별 역량 기초 통계량.
     *
     * 다변량 분석 결과만 내면 "그래서 어느 부서가 어떤데?"를 알 수 없다.
     * 평균과 표준편차를 함께 실어야 표를 읽고 스스로 판단할 수 있다.
     */
    stats: {
      name: string;
      n: number;
      byCompetency: {
        code: MemberCompetency;
        short: string;
        mean: number | null;
        sd: number | null;
      }[];
    }[];
    /** 같은 사람의 변화량을 소속별로 본 것. */
    changeAnova: AnovaResult;
    rows: {
      name: string;
      preN: number;
      postN: number;
      pre: number | null;
      post: number | null;
      diff: number | null;
    }[];
  };

  /** 프로필 유형 변화 */
  profile: {
    rows: ProfileChange[];
    chi2: ChiSquareResult;
    /** 같은 사람이 어느 유형에서 어느 유형으로 옮겨 갔는가. */
    moves: { from: ProfileId; to: ProfileId; n: number }[];
    moved: number;
    stayed: number;
  };

  /** 역량 격차 분석 */
  gaps: {
    /**
     * 자기평가 − 상황판단. 음수면 스스로를 낮게 본다.
     *
     * welch 는 사전 응시자 전부와 사후 응답자 전부를 견준 것이고,
     * paired 는 이름이 이어진 사람만 짝지어 그 사람 안의 변화를 본 것이다.
     * "거리가 좁혀졌는가" 는 paired 로 말해야 한다.
     */
    sr: {
      pre: number | null;
      post: number | null;
      diff: number | null;
      welch: WelchResult;
      paired: PairedResult;
    };
    /** 상황판단 − 행동빈도. 양수면 아는 것보다 덜 한다. */
    sb: {
      pre: number | null;
      post: number | null;
      diff: number | null;
      welch: WelchResult;
      paired: PairedResult;
    };
    /** 가장 높은 역량과 가장 낮은 역량의 차이. 줄면 고르게 올랐다는 뜻이다. */
    spread: { pre: number | null; post: number | null; diff: number | null };
  };

  satisfaction: {
    metrics: { code: string; label: string; mean: number | null; answers: number }[];
    overall: number | null;
    respondents: number;
    cohorts: number;
    /** 이 기업이 받은 교육 회차. 보고서 앞머리의 "무슨 교육을 했는가"다. */
    courses: InstitutionCohort[];
    /**
     * 과정 개요. 소개 글과 커리큘럼 모듈이 들어 있다.
     * 제목과 인원만으로는 무슨 교육이었는지 알 수 없다.
     */
    overviews: CourseOverview[];
    /** 문항별 별점. 지표 평균만으로는 어디를 고칠지 정해지지 않는다. */
    questions: QuestionResult[];
    /** 객관식 문항. 무엇을 더 바라는지가 여기서 나온다. */
    choices: ChoiceQuestion[];
    /** 서술형 응답. 수치가 말하지 못하는 것이 여기 있다. */
    freeText: FreeTextQuestion[];
  };
}

const SECTION_LABEL: Record<'A' | 'B' | 'C', string> = {
  A: '자기평가',
  B: '상황판단',
  C: '행동빈도',
};

const round1 = (v: number | null): number | null => (v === null ? null : Math.round(v * 10) / 10);

const avg = (xs: number[]): number | null => (xs.length === 0 ? null : round1(mean(xs)));

/**
 * 화면에 적히는 변화량.
 *
 * 사전·사후는 소수 한 자리로 반올림해 보여 준다. 변화를 반올림 전 값으로 내면
 * 표에 적힌 두 수를 빼도 답이 맞지 않는다 — `64.5 → 84.0` 인데 변화가 `+19.6`
 * 으로 찍히는 식이다. 읽는 사람은 보이는 숫자로 검산하지 숨은 자릿수를 모른다.
 * 그래서 **보여 주는 값끼리** 뺀다.
 */
const delta = (post: number | null, pre: number | null): number | null =>
  post === null || pre === null ? null : round1(post - pre);

/**
 * 역량을 사후 점수로 줄 세울 때 쓰는 값.
 *
 * `post` 는 소수 한 자리로 반올림한 **표시값**이다. 88.32 와 88.34 가 똑같이
 * 88.3 이 되어 동점이 되고, 그대로 정렬하면 배열에 먼저 있는 쪽이 "가장 높은
 * 역량"으로 뽑힌다. 기업에 나가는 제언이 그 이름으로 쓰이므로 가려야 한다.
 * 검정에 쓰인 두 자리 평균으로 가른다.
 */
export const rankByPost = (c: CompetencyChange): number =>
  c.welch.usable || c.post !== null ? c.welch.mean2 : Number.NEGATIVE_INFINITY;
/** computeCompanyReport 입력. 조회는 hooks/useCompanyReport 가 모아 넘긴다. */
export interface CompanyReportInputs {
  link: ExamLink;
  pre: PreOrgDetail;
  preMembers: PreMember[];
  /** 채점·사전 매칭까지 끝난 사후 응답 (lib/admin/post-results) */
  responses: PostResponse[];
  /** 하위 역량(a~l)별 사후 평균 */
  tagAverages: Record<string, number>;
  /** 링크에 회차가 있으면 POST /offerings/satisfaction, 없으면 GET /institutions/{id}/satisfaction */
  metrics: MetricAverage[];
  satisfactionList: InstitutionSatisfaction[];
  courses: InstitutionCohort[];
  overviews: CourseOverview[];
  questionResults: QuestionBundle;
  choices: ChoiceQuestion[];
}

/**
 * 한 **검사**(링크)의 보고서. 순수 계산이다 — 화면을 열 때마다 다시 낸다.
 * 사전검사는 기업 단위라 기업 번호로 읽은 것을 그대로 쓴다.
 */
export function computeCompanyReport({
  link,
  pre,
  preMembers,
  responses,
  tagAverages,
  metrics,
  satisfactionList,
  courses,
  overviews,
  questionResults,
  choices,
}: CompanyReportInputs): CompanyReport {
  const institutionId = link.institutionId;

  const matched = responses.filter((r) => r.pre !== null);

  /* ── 종합 ──────────────────────────────────────────────── */

  const preTotals = preMembers.flatMap((m) => (m.total === null ? [] : [m.total]));
  const postTotals = responses.map((r) => r.post.total);

  const overall = {
    pre: avg(preTotals),
    post: avg(postTotals),
    diff: delta(avg(postTotals), avg(preTotals)),
    welch: welchTTest(preTotals, postTotals),
    paired: pairedTTest(matched.map((r) => ({ before: r.pre!.total, after: r.post.total }))),
  };

  /* ── 영역(자기평가·상황판단·행동빈도) ──────────────────── */

  const sections: SectionChange[] = (['A', 'B', 'C'] as const).map((code) => {
    const preXs = preMembers.flatMap((m) => (m.sections[code] === null ? [] : [m.sections[code]!]));
    const postXs = responses.map((r) => r.post.sections[code]);
    return {
      code,
      label: SECTION_LABEL[code],
      pre: avg(preXs),
      post: avg(postXs),
      diff: delta(avg(postXs), avg(preXs)),
      welch: welchTTest(preXs, postXs),
    };
  });

  /* ── 역량 네 가지 ──────────────────────────────────────── */

  const competencies: CompetencyChange[] = MEMBER_COMPETENCIES.map((c) => {
    const key = COMPETENCY_OF[c.code];
    const preXs = preMembers.flatMap((m) =>
      m.competencies[key] === null ? [] : [m.competencies[key]!],
    );
    const postXs = responses.map((r) => r.post.competencies[key]);
    return {
      code: c.code,
      short: c.short,
      pre: avg(preXs),
      post: avg(postXs),
      diff: delta(avg(postXs), avg(preXs)),
      welch: welchTTest(preXs, postXs),
      paired: pairedTTest(
        matched.map((r) => ({
          before: r.pre!.competencies[key],
          after: r.post.competencies[key],
        })),
      ),
    };
  });

  /* ── 등급 분포 ─────────────────────────────────────────── */

  const emptyLevels = (): Record<LevelName, number> => ({
    입문: 0,
    초급: 0,
    중급: 0,
    고급: 0,
  });

  const distribute = (values: (number | null)[]): Record<LevelName, number> => {
    const out = emptyLevels();
    for (const v of values) {
      const name = levelOf(v) as LevelName | null;
      if (name) out[name] += 1;
    }
    return out;
  };

  const modeOf = (d: Record<LevelName, number>): LevelName | null => {
    const top = LEVEL_NAMES.reduce((a, b) => (d[b] > d[a] ? b : a), LEVEL_NAMES[0]);
    return d[top] > 0 ? top : null;
  };

  const levelRows: LevelDistribution[] = [
    {
      name: '종합',
      preValues: preMembers.map((m) => m.total),
      postValues: responses.map((r) => r.post.total as number | null),
    },
    ...MEMBER_COMPETENCIES.map((c) => ({
      name: c.short,
      preValues: preMembers.map((m) => m.competencies[c.code]),
      postValues: responses.map((r) => r.post.competencies[c.code] as number | null),
    })),
  ].map(({ name, preValues, postValues }) => {
    const pre = distribute(preValues);
    const post = distribute(postValues);
    return {
      name,
      pre,
      post,
      preN: LEVEL_NAMES.reduce((a, l) => a + pre[l], 0),
      postN: LEVEL_NAMES.reduce((a, l) => a + post[l], 0),
      preMode: modeOf(pre),
      postMode: modeOf(post),
    };
  });

  /* ── 하위 역량 12가지 ──────────────────────────────────── */

  const tags = pre.competencies.flatMap((c) =>
    c.tags.map((t) => {
      const post = tagAverages[t.code] ?? null;
      return {
        code: t.code,
        name: t.name,
        pre: t.avg,
        post,
        diff: t.avg === null || post === null ? null : round1(post - t.avg),
      };
    }),
  );

  /* ── 소속별 ────────────────────────────────────────────── */

  const departmentNames = [
    ...new Set([
      ...preMembers.map((m) => m.department ?? '미기재'),
      ...responses.map((r) => r.department ?? '미기재'),
    ]),
  ];

  const departmentRows = departmentNames
    .map((name) => {
      const preXs = preMembers
        .filter((m) => (m.department ?? '미기재') === name)
        .flatMap((m) => (m.total === null ? [] : [m.total]));
      const postXs = responses
        .filter((r) => (r.department ?? '미기재') === name)
        .map((r) => r.post.total);
      return {
        name,
        preN: preXs.length,
        postN: postXs.length,
        pre: avg(preXs),
        post: avg(postXs),
        diff: delta(avg(postXs), avg(preXs)),
      };
    })
    .sort((a, b) => b.preN + b.postN - (a.preN + a.postN));

  // 사후 응답자의 역량 네 가지를 소속별로 한꺼번에 본다.
  const manovaGroups = departmentNames.map((name) => ({
    name,
    rows: responses
      .filter((r) => (r.department ?? '미기재') === name)
      .map((r) => MEMBER_COMPETENCIES.map((c) => r.post.competencies[c.code])),
  }));

  // 같은 사람의 변화량을 소속별로. "어느 부서가 더 올랐나"를 묻는다.
  const changeGroups = departmentNames.map((name) =>
    matched
      .filter((r) => (r.department ?? '미기재') === name)
      .map((r) => r.post.total - r.pre!.total),
  );

  /* ── 프로필 유형 ───────────────────────────────────────── */

  const profileIds = [
    ...new Set([
      ...pre.profiles.map((p) => p.type as ProfileId),
      ...responses.map((r) => r.postProfile),
    ]),
  ];
  const preProfileTotal = pre.profiles.reduce((a, p) => a + p.n, 0);
  const postProfileTotal = responses.length;

  const profileRows: ProfileChange[] = profileIds.map((id) => {
    const preN = pre.profiles.find((p) => p.type === id)?.n ?? 0;
    const postN = responses.filter((r) => r.postProfile === id).length;
    const preShare = preProfileTotal === 0 ? 0 : (preN / preProfileTotal) * 100;
    const postShare = postProfileTotal === 0 ? 0 : (postN / postProfileTotal) * 100;
    return {
      id,
      name: PROFILE_NAMES[id] ?? id,
      preN,
      postN,
      preShare: round1(preShare)!,
      postShare: round1(postShare)!,
      diff: round1(postShare - preShare)!,
    };
  });

  const moveMap = new Map<string, number>();
  for (const r of matched) {
    if (!r.preProfile) continue;
    const key = `${r.preProfile}→${r.postProfile}`;
    moveMap.set(key, (moveMap.get(key) ?? 0) + 1);
  }
  const moves = [...moveMap].map(([key, n]) => {
    const [from, to] = key.split('→') as [ProfileId, ProfileId];
    return { from, to, n };
  });

  /* ── 격차 ──────────────────────────────────────────────── */

  const gapOf = (
    pick: (se: number, sj: number, bh: number) => number,
  ): { pre: number[]; post: number[] } => ({
    pre: preMembers.flatMap((m) => {
      const { A, B, C } = m.sections;
      return A === null || B === null || C === null ? [] : [pick(A, B, C)];
    }),
    post: responses.map((r) => pick(r.post.sections.A, r.post.sections.B, r.post.sections.C)),
  });

  const sr = gapOf((se, sj) => se - sj);
  const sb = gapOf((_se, sj, bh) => sj - bh);

  /*
    같은 사람의 격차 변화.

    이름이 이어진 사람만 모아 사전 격차와 사후 격차를 짝짓는다. 사전과 사후의
    응답자가 달라서 생긴 차이를 격차의 변화로 읽지 않으려면 이쪽이어야 한다.
  */
  const gapPairs = (
    pick: (se: number, sj: number, bh: number) => number,
  ): { before: number; after: number }[] =>
    matched.map((r) => ({
      before: pick(r.pre!.sections.A, r.pre!.sections.B, r.pre!.sections.C),
      after: pick(r.post.sections.A, r.post.sections.B, r.post.sections.C),
    }));

  const spreadOf = (xs: Record<MemberCompetency, number | null>): number | null => {
    const values = MEMBER_COMPETENCIES.flatMap((c) => (xs[c.code] === null ? [] : [xs[c.code]!]));
    return values.length < 2 ? null : round1(Math.max(...values) - Math.min(...values));
  };

  const preSpread = avg(
    preMembers.flatMap((m) => {
      const v = spreadOf(m.competencies);
      return v === null ? [] : [v];
    }),
  );
  const postSpread = avg(
    responses.flatMap((r) => {
      const v = spreadOf(r.post.competencies);
      return v === null ? [] : [v];
    }),
  );

  /* ── 만족도 ────────────────────────────────────────────── */

  const satisfactionRow = satisfactionList.find((s) => s.institutionId === institutionId);

  /*
    링크에서 회차를 골랐으면 그 회차만 본다. 고르지 않았으면 기업의 회차
    전부다 — 회차 선택을 넣기 전에 발급한 링크가 그렇다.

    만족도 합계도 고른 회차의 것으로 다시 센다. 기업 전체 평균을 그대로
    쓰면, 고르지 않은 회차의 응답이 섞여 들어간다.
  */
  const chosen = new Set(link.offerings.map((o) => o.offeringId));
  const scopedCourses =
    chosen.size === 0 ? courses : courses.filter((c) => chosen.has(c.offeringId));

  const scopedRespondents = scopedCourses.reduce((a, c) => a + c.respondents, 0);
  const scopedMean =
    chosen.size === 0
      ? (satisfactionRow?.mean ?? null)
      : (() => {
          const withMean = scopedCourses.filter((c) => c.mean !== null && c.respondents > 0);
          if (withMean.length === 0) return null;
          const total = withMean.reduce((a, c) => a + c.respondents, 0);
          const sum = withMean.reduce((a, c) => a + c.mean! * c.respondents, 0);
          return Math.round((sum / total) * 100) / 100;
        })();

  return {
    link,
    pre,
    preMembers,
    responses,
    matched,
    coverage: {
      preN: preMembers.length,
      postN: responses.length,
      matchedN: matched.length,
      rate:
        preMembers.length === 0 ? null : Math.round((responses.length / preMembers.length) * 100),
    },
    overall,
    sections,
    competencies,
    levels: levelRows,
    tags,
    department: {
      manovaPost: manova(
        manovaGroups,
        MEMBER_COMPETENCIES.map((c) => c.short),
      ),
      stats: departmentNames
        .map((name) => {
          const rows = responses.filter((x) => (x.department ?? '미기재') === name);
          return {
            name,
            n: rows.length,
            byCompetency: MEMBER_COMPETENCIES.map((c) => {
              const values = rows.map((x) => x.post.competencies[c.code]);
              return {
                code: c.code,
                short: c.short,
                mean: values.length === 0 ? null : round1(mean(values)),
                sd: values.length < 2 ? null : Math.round(sd(values) * 1000) / 1000,
              };
            }),
          };
        })
        .filter((d) => d.n > 0)
        .sort((a, b) => b.n - a.n),
      changeAnova: oneWayAnova(changeGroups),
      rows: departmentRows,
    },
    profile: {
      rows: profileRows.sort((a, b) => b.postShare - a.postShare),
      chi2: chiSquare([
        profileIds.map((id) => pre.profiles.find((p) => p.type === id)?.n ?? 0),
        profileIds.map((id) => responses.filter((r) => r.postProfile === id).length),
      ]),
      moves: moves.sort((a, b) => b.n - a.n),
      moved: matched.filter((r) => r.preProfile && r.preProfile !== r.postProfile).length,
      stayed: matched.filter((r) => r.preProfile && r.preProfile === r.postProfile).length,
    },
    gaps: {
      sr: {
        pre: avg(sr.pre),
        post: avg(sr.post),
        diff: delta(avg(sr.post), avg(sr.pre)),
        welch: welchTTest(sr.pre, sr.post),
        paired: pairedTTest(gapPairs((se, sj) => se - sj)),
      },
      sb: {
        pre: avg(sb.pre),
        post: avg(sb.post),
        diff: delta(avg(sb.post), avg(sb.pre)),
        welch: welchTTest(sb.pre, sb.post),
        paired: pairedTTest(gapPairs((_se, sj, bh) => sj - bh)),
      },
      spread: {
        pre: preSpread,
        post: postSpread,
        diff: preSpread === null || postSpread === null ? null : round1(postSpread - preSpread),
      },
    },
    satisfaction: {
      metrics,
      overall: scopedMean,
      respondents: chosen.size === 0 ? (satisfactionRow?.respondents ?? 0) : scopedRespondents,
      cohorts: chosen.size === 0 ? (satisfactionRow?.cohorts ?? 0) : scopedCourses.length,
      courses: scopedCourses,
      overviews,
      questions: questionResults.stars,
      choices,
      freeText: questionResults.freeText,
    },
  };
}
