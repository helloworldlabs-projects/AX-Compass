import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';

export function FinalCtaSection() {
  return (
    <Section>
      <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
        <h2 className="txt-t1 text-shadow text-center">
          이제,
          <span className="text-special-pink-600"> AX 역량</span>을 직접 확인해 보세요.
        </h2>
        <p className="text-shadow flex flex-col gap-1 text-center">
          <span>
            AX 역량을 빠르게 진단하고, 역량 프로필 기반으로 필요한 AI 학습 방향을 확인하세요.
          </span>
        </p>
      </div>
      <Button className="txt-st-bold h-20 lg:h-[130px]">검사 유형 선택 →</Button>
    </Section>
  );
}
