import type { Institution, OfferingForIssue, PreOrg } from '@/types/reference';

/**
 * 사후검사를 발급할 때 고르는 것들. 운영 기관 → 교육 운영 건 → 학습 기업 순.
 * 조회는 hooks/useIssueOptions 가 모아 넘긴다. (원본 lib/issue-options.ts 의 순수 부분)
 */
export interface IssueCompany {
  institutionId: number;
  name: string;
  code: string | null;
  /** SafariOn 영문명. 검사 주소(/after/…)를 만드는 데 쓴다. */
  englishName: string | null;
  /** 사전검사 응시자. 사후검사 대상 인원이자 응답률의 분모다. */
  preRespondents: number;
  /**
   * 이미 링크가 나가 있는가.
   *
   * 막지는 않는다. 다른 과정을 또 들으면 그 과정의 사후검사를 따로
   * 보내야 한다. 다만 모르고 두 번 보내는 일이 없도록 표시는 한다.
   */
  issued: boolean;
  /** 지금 고를 수 있는가. */
  eligible: boolean;
  /** 고를 수 없다면 왜인가. 이미 발급한 경우에는 주의 문구가 들어간다. */
  reason: string | null;
}

export interface IssueOffering {
  offeringId: string;
  title: string;
  cohortNumber: number | null;
  startDate: string | null;
  endDate: string | null;
  enrolled: number;
  /** 만족도 응답 수와 별점 평균. 수집 전이면 0 / null. */
  respondents: number;
  mean: number | null;
  /** 이 건에 연결된 학습 기업. 비어 있으면 담당자가 직접 고른다. */
  companies: IssueCompany[];
}

export interface IssueOperator {
  institutionId: number;
  name: string;
  code: string | null;
  offerings: IssueOffering[];
}

export interface IssueOptions {
  operators: IssueOperator[];
  /**
   * 직접 고를 때 쓰는 기업 목록.
   *
   * 사전검사를 치른 기업만 담는다. 사전이 없으면 견줄 상대가 없어 사후검사를
   * 받아도 향상도를 낼 수 없다.
   */
  companies: IssueCompany[];
}

export function buildIssueOptions(
  preOrgs: PreOrg[],
  institutions: Institution[],
  offerings: OfferingForIssue[],
  /** 진행 중(open) 링크가 있는 기업 번호 */
  issuedIds: Set<number>,
): IssueOptions {
  const preById = new Map(preOrgs.map((o) => [o.institutionId, o]));
  const institutionById = new Map(institutions.map((i) => [i.id, i]));

  const toCompany = (institutionId: number): IssueCompany => {
    const institution = institutionById.get(institutionId);
    const pre = preById.get(institutionId);
    const preRespondents = pre?.respondents ?? 0;
    const issued = issuedIds.has(institutionId);
    return {
      institutionId,
      name: institution?.name ?? pre?.name ?? `기관 ${institutionId}`,
      code: institution?.code ?? pre?.code ?? null,
      englishName: institution?.englishName ?? null,
      preRespondents,
      issued,
      eligible: preRespondents > 0,
      reason:
        preRespondents === 0
          ? '사전검사 응답이 없습니다'
          : issued
            ? '이미 진행 중인 검사가 있습니다 (주소가 따로 생깁니다)'
            : null,
    };
  };

  const byOperator = new Map<number, IssueOperator>();
  for (const o of offerings) {
    let operator = byOperator.get(o.operatorId);
    if (!operator) {
      const institution = institutionById.get(o.operatorId);
      operator = {
        institutionId: o.operatorId,
        name: o.operatorName,
        code: institution?.code ?? null,
        offerings: [],
      };
      byOperator.set(o.operatorId, operator);
    }
    operator.offerings.push({
      offeringId: o.offeringId,
      title: o.title,
      cohortNumber: o.cohortNumber,
      startDate: o.startDate,
      endDate: o.endDate,
      enrolled: o.enrolled,
      respondents: o.respondents,
      mean: o.mean,
      companies: o.learningCompanyIds.map(toCompany),
    });
  }

  const companies = preOrgs
    .filter((o) => o.respondents > 0)
    .map((o) => toCompany(o.institutionId))
    .sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.preRespondents - a.preRespondents);

  const operators = [...byOperator.values()].sort(
    (a, b) => b.offerings.length - a.offerings.length || a.name.localeCompare(b.name),
  );

  return { operators, companies };
}
