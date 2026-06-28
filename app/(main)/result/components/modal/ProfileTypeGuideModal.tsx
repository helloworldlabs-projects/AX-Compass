'use client';

import { Modal, ModalContent, ModalTitle } from '@/components/ui/Modal';

interface ProfileTypeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

function ProfileTypeGuideModal({ open, onClose }: ProfileTypeGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-[760px]">
      <ModalTitle>프로필 유형 가이드</ModalTitle>
      <ModalContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <p className="txt-st-bold">
              <span className="text-red-500">* </span>
              한눈에 보기
            </p>
            <div className="flex flex-col">
              <p className="txt-b-regular">
                프로필 유형은 SE, SJ, BH 응답 패턴을 바탕으로, 내가 AI를 활용할 때 어떤 방식으로
                접근하는지를 보여줍니다.
              </p>
              <p className="txt-b-regular">
                점수 자체보다 인식·판단·실행의 균형과 활용 습관을 이해하고, 개선 방향을 잡는 데
                도움이 됩니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="txt-st-bold">
              <span className="text-red-500">* </span>
              해석 방법
            </p>
            <ol className="txt-b-regular flex list-outside list-decimal flex-col pl-5">
              <li>
                균형형: 판단과 실행이 비교적 안정적으로 맞물려 있습니다. 현재 방식을 유지하면서
                확장하기 유리합니다.
              </li>
              <li>
                과신형: 스스로 느끼는 수준에 비해 판단과 실행이 낮게 나타날 수 있습니다. 검증 기준과
                실행 루틴을 함께 보완하는 것이 좋습니다.
              </li>
              <li>
                실행형: 사용 빈도는 높지만 검증이 약해질 수 있습니다. 결과 품질을 점검하는
                체크리스트를 함께 두는 것이 좋습니다.
              </li>
              <li>
                판단형: 판단은 가능하지만 실제 사용이 낮을 수 있습니다. 템플릿과 실습 과제로 적용을
                습관화하는 방식이 도움이 됩니다.
              </li>
              <li>
                조심형: 안전하게 접근하는 편이라, 작은 성공 경험부터 단계적으로 확장하는 방식이
                유리합니다.
              </li>
              <li>
                이해형: 한쪽으로 치우침이 크지 않습니다. 역량 상세 결과를 함께 보며 구체적인 학습
                우선순위를 정하는 것이 좋습니다.
              </li>
            </ol>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="txt-st-bold">
              <span className="text-red-500">* </span>
              활용 포인트
            </p>
            <ul className="txt-b-regular flex list-outside list-disc flex-col pl-5">
              <li>프로필 유형은 정답이 아니라 현재의 경향을 보여주는 참고 정보입니다.</li>
              <li>
                추천 로드맵을 선택할 때, 프로필 특성에 맞춰 무엇을 먼저 강화할지 결정하는 데 활용할
                수 있습니다.
              </li>
              <li>
                예를 들면 실습 강화, 템플릿 활용, 검증 루틴 정립 중에서 우선순위를 정하는
                방식입니다.
              </li>
            </ul>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export { ProfileTypeGuideModal };
