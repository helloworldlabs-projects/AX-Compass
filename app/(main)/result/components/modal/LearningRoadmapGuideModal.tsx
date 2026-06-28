'use client';

import { Modal, ModalContent, ModalTitle } from '@/components/ui/Modal';

interface LearningRoadmapGuideModalProps {
  open: boolean;
  onClose: () => void;
}

function LearningRoadmapGuideModal({ open, onClose }: LearningRoadmapGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-[760px]">
      <ModalTitle>추천 학습 로드맵 가이드</ModalTitle>
      <ModalContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <p className="txt-st-bold">
              <span className="text-red-500">* </span>
              한눈에 보기
            </p>
            <div className="flex flex-col">
              <p className="txt-b-regular">
                추천 학습 로드맵은 진단 결과와 향후 기대 사항 정보를 바탕으로 Step 1~3 흐름으로
                제시됩니다.
              </p>
              <p className="txt-b-regular">
                각 단계에는 추천 커리큘럼과 프로필 유형별 학습 Tip이 함께 제공되어, 지금 무엇부터
                시작하면 좋을지 쉽게 결정할 수 있습니다.
              </p>
              <p className="txt-b-regular">
                Step 1부터 Step 3까지는 기반 다지기 → 실무 적용 → 확장과 고도화 순서로 진행됩니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="txt-st-bold">
              <span className="text-red-500">* </span>
              해석 방법
            </p>
            <ul className="txt-b-regular flex list-outside list-disc flex-col pl-5">
              <li>
                Step 1~3 흐름은 학습의 순서를 뜻합니다. Step 1에서 기본기를 정리하고, Step 2에서
                실제 업무에 적용하며, Step 3에서 더 넓은 범위로 확장하는 방식입니다.
              </li>
              <li>
                로드맵에 포함된 커리큘럼은 트리 도식화로 제공되어, 현재 단계에서 다루는 내용과 다음
                학습 경로를 한눈에 확인할 수 있습니다.
              </li>
              <li>
                추천은 정답이 아니라 효율적인 시작 순서를 제안하는 방식이므로, 현재 업무 상황에 맞춰
                우선순위를 조정해도 됩니다.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="txt-st-bold">
              <span className="text-red-500">* </span>
              활용 포인트
            </p>
            <ul className="txt-b-regular flex list-outside list-disc flex-col pl-5">
              <li>처음이라면 Step 1을 먼저 완료한 뒤 Step 2로 넘어가는 것이 가장 안정적입니다.</li>
              <li>
                Step 2부터는 본인의 업무 유형을 고려하여 작은 적용 과제로 시작하면 정착이 빠릅니다.
              </li>
            </ul>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export { LearningRoadmapGuideModal };
