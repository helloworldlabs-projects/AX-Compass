import { Modal, ModalContent, ModalTitle } from '@/components/ui/Modal';

interface LearningRoadmapGuideModalProps {
  open: boolean;
  onClose: () => void;
}

function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="txt-st-bold font-bold text-black">
        <span className="text-special-pink-500">* </span>
        {title}
      </div>
      {children}
    </section>
  );
}

export function LearningRoadmapGuideModal({ open, onClose }: LearningRoadmapGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-[760px]">
      <ModalTitle>기관 추천 학습 로드맵 가이드</ModalTitle>

      <ModalContent className="gap-8">
        <GuideSection title="한눈에 보기">
          <p className="txt-b-regular text-black">
            기관 추천 로드맵은 기관 구성원의 &quot;AI를 활용해 보고 싶은 업무 유형&quot;을 기준으로
            제시됩니다.
            <br />각 주제는 Step 1~3 흐름으로 구성되며, 단계별 추천 커리큘럼과 프로필 유형별 학습
            Tip을 함께 제공합니다.
            <br />
            Step 1부터 Step 3까지는 기반 다지기 → 실무 적용 → 확장과 고도화 순서로 진행됩니다.
          </p>
        </GuideSection>

        <GuideSection title="해석 방법">
          <ul className="txt-b-regular list-disc pl-5 text-black">
            <li>
              Step 1~3 흐름은 학습의 순서를 뜻합니다. Step 1에서 기본기를 정리하고, Step 2에서 실제
              업무에 적용하며, Step 3에서 더 넓은 범위로 확장하는 방식입니다.
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
        </GuideSection>

        <GuideSection title="활용 포인트">
          <ul className="txt-b-regular list-disc pl-5 text-black">
            <li>
              Step 1을 공통 기반 과정으로 묶고 Step 2부터 주제별 트랙으로 분기하면 운영이 수월해질
              수 있습니다.
            </li>
            <li>
              Step 2부터는 기업 구성원의 업무 유형을 고려하여 작은 적용 과제로 시작하면 정착이
              빠릅니다.
            </li>
          </ul>
        </GuideSection>
      </ModalContent>
    </Modal>
  );
}
