import { Modal, ModalContent, ModalTitle } from '@/components/ui/Modal';

interface ProfileTypeStatGuideModalProps {
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

export function ProfileTypeStatGuideModal({ open, onClose }: ProfileTypeStatGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-[760px]">
      <ModalTitle>프로필 유형 통계 가이드</ModalTitle>

      <ModalContent className="gap-8">
        <GuideSection title="한눈에 보기">
          <div className="txt-b-regular flex flex-col gap-3 text-black">
            <p>
              프로필 유형 통계는 기관 구성원의 응답을 SE, SJ, BH 패턴과 갭 지표를 기준으로 분류해,
              조직 내 AI 활용 성향 프로필 분포를 보여줍니다.
              <br />
              점수의 높고 낮음보다, 조직에서 AI가 어떤 방식으로 활용되고 있는지와 인식·판단·실행의
              균형을 이해하는 데 초점이 있습니다.
              <br />
              프로필 유형은 다음 여섯 가지로 구분됩니다.
            </p>
            <ul className="list-disc pl-5">
              <li>균형형, 과신형, 실행형, 판단형, 조심형, 이해형</li>
            </ul>
          </div>
        </GuideSection>

        <GuideSection title="해석 방법">
          <ol className="txt-b-regular list-decimal pl-5 text-black">
            <li>
              균형형 비중이 높은 경우: 인식·판단·실행이 비교적 안정적으로 맞물려 확산과 정착을
              진행하기 유리합니다.
            </li>
            <li>
              과신형 비중이 높은 경우: 자기평가 대비 판단과 실행이 낮게 나타날 수 있어, 품질 기준과
              리스크 관리, 검증 루틴 점검이 유효합니다.
            </li>
            <li>
              실행형 비중이 높은 경우: 사용 빈도는 높지만 검증과 판단이 약해질 수 있어, 결과 품질을
              안정화하는 장치가 중요합니다. 예를 들면 체크리스트와 가이드가 도움이 됩니다.
            </li>
            <li>
              판단형 비중이 높은 경우: 판단은 가능하지만 실제 사용이 낮아, 적용 정착을 위한 운영
              설계가 필요할 수 있습니다. 템플릿 제공, 실습, 과제 운영이 도움이 됩니다.
            </li>
            <li>
              조심형 비중이 높은 경우: 사용 장벽이 높을 수 있어, 안전한 시작 방식과 작은 성공 경험
              중심의 운영이 유리합니다.
            </li>
            <li>
              이해형 비중이 높은 경우: 한 방향으로 치우침이 크지 않아, 역량 분포와 함께 보며 교육과
              운영의 우선순위를 정하는 것이 좋습니다.
            </li>
          </ol>
        </GuideSection>

        <GuideSection title="활용 포인트">
          <ul className="txt-b-regular list-disc pl-5 text-black">
            <li>프로필 분포는 교육 주제 선택뿐 아니라, 운영 방식 설계에도 참고하기 좋습니다.</li>
            <li>
              가이드와 템플릿 제공, 실습과 과제 운영, 검증 체계 구성 등에서 어디에 무게를 둘지
              판단할 수 있습니다.
            </li>
            <li>
              또한 조직 내 확산 전략을 세울 때, 어떤 집단에 먼저 힘을 싣고 어디를 보완할지 결정하는
              기준으로 활용할 수 있습니다.
            </li>
          </ul>
        </GuideSection>
      </ModalContent>
    </Modal>
  );
}
