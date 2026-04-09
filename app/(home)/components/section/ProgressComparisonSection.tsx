import Image from 'next/image';
import Section from '@/components/layout/Section';
import { SectionHeader } from '../ui';

export function ProgressComparisonSection() {
  return (
    <Section>
      <SectionHeader
        title={
          <>
            <span className="text-purple-700">교육 전후 변화</span>를 객관적으로 비교해 보세요.
          </>
        }
        description={[
          'AX Compass는 학습 로드맵 진행 이후, 동일 구조의 유사 문항 기반 재진단을 통해',
          '교육 전후의 역량 변화를 객관적으로 비교·분석한 리포트를 제공합니다.',
        ]}
        as="h2"
      />
      <div className="flex max-w-[728px] flex-col gap-[50px]">
        <Image
          src="/images/main/img_compare_01.png"
          width={500}
          height={260}
          alt=""
          className="mx-auto aspect-50/26 h-full w-full max-w-[500px] object-cover"
        />
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]">
          <Image
            src="/images/main/img_compare_02.png"
            width={300}
            height={300}
            alt=""
            className="h-[300px] w-[300px] shrink-0 object-cover"
          />
          <div className="rounded-card border-special-navy-200 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 bg-white p-4 lg:gap-2.5">
            <div className="txt-st2-bold text-center">다면 진단 변화 비교</div>
            <div className="text-center">
              교육 전후 결과를 동일한 진단 구조 위에서 비교해,
              <br />
              자기 인식뿐 아니라 실제 판단과 실행 습관의 변화까지 입체적으로 확인할 수 있습니다.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-[50px]">
          <Image
            src="/images/main/img_compare_03.png"
            width={300}
            height={211}
            alt=""
            className="h-[211px] w-[300px] shrink-0 object-cover"
          />
          <div className="rounded-card border-special-navy-200 flex max-w-[380px] min-w-[320px] flex-1 shrink-0 flex-col gap-1.5 border-3 bg-white p-4 lg:gap-2.5">
            <div className="txt-st2-bold text-center">역량 분포 변화 비교</div>
            <div className="text-center">
              교육 전후의 역량 분포를 함께 시각화해,
              <br />
              단순 평균이 아니라 점수대 이동과 집단 수준의 변화 방향을 확인할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
      <div className="txt-st2-bold text-center">
        <span className="text-purple-700">*</span> AX Compass는 기관 단위 진단과 학습 로드맵, 교육
        전후 비교 분석을 통해
        <br />
        조직의 <span className="text-purple-700"> AX 역량 변화를 객관적으로 확인</span>할 수 있도록
        지원합니다.
        <br />
        <br />
        <span className="text-purple-700">*</span> 본 내용은{' '}
        <span className="text-purple-700">기관에 제공</span>되는 분석 예시입니다.
      </div>
    </Section>
  );
}
