import { Users, UserStar } from 'lucide-react';
import { AxResponseDonutChart } from '../AxResponseDonutChart';
import type { AxResponseStatusSection } from '../../../types/ax-report';

type AnalysisStatus = '분석 가능' | '참고 가능' | '탐색적 참고 가능';
type CriteriaKey = 'executive3' | 'member5' | 'member10';

const STATUS_STYLE: Record<AnalysisStatus, string> = {
  '분석 가능': 'bg-green-100 text-green-700',
  '참고 가능': 'bg-special-dark-blue-100 text-special-dark-blue-700',
  '탐색적 참고 가능': 'bg-special-dark-blue-100 text-special-dark-blue-700',
};

interface AnalysisItemConfig {
  readonly category: string;
  readonly content: string;
  readonly criteria: string;
  readonly criteriaKey: CriteriaKey;
  readonly alwaysExploratory: boolean;
}

const ANALYSIS_ITEMS: AnalysisItemConfig[] = [
  {
    category: '기관 AX 성숙도 분석',
    content: '현재 AX 성숙도, 목표 AX 성숙도, 현재-목표 Gap, 영역별 성숙도',
    criteria: '임원진/리더 3명 이상',
    criteriaKey: 'executive3',
    alwaysExploratory: false,
  },
  {
    category: '구성원 AX 역량 종합 분석',
    content: '전체 평균, 4대 역량 평균, 등급 분포, 목표 대비 Gap',
    criteria: '구성원 5명 이상',
    criteriaKey: 'member5',
    alwaysExploratory: false,
  },
  {
    category: '12개 세부 역량 평균',
    content: '세부 역량 평균, 순위, 강점·보완 역량, 편차',
    criteria: '구성원 10명 이상',
    criteriaKey: 'member10',
    alwaysExploratory: false,
  },
  {
    category: '세부 역량 간 연결성 분석',
    content: '세부 역량 간 상관 경향, 함께 강화되는 역량군',
    criteria: '구성원 10명 이상',
    criteriaKey: 'member10',
    alwaysExploratory: true,
  },
  {
    category: 'SE/SJ/BH Gap 분석',
    content: '자기평가, 상황판단, 행동빈도 평균 및 Gap',
    criteria: '구성원 5명 이상',
    criteriaKey: 'member5',
    alwaysExploratory: false,
  },
  {
    category: '프로필 유형 분석',
    content: '균형형, 과신형, 실행형, 판단형, 조심형, 이해형 분포',
    criteria: '구성원 5명 이상',
    criteriaKey: 'member5',
    alwaysExploratory: false,
  },
];

interface AxResponseStatusPageProps {
  data: AxResponseStatusSection;
}

export function AxResponseStatusPage({ data }: AxResponseStatusPageProps) {
  const executiveCount = data.executiveExamCount;
  const memberCount = data.memberExamCount;

  const criteriaMet: Record<CriteriaKey, boolean> = {
    executive3: executiveCount >= 3,
    member5: memberCount >= 5,
    member10: memberCount >= 10,
  };

  const analysisStatuses: AnalysisStatus[] = ANALYSIS_ITEMS.map((item) => {
    if (item.alwaysExploratory) return '탐색적 참고 가능';
    return criteriaMet[item.criteriaKey] ? '분석 가능' : '참고 가능';
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">03</div>
        <div className="txt-b-bold">응답 현황 및 분석 가능 범위</div>
        <div className="txt-c2-regular">
          진단 참여 현황과 응답 규모를 바탕으로 각 분석 결과를 어느 수준까지
          해석할 수 있는지 안내합니다.
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">응답 현황</div>
        <div className="flex items-center justify-between px-[50px]">
          <div className="bg-special-dark-blue-0 flex w-[100px] min-w-[100px] shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] px-2 py-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <UserStar className="text-special-dark-blue-700 size-10" />
            <div className="txt-c2-regular">임원진 응답</div>
            <div className="txt-b-bold">{executiveCount}</div>
          </div>
          <AxResponseDonutChart
            executiveCount={executiveCount}
            memberCount={memberCount}
          />
          <div className="bg-special-dark-blue-0 flex w-[100px] min-w-[100px] shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] px-2 py-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
            <Users className="text-special-dark-blue-700 size-10" />
            <div className="txt-c2-regular">구성원 응답</div>
            <div className="txt-b-bold">{memberCount}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">분석 신뢰도 수준</div>
        <div className="txt-c2-bold flex flex-col overflow-hidden rounded-[8px]">
          <div className="bg-special-dark-blue-100 flex items-center">
            <div className="w-[140px] min-w-[140px] shrink-0 px-2 py-1.5 text-center">
              분석 구분
            </div>
            <div className="flex-1 px-2 py-1.5 text-center">내용</div>
            <div className="w-[120px] min-w-[100px] shrink-0 px-2 py-1.5 text-center">
              권장 기준
            </div>
            <div className="w-[120px] min-w-[120px] shrink-0 px-2 py-1.5 text-center">
              분석 적용
            </div>
          </div>
          {ANALYSIS_ITEMS.map((item, i) => (
            <div
              key={item.category}
              className="bg-special-dark-blue-0 txt-c2-regular flex items-center"
            >
              <div className="flex h-[36px] w-[140px] min-w-[140px] shrink-0 items-center justify-center px-2">
                {item.category}
              </div>
              <div className="flex h-[36px] flex-1 items-center px-2 text-center">
                {item.content}
              </div>
              <div className="flex h-[36px] w-[120px] min-w-[120px] shrink-0 items-center justify-center px-2 text-center">
                {item.criteria}
              </div>
              <div className="flex h-[36px] w-[120px] min-w-[120px] shrink-0 items-center justify-center px-2 text-center">
                <span
                  className={`txt-c2-bold inline-block rounded-full px-1 py-0.5 ${STATUS_STYLE[analysisStatuses[i]!]}`}
                >
                  {analysisStatuses[i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-special-navy-500 txt-c2-regular rounded-[12px] p-3 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        본 보고서의 세부 역량 간 연결성 분석과 집단별 비교 분석은 현재 응답 완료
        데이터를 기준으로 한 탐색적 참고 분석입니다. 해당 결과는 원인관계를
        의미하지 않으며, 응답 수가 확대될수록 해석 안정성과 신뢰도가 높아집니다.
      </div>
    </div>
  );
}
