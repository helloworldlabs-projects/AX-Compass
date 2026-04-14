import { Modal, ModalContent, ModalTitle } from '@/components/ui/Modal';

interface GradeStatGuideModalProps {
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

export function GradeStatGuideModal({ open, onClose }: GradeStatGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-[760px]">
      <ModalTitle>역량 등급 통계 가이드</ModalTitle>

      <ModalContent className="gap-6">
        <GuideSection title="한눈에 보기">
          <p className="txt-b-regular text-black">
            역량 등급 통계는 기관 구성원이 4대 역량에서 입문, 초급, 중급, 고급에 어떻게 분포하는지
            보여줍니다.
            <br />
            4대 역량은 이해, 활용, 평가·개선, 책임·거버넌스로 구성됩니다.
            <br />
            역량별로 강점과 보완이 필요한 영역이 어디인지 빠르게 확인할 수 있습니다.
          </p>
        </GuideSection>

        <GuideSection title="해석 방법">
          <ul className="txt-b-regular list-disc pl-5 text-black">
            <li>입문과 초급 비중이 높은 역량은 기관 공통 보완 과제로 볼 수 있습니다.</li>
            <li>
              중급 비중이 높은 역량은 실무 적용은 가능하지만 표준화와 정착이 부족할 수 있습니다.
            </li>
            <li>
              고급 비중이 있는 역량은 내부 확산에 활용할 수 있는 기반이 있음을 의미합니다. 예를 들면
              템플릿 공유, 사례 전파, 코칭이 포함됩니다.
            </li>
            <li>
              역량별 분포 차이가 큰 경우에는 직무나 업무 환경 차이가 영향을 준 결과일 수 있습니다.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="활용 포인트">
          <ul className="txt-b-regular list-disc pl-5 text-black">
            <li>기관 교육 주제 우선순위를 정할 때 가장 먼저 참고하기 좋은 지표입니다.</li>
            <li>
              어떤 주제부터 시작할지와 기초, 실무, 심화 중 어디에 무게를 둘지를 결정하는 기준으로
              활용할 수 있습니다.
            </li>
          </ul>
        </GuideSection>
      </ModalContent>
    </Modal>
  );
}
