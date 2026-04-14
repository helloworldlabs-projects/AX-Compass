import { Modal, ModalContent, ModalTitle } from '@/components/ui/Modal';

interface ScoreStatGuideModalProps {
  open: boolean;
  onClose: () => void;
}

function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="txt-st-bold font-bold text-black">
        <span className="text-special-pink-500">* </span>
        {title}
      </div>
      {children}
    </section>
  );
}

export function ScoreStatGuideModal({ open, onClose }: ScoreStatGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-[760px]">
      <ModalTitle>역량 점수 통계(전체 평균) 가이드</ModalTitle>

      <ModalContent className="gap-8">
        <GuideSection title="한눈에 보기">
          <div className="txt-b-regular flex flex-col text-black">
            <p>
              기관 역량 점수 통계는 기관 구성원의 응답을 집계해, 각 역량을 자기 평가(SE), 상황
              판단(SJ), 행동 빈도(BH) 3개 축의 전체 평균(0~100)으로 보여줍니다.
              <br />이 영역의 목적은 기관이 강한지 약한지를 단정하기보다는, 조직 수준에서
              인식·판단·실행 중 어느 관점이 상대적으로 낮은지를 확인하는 것입니다.
            </p>
            <ul className="list-disc pl-5">
              <li>SE(자기 평가): 구성원이 느끼는 체감과 자기인식(인식)</li>
              <li>SJ(상황 판단): 상황에서의 판단 기준과 정확도(판단)</li>
              <li>BH(행동 빈도): 직급 업무에서의 적용 습관과 실행 수준(실행)</li>
            </ul>
            <p>또한 아래 갭 지표로 조직의 패턴을 빠르게 읽을 수 있습니다.</p>
            <ul className="list-disc pl-5">
              <li>Gap_SR = SE − SJ</li>
              <li>Gap_SB = SJ − BH</li>
            </ul>
          </div>
        </GuideSection>

        <GuideSection title="해석 방법">
          <ol className="txt-b-regular list-decimal pl-5 text-black">
            <li>
              <span>기관의 역량 점수와 등급은 3개 축 평균을 함께 반영해 해석합니다.</span>
              <ul className="list-disc pl-5">
                <li>
                  기관의 최종 역량 점수와 등급은 특정 축 하나만으로 판단하지 않으며, SE, SJ, BH의
                  평균을 함께 보면서 인식·판단·실행 관점에서 조직의 현재 상태를 종합적으로
                  해석합니다.
                </li>
                <li>
                  SE는 인식 수준, SJ는 판단 역량, BH는 현장 적용 수준을 의미합니다. 따라서 기관
                  결과는 특정 요소 하나의 높고 낮음보다, 전반적인 균형과 축 간 격차를 함께 살피는
                  것이 중요합니다.
                </li>
              </ul>
            </li>
            <li>
              <span>
                갭 지표는 운영 관점에서 원인을 추정하고 우선순위를 설정하기 위한 참고 정보입니다.
              </span>
              <ul className="list-disc pl-5">
                <li>
                  갭은 조직의 문제를 단정하기 위한 값이 아니라, 어떤 영역에서 보완과 개선이
                  필요한지를 판단하는 데 활용합니다.
                </li>
                <li>
                  Gap_SR(+)가 큰 경우: 인식 수준(SE)은 높지만, 판단 역량(SJ)은 상대적으로 낮게
                  나타난 패턴으로 해석할 수 있습니다.
                </li>
                <li>
                  Gap_SR(-)가 큰 경우: 판단 역량(SJ)은 비교적 높지만, 인식 수준(SE)은 상대적으로
                  낮게 나타난 패턴으로 해석할 수 있습니다.
                </li>
                <li>
                  Gap_SB(+)가 큰 경우: 판단 역량(SJ)에 비해 현장 적용 수준(BH)이 상대적으로 낮게
                  나타난 패턴으로 해석할 수 있습니다.
                </li>
                <li>
                  Gap_SB(-)가 큰 경우: 현장 적용 수준(BH)은 비교적 높지만, 판단 역량(SJ)은
                  상대적으로 낮게 나타난 패턴으로 해석할 수 있습니다.
                </li>
              </ul>
            </li>
          </ol>
        </GuideSection>

        <GuideSection title="활용 포인트">
          <ul className="txt-b-regular list-disc pl-5 text-black">
            <li>
              기관 등급 통계가 약한 영역을 보여준다면, 점수 통계는 그렇게 보이는 이유를 확인하는 데
              도움이 됩니다.
            </li>
            <li>
              교육 콘텐츠뿐 아니라 운영 방식도 함께 설계할 때 참고할 수 있습니다. 예를 들면 실습과
              과제 구성, 템플릿 적용, 검증 기준과 정책 안내 등이 포함됩니다.
            </li>
            <ul className="list-disc pl-5">
              <li>
                Gap_SR(+)가 큰 경우: 판단과 검증 중심 훈련 비중을 높이는 구성이 효과적일 수
                있습니다.
              </li>
              <li>
                Gap_SR(-)가 큰 경우: 표준 가이드와 성공 사례 중심으로 체감 수준을 높이는 구성이
                효과적일 수 있습니다.
              </li>
              <li>
                Gap_SB(+)가 큰 경우: 과제와 템플릿 기반의 실행 루틴 중심 운영이 효과적일 수
                있습니다.
              </li>
              <li>
                Gap_SB(-)가 큰 경우: 검증 기준과 보안·정책 안내를 함께 강화하는 구성이 효과적일 수
                있습니다.
              </li>
            </ul>
          </ul>
        </GuideSection>
      </ModalContent>
    </Modal>
  );
}
