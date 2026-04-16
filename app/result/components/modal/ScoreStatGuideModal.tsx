'use client';

import { Modal, ModalContent, ModalTitle } from '@/components/ui/Modal';

interface ScoreStatGuideModalProps {
  open: boolean;
  onClose: () => void;
  resultType: 'general' | 'member';
}

function ScoreStatGuideModal({ open, onClose, resultType }: ScoreStatGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-[760px]">
      <ModalTitle>역량 점수 통계 가이드</ModalTitle>
      <ModalContent>
        {resultType === 'member' ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <p className="txt-st-bold">
                <span className="text-red-500">* </span>
                한눈에 보기
              </p>
              <div className="flex flex-col">
                <p className="txt-b-regular">
                  각 역량을 자기 평가(SE), 상황 판단(SJ), 행동 빈도(BH) 3개 축으로 나눠
                  점수(0~100)로 보여줍니다.
                </p>
                <p className="txt-b-regular">
                  이 영역의 목적은 역량이 낮은지 높은지를 단순 판단하기보다, 어느 관점에서 점수가
                  형성되었는지를 확인하는 것입니다.
                </p>
                <ul className="txt-b-regular list-outside list-disc pl-5">
                  <li>SE(자기 평가): 체감과 자기인식(인식)</li>
                  <li>SJ(상황 판단): 상황에서의 판단 기준과 정확도(판단)</li>
                  <li>BH(행동 빈도): 실제 사용 습관과 실행(실행)</li>
                </ul>
                <div className="txt-b-regular">
                  <div>또한 아래 갭 지표로 패턴을 빠르게 읽을 수 있습니다.</div>
                  <ul className="list-outside list-disc pl-5">
                    <li>Gap_SR = SE − SJ</li>
                    <li>Gap_SB = SJ − BH</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="txt-st-bold">
                <span className="text-red-500">* </span>
                해석 방법
              </p>
              <ol className="txt-b-regular flex list-outside list-decimal flex-col pl-5">
                <li>
                  각 역량 점수와 등급은 3개 축을 함께 반영해 결정됩니다.
                  <ul className="flex list-outside list-disc flex-col pl-5">
                    <li>
                      각 역량의 최종 점수와 등급은 특정 축 하나만으로 결정되지 않으며, SE, SJ, BH가
                      함께 반영되어 인식·판단·실행 관점에서 종합적으로 해석됩니다.
                    </li>
                    <li>
                      SE는 자기 인식과 자신감, SJ는 판단의 정확도, BH는 실제 적용 수준을 나타냅니다.
                      따라서 최종 점수는 한 요소만 높게 나타나는지보다, 전반적인 균형과 축 간 격차를
                      함께 살펴보는 것이 중요합니다.
                    </li>
                  </ul>
                </li>
                <li>
                  갭 지표는 최종 점수를 보다 구체적으로 이해하기 위한 참고 정보입니다.
                  <ul className="flex list-outside list-disc flex-col pl-5">
                    <li>
                      갭은 좋고 나쁨을 단정하기 위한 값이 아니라, 어떤 방식으로 점수가
                      형성되었는지를 해석하는 데 활용합니다.
                    </li>
                    <li>
                      Gap_SR(+)가 큰 경우: 자기 인식과 자신감(SE)은 높지만, 판단의 정확도(SJ)는
                      상대적으로 낮게 나타난 패턴으로 해석할 수 있습니다.
                    </li>
                    <li>
                      Gap_SR(−)가 큰 경우: 판단의 정확도(SJ)는 비교적 높지만, 자기 인식과
                      자신감(SE)은 상대적으로 낮게 나타난 패턴으로 해석할 수 있습니다.
                    </li>
                    <li>
                      Gap_SB(+)가 큰 경우: 판단의 정확도(SJ)에 비해 실제 적용 수준(BH)이 상대적으로
                      낮게 나타난 패턴으로 해석할 수 있습니다.
                    </li>
                    <li>
                      Gap_SB(−)가 큰 경우: 실제 적용 수준(BH)은 비교적 높지만, 판단의 정확도(SJ)는
                      상대적으로 낮게 나타난 패턴으로 해석할 수 있습니다.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-4">
              <p className="txt-st-bold">
                <span className="text-red-500">* </span>
                활용 포인트
              </p>
              <ul className="txt-b-regular flex list-outside list-disc flex-col gap-2 pl-5">
                <li>
                  이 통계는 약한 영역을 찾기보다, 왜 그렇게 보이는지를 설명하는 데 도움을 줍니다.
                </li>
                <li>
                  추천 로드맵을 선택할 때도 최종 점수뿐 아니라 갭 패턴을 함께 보면, 더 현실적인 학습
                  방향을 잡을 수 있습니다.
                </li>
                <ul className="flex list-outside list-disc flex-col pl-5">
                  <li>
                    Gap_SR(+)가 큰 경우: 판단과 검증 중심 훈련 비중을 높이는 구성이 효과적일 수
                    있습니다.
                  </li>
                  <li>
                    Gap_SR(−)가 큰 경우: 표준 가이드와 성공 사례 중심으로 체감 수준을 높이는 구성이
                    효과적일 수 있습니다.
                  </li>
                  <li>
                    Gap_SB(+)가 큰 경우: 과제와 템플릿 기반의 실행 루틴 중심 운영이 효과적일 수
                    있습니다.
                  </li>
                  <li>
                    Gap_SB(−)가 큰 경우: 검증 기준과 보안·정책 안내를 함께 강화하는 구성이 효과적일
                    수 있습니다.
                  </li>
                </ul>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <p className="txt-st-bold">
                <span className="text-red-500">* </span>
                한눈에 보기
              </p>
              <div className="flex flex-col">
                <p className="txt-b-regular">
                  각 역량은 자기 평가(SE), 상황 판단(SJ), 행동 빈도(BH) 3개 축으로 나뉜 레이더
                  그래프로 보여줍니다.
                </p>
                <p className="txt-b-regular">
                  이 영역의 목적은 점수 하나를 보기보다, 한 역량 안에서 어떤 축이 상대적으로 높고
                  낮은지 확인하는 것입니다.
                </p>
                <ul className="txt-b-regular list-outside list-disc pl-5">
                  <li>SE(자기 평가): 체감과 자기인식(인식)</li>
                  <li>SJ(상황 판단): 상황에서의 판단 기준과 정확도(판단)</li>
                  <li>BH(행동 빈도): 실제 사용 습관과 실행(실행)</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="txt-st-bold">
                <span className="text-red-500">* </span>
                해석 방법
              </p>
              <div className="flex flex-col">
                <p className="txt-b-regular">
                  각 역량 점수와 등급은 3개 축을 함께 반영해 결정됩니다.
                </p>
                <ul className="txt-b-regular flex list-outside list-disc flex-col pl-5">
                  <li>
                    각 역량의 최종 점수와 등급은 특정 축 하나만으로 결정되지 않으며, SE, SJ, BH가
                    함께 반영되어 인식·판단·실행 관점에서 종합적으로 해석됩니다.
                  </li>
                  <li>
                    SE는 자기 인식과 자신감, SJ는 판단의 정확도, BH는 실제 적용 수준을 나타냅니다.
                    따라서 최종 점수는 한 요소만 높게 나타나는지보다, 전반적인 균형과 축 간 격차를
                    함께 살펴보는 것이 중요합니다.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="txt-st-bold">
                <span className="text-red-500">* </span>
                활용 포인트
              </p>
              <ul className="txt-b-regular flex list-outside list-disc flex-col pl-5">
                <li>이 통계는 어떤 역량부터 먼저 보완할지 우선순위를 정하는 데 도움을 줍니다.</li>
                <li>
                  점수가 낮은 역량은 기초부터 차근차근 보완이 필요한 영역으로, 점수가 높은 역량은
                  현재 강점으로 활용할 수 있습니다.
                </li>
                <li>
                  추천 로드맵을 볼 때는 가장 낮은 역량만 보기보다, 전체 역량의 균형과 현재 업무
                  필요성을 함께 고려하는 것이 좋습니다.
                </li>
                <li>
                  이해가 낮다면 기초 학습부터, 활용이 낮다면 실습 중심으로, 평가·개선이나
                  책임·거버넌스가 낮다면 검토 기준과 안전한 활용 방식까지 함께 보완하는 구성이
                  효과적일 수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

export { ScoreStatGuideModal };
