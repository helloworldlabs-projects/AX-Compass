const COMPETENCY_ITEMS = [
  {
    tag: 'A',
    name: 'AI/LLM 작동 원리 이해 역량',
    definition:
      'AI/LLM의 기본 구조와 동작 흐름(입력 → 추론 → 출력)을 이해하고, 어떤 과업에 강한지와 약한지를 설명합니다.',
  },
  {
    tag: 'B',
    name: '생성형 AI 오류·리스크 이해 역량',
    definition:
      '환각, 편향, 최신성 한계를 이해하고, 사실·법무·대외문서 등에서 위험이 커지는 상황을 구분합니다.',
  },
  {
    tag: 'C',
    name: '컨텍스트·제약에 따른 결과 변동 이해 역량',
    definition:
      '프롬프트, 컨텍스트, 제약 조건 변화가 결과에 미치는 영향을 이해하고, 변동 원인을 설명하거나 예측합니다.',
  },
  {
    tag: 'D',
    name: '프롬프트·요구사항 명세화 역량',
    definition:
      '목표, 입력, 제약, 출력 형식을 명확히 정의해 요청을 구성하고, 재현 가능한 형태로 정리합니다.',
  },
  {
    tag: 'E',
    name: '업무 유스케이스 선정·적용 설계 역량',
    definition:
      '업무 과제를 AI 적용 대상으로 선별하고, 적용 위치, 산출물, 검증 방식까지 포함해 업무 흐름에 맞게 설계합니다.',
  },
  {
    tag: 'F',
    name: '워크플로우·도구 조합 운영 역량',
    definition:
      '템플릿과 도구 조합으로 반복 사용을 표준화하고, 자동화(단계화·연결) 수준을 점진적으로 높입니다.',
  },
  {
    tag: 'G',
    name: 'AI 출력 사실·근거 검증 역량',
    definition:
      '핵심 주장, 수치, 정책 등 검증 포인트를 식별하고, 근거 확인과 교차 검증으로 신뢰도를 확보합니다.',
  },
  {
    tag: 'H',
    name: 'AI 결과 품질 기준 평가 역량',
    definition:
      '정확성, 누락, 논리, 형식, 톤 기준으로 결과를 평가하고, 사용 가능 여부와 수정 범위를 판단합니다.',
  },
  {
    tag: 'I',
    name: '실험·피드백 기반 반복 개선 역량',
    definition:
      '비교 생성(A/B), 조건 조정, 실패 케이스 반영 등으로 결과를 개선하고, 재사용 가능한 규칙으로 축적합니다.',
  },
  {
    tag: 'J',
    name: 'AI 데이터 보안·개인정보 처리 역량',
    definition:
      '개인정보와 기밀을 익명화·최소화하고, 도구 사용 범위와 권한 경계를 지켜 안전하게 처리합니다.',
  },
  {
    tag: 'K',
    name: 'AI 저작권·윤리 리스크 대응 역량',
    definition:
      '저작권, 표절, 편향, 책임 이슈를 인지하고, 출처 표기, 검토, 대체 방식으로 리스크를 예방합니다.',
  },
  {
    tag: 'L',
    name: 'AI 운영 거버넌스 준수 역량',
    definition:
      '조직의 정책, 승인된 도구, 데이터 경계, 로그·감사 기준을 준수하고, 운영 관점에서 통제 가능하게 적용합니다.',
  },
] as const;

export function AxOverviewPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">02</div>
        <div className="txt-b-bold">진단 개요 및 해석 기준</div>
        <div className="txt-c2-regular">
          AX Compass의 진단 구조와 성숙도·역량 평가 체계를 안내하고, 결과를
          이해하는 데 필요한 세부 역량 기준을 설명합니다.
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col rounded-[12px] px-2 py-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-c2-bold text-special-orange-700 bg-special-orange-100 mb-1 w-fit rounded-[20px] px-1 py-0.5">
            Maturity
          </div>
          <div className="txt-c1-bold mb-2">AX 성숙도 검사</div>
          <div className="txt-c2-regular">
            임원진·리더를 대상으로{' '}
            <span className="txt-c2-bold">조직의 AX 성숙도 수준</span>을
            확인합니다. 도입·활용·통합·혁신 단계로 해석합니다.
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-[12px] px-2 py-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-c2-bold text-special-dark-blue-700 bg-special-dark-blue-100 mb-1 w-fit rounded-[20px] px-1 py-0.5">
            Competency
          </div>
          <div className="txt-c1-bold mb-2">AX 역량 검사</div>
          <div className="txt-c2-regular">
            구성원을 대상으로{' '}
            <span className="txt-c2-bold">
              이해, 활용, 평가·개선, 책임·거버넌스
            </span>{' '}
            역량을 다면적으로 분석합니다.
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-[12px] px-2 py-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
          <div className="txt-c2-bold mb-1 w-fit rounded-[20px] bg-green-100 px-1 py-0.5 text-green-700">
            Action
          </div>
          <div className="txt-c1-bold mb-2">교육·컨설팅 연결</div>
          <div className="txt-c2-regular">
            진단 결과를 바탕으로 보완 역량, 교육 우선순위, 프로필별 학습 전략을
            도출합니다.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">AX 진단 세부 역량</div>
        <div className="txt-c2-bold flex flex-col overflow-hidden rounded-[8px]">
          <div className="bg-special-dark-blue-100 flex items-center">
            <div className="w-[40px] min-w-[40px] shrink-0 px-2 py-1.5 text-center">
              Tag
            </div>
            <div className="w-[220px] min-w-[220px] shrink-0 px-2 py-1.5 text-center">
              세부 역량
            </div>
            <div className="flex-1 px-2 py-1.5 text-center">역량 정의</div>
          </div>
          {COMPETENCY_ITEMS.map((item) => (
            <div
              key={item.tag}
              className="bg-special-dark-blue-0 flex items-center"
            >
              <div className="txt-c2-regular flex h-[36px] w-[40px] min-w-[40px] shrink-0 items-center justify-center">
                {item.tag}
              </div>
              <div className="txt-c2-bold flex h-[36px] w-[220px] min-w-[220px] shrink-0 items-center px-2">
                {item.name}
              </div>
              <div className="txt-c2-regular flex h-[36px] flex-1 items-center px-2">
                {item.definition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
