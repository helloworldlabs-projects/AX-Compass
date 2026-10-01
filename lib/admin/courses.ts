import raw from '@/lib/admin/data/courses.json';
import type { MemberCompetency } from '@/lib/admin/metrics';
import type { ProfileId } from '@/lib/admin/ax-scoring';

/**
 * 중소기업 프리미엄 교육과정 21개.
 *
 * 과정명·시간·대상·목표는 운영 자료(`db/seed/courses.json`)에서 그대로 읽는다.
 * 손으로 옮겨 적으면 과정이 바뀔 때 보고서가 옛 이름을 말하게 된다.
 *
 * 여기서 더하는 것은 **추천에 쓸 꼬리표**뿐이다 — 이 과정이 어느 역량과 어느
 * 하위 역량을 건드리는지, 어떤 수준에 맞는지, 어떤 직무를 향하는지.
 * 꼬리표는 교과목 편성표의 단원을 읽고 붙였고, 판단이 갈리는 자리에는
 * 근거를 주석으로 남긴다.
 */

/** 과정 묶음. 보고서에서 "어떤 성격의 과정인가"를 말할 때 쓴다. */
export type Family =
  | '진단'
  | '맞춤 처방'
  | '역량 강화'
  | '조직 확산'
  | '직무별 키트'
  | '주제별 레시피';

export type Level = '입문' | '초급' | '중급' | '고급';

export interface Course {
  no: number;
  title: string;
  /** 대괄호 앞부분을 뗀 짧은 이름. 표에 넣을 때 쓴다. */
  shortTitle: string;
  online: boolean;
  hours: number;
  days: number;
  goal: string;
  audience: string;
  summary: string;

  family: Family;
  /** 이 과정이 주로 끌어올리는 역량. */
  competencies: MemberCompetency[];
  /** 하위 역량 코드(a~l). 보고서의 12개와 같은 기호다. */
  tags: string[];
  /** 이 수준의 구성원에게 맞는다. */
  levels: Level[];
  /** 이 유형이 많을 때 특히 잘 듣는다. */
  profiles: ProfileId[];
  /** 부서 이름에 이 말이 들어가면 직무가 맞는다고 본다. */
  roleKeywords: string[];
  /** 성숙도 4대 관점 중 이 과정이 미는 곳. */
  maturityViews: ('전략·리더십' | '운영체계·확산' | '업무·적용' | '데이터·시스템 기반')[];
  /** 교육 뒤 무엇이 달라지는지. 보고서의 기대 효과 문장이 된다. */
  effect: string;
}

interface RawCourse {
  no: number;
  title: string;
  online: boolean;
  hours: number;
  days: number;
  goal: string;
  audience: string;
  summary: string;
}

/**
 * 과정별 꼬리표.
 *
 * 하위 역량 기호는 사전검사와 같다 —
 * a 작동원리 · b 오류·리스크 · c 결과 변동 (이해)
 * d 프롬프트 명세화 · e 유스케이스 설계 · f 워크플로우 운영 (활용)
 * g 사실 검증 · h 품질 평가 · i 반복 개선 (평가·개선)
 * j 보안·개인정보 · k 저작권·윤리 · l 거버넌스 (책임)
 */
const TAGS: Record<number, Omit<Course, keyof RawCourse | 'shortTitle'>> = {
  1: {
    family: '진단',
    competencies: ['UNDERSTAND'],
    tags: ['a'],
    levels: ['입문'],
    profiles: [],
    roleKeywords: [],
    maturityViews: ['전략·리더십'],
    effect: '조직의 현재 수준을 수치로 확인하고 목표를 합의합니다.',
  },
  2: {
    family: '맞춤 처방',
    competencies: ['UNDERSTAND', 'USE_AND_APPLY'],
    tags: ['a', 'b', 'c', 'd', 'e'],
    levels: ['입문', '초급'],
    profiles: ['CAUTIOUS', 'LEARNER'],
    roleKeywords: ['기획', '마케팅', '전략', '신사업'],
    maturityViews: ['전략·리더십', '업무·적용'],
    effect:
      'AI의 작동 원리와 한계를 이해한 뒤 시장 기회를 찾는 단계까지 다룹니다. 이해가 활용으로 이어지지 않을 때 그 사이를 메우는 과정입니다.',
  },
  3: {
    family: '맞춤 처방',
    competencies: ['UNDERSTAND', 'USE_AND_APPLY'],
    tags: ['a', 'b', 'c', 'd', 'e', 'f'],
    levels: ['입문', '초급'],
    profiles: ['CAUTIOUS', 'LEARNER'],
    roleKeywords: [],
    maturityViews: ['업무·적용'],
    effect:
      '자기 업무를 단계별로 나누어 AI가 맡을 수 있는 부분을 찾습니다. 프롬프트와 유스케이스 설계가 약할 때 효과가 가장 빠르게 나타납니다.',
  },
  4: {
    family: '역량 강화',
    competencies: ['USE_AND_APPLY'],
    tags: ['e', 'f'],
    levels: ['초급', '중급'],
    profiles: ['DOER', 'BALANCED'],
    roleKeywords: ['기획', '마케팅', '전략', '신사업'],
    maturityViews: ['업무·적용', '데이터·시스템 기반'],
    effect:
      '노코드 도구로 실제 동작하는 자동화를 만듭니다. 워크플로우 운영 수준이 낮은 조직이 바로 쓸 수 있는 결과물을 얻습니다.',
  },
  5: {
    family: '역량 강화',
    competencies: ['USE_AND_APPLY'],
    tags: ['d', 'e', 'f'],
    levels: ['초급', '중급'],
    profiles: ['DOER', 'BALANCED'],
    roleKeywords: ['기획', '전략', '경영', '사무'],
    maturityViews: ['업무·적용'],
    effect:
      '이미 사용 중인 오피스 도구 안에서 자동화를 구성합니다. 새 도구를 도입하기 어려운 조직에 부담이 적습니다.',
  },
  6: {
    family: '역량 강화',
    competencies: ['USE_AND_APPLY', 'EVALUATE'],
    tags: ['e', 'h', 'i'],
    levels: ['중급', '고급'],
    profiles: ['ANALYST', 'BALANCED'],
    roleKeywords: ['기획', '전략', '신사업'],
    maturityViews: ['업무·적용', '전략·리더십'],
    effect:
      '복잡한 판단이 필요한 업무를 시뮬레이션합니다. 결과를 평가하고 수정하는 역량이 함께 향상됩니다.',
  },
  7: {
    family: '역량 강화',
    competencies: ['USE_AND_APPLY'],
    tags: ['f'],
    levels: ['초급', '중급'],
    profiles: ['DOER', 'BALANCED'],
    roleKeywords: [],
    maturityViews: ['업무·적용', '운영체계·확산'],
    effect: '반복 업무를 에이전트로 전환해 전사 단위의 비용을 줄입니다.',
  },
  8: {
    family: '역량 강화',
    competencies: ['USE_AND_APPLY'],
    tags: ['f'],
    levels: ['초급', '중급'],
    profiles: ['DOER', 'LEARNER'],
    roleKeywords: ['경영', '총무', '인사', '사무', '지원'],
    maturityViews: ['업무·적용'],
    effect: '문서 작성과 커뮤니케이션이 반복되는 업무를 자동화합니다.',
  },
  9: {
    family: '역량 강화',
    competencies: ['USE_AND_APPLY', 'RESPONSIBLE'],
    tags: ['f', 'j', 'l'],
    levels: ['초급', '중급'],
    profiles: ['LEARNER', 'BALANCED'],
    roleKeywords: [],
    maturityViews: ['데이터·시스템 기반', '운영체계·확산'],
    effect:
      '분산된 사내 지식을 AI가 활용할 수 있는 형태로 모읍니다. 보안과 권한 기준을 함께 다루어 책임 역량도 향상됩니다.',
  },
  10: {
    family: '조직 확산',
    competencies: ['EVALUATE', 'RESPONSIBLE'],
    tags: ['h', 'i', 'l'],
    levels: ['중급', '고급'],
    profiles: ['OVERCONFIDENT', 'ANALYST'],
    roleKeywords: ['팀장', '관리', '리더'],
    maturityViews: ['운영체계·확산', '전략·리더십'],
    effect:
      '사람과 AI의 업무 분담 방식을 조직의 규칙으로 정리합니다. 개인의 활용이 부서 단위로 확산되지 않을 때 적합합니다.',
  },
  11: {
    family: '진단',
    competencies: ['RESPONSIBLE', 'EVALUATE'],
    tags: ['i', 'j', 'k', 'l'],
    levels: ['중급', '고급'],
    profiles: ['OVERCONFIDENT'],
    roleKeywords: ['팀장', '관리', '리더'],
    maturityViews: ['운영체계·확산', '전략·리더십'],
    effect:
      '개인이 만든 결과물을 회사의 자산으로 정리하고, 안전하게 사용하는 규칙을 마련합니다. 활용은 늘었으나 관리 체계가 부족할 때 필요합니다.',
  },
  12: {
    family: '직무별 키트',
    competencies: ['USE_AND_APPLY'],
    tags: ['d', 'e'],
    levels: ['입문', '초급'],
    profiles: ['LEARNER', 'CAUTIOUS'],
    roleKeywords: ['마케팅', '브랜드', '홍보', '콘텐츠'],
    maturityViews: ['업무·적용'],
    effect: '고객 반응 데이터를 콘텐츠와 캠페인 성과로 연결합니다.',
  },
  13: {
    family: '직무별 키트',
    competencies: ['USE_AND_APPLY'],
    tags: ['d', 'e'],
    levels: ['입문', '초급'],
    profiles: ['LEARNER', 'CAUTIOUS'],
    roleKeywords: ['경영', '총무', '인사', '사무', '지원', '운영'],
    maturityViews: ['업무·적용'],
    effect: '반복되는 문서·자료 처리를 AI로 전환합니다.',
  },
  14: {
    family: '직무별 키트',
    competencies: ['USE_AND_APPLY'],
    tags: ['d', 'e'],
    levels: ['입문', '초급'],
    profiles: ['LEARNER', 'CAUTIOUS'],
    roleKeywords: ['영업', '고객', 'CS', '세일즈'],
    maturityViews: ['업무·적용'],
    effect: '고객 의견을 구조화해 제안서와 대응안으로 정리합니다.',
  },
  15: {
    family: '직무별 키트',
    competencies: ['USE_AND_APPLY', 'EVALUATE'],
    tags: ['e', 'g'],
    levels: ['입문', '초급'],
    profiles: ['LEARNER', 'CAUTIOUS'],
    roleKeywords: ['생산', '품질', '공정', '설비', '제조'],
    maturityViews: ['업무·적용', '데이터·시스템 기반'],
    effect: '현장 데이터에서 원인 가설과 개선 대책을 도출합니다.',
  },
  16: {
    family: '직무별 키트',
    competencies: ['USE_AND_APPLY'],
    tags: ['e', 'f'],
    levels: ['초급', '중급'],
    profiles: ['DOER', 'BALANCED'],
    roleKeywords: ['개발', '엔지니어', 'QA', 'IT', '기술', 'lxp'],
    maturityViews: ['업무·적용', '데이터·시스템 기반'],
    effect: '코딩·테스트·리뷰의 반복 작업을 에이전트로 전환합니다.',
  },
  17: {
    family: '직무별 키트',
    competencies: ['RESPONSIBLE', 'EVALUATE'],
    tags: ['i', 'l'],
    levels: ['초급', '중급'],
    profiles: ['ANALYST', 'OVERCONFIDENT'],
    roleKeywords: ['팀장', '관리', '리더', '부서'],
    maturityViews: ['운영체계·확산', '전략·리더십'],
    effect: '팀의 병목 구간을 파악해 도입 과제와 우선순위를 정합니다.',
  },
  18: {
    family: '주제별 레시피',
    competencies: ['RESPONSIBLE', 'USE_AND_APPLY'],
    tags: ['f', 'j'],
    levels: ['초급', '중급'],
    profiles: ['BALANCED', 'ANALYST'],
    roleKeywords: ['데이터', 'DX', '기획'],
    maturityViews: ['데이터·시스템 기반'],
    effect: '분산된 업무 자료를 AI가 활용할 수 있는 기준으로 정리합니다.',
  },
  19: {
    family: '주제별 레시피',
    competencies: ['USE_AND_APPLY'],
    tags: ['d', 'e'],
    levels: ['입문', '초급'],
    profiles: ['CAUTIOUS', 'LEARNER'],
    roleKeywords: [],
    maturityViews: ['업무·적용'],
    effect:
      '자기 업무에 쓸 작은 AI 앱을 직접 만들어 봅니다. 배운 내용이 실제 사용으로 이어지지 않는 조직에 첫 적용 경험을 제공합니다.',
  },
  20: {
    family: '주제별 레시피',
    competencies: ['USE_AND_APPLY', 'EVALUATE'],
    tags: ['e', 'f', 'i'],
    levels: ['초급', '중급'],
    profiles: ['DOER', 'BALANCED'],
    roleKeywords: [],
    maturityViews: ['업무·적용', '운영체계·확산'],
    effect: '개인의 활용 방식을 팀이 공유하는 업무 절차로 정착시킵니다.',
  },
  21: {
    family: '주제별 레시피',
    competencies: ['USE_AND_APPLY', 'RESPONSIBLE'],
    tags: ['f', 'j', 'l'],
    levels: ['중급', '고급'],
    profiles: ['DOER', 'ANALYST'],
    roleKeywords: ['데이터', '개발', 'DX', '기술'],
    maturityViews: ['데이터·시스템 기반', '운영체계·확산'],
    effect:
      '자율적으로 동작하는 에이전트를 구축하고 권한·보안 기준까지 함께 정합니다. 자동화는 갖췄으나 관리 체계가 없을 때 이어서 수강하기에 적합합니다.',
  },
};

/** 대괄호 안의 분류를 떼고 과정 본이름만 남긴다. */
function shorten(title: string): string {
  const m = title.match(/^\[[^\]]+\]\s*(.+)$/);
  return m ? m[1] : title;
}

export const COURSES: Course[] = (raw as RawCourse[]).map((c) => ({
  ...c,
  shortTitle: shorten(c.title),
  ...TAGS[c.no],
}));

export function findCourse(no: number): Course | undefined {
  return COURSES.find((c) => c.no === no);
}
