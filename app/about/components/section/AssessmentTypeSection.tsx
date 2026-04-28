import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AssessmentType = {
  title: string;
  descriptionLines: [string, string];
  recommendTitle: string;
  recommendItems: [string, string];
  ctaLabel: string;
  href: string;
  variant?: 'navy' | 'gray' | 'dark-blue' | 'purple' | 'pink';
};

const assessmentTypes: AssessmentType[] = [
  {
    title: '일반 검사',
    descriptionLines: [
      '개인용 진단으로 현재 AX 역량을 확인합니다.',
      '회원가입 없이 즉시 시작할 수 있습니다.',
    ],
    recommendTitle: '이런 분께 추천합니다.',
    recommendItems: [
      '빠르게 현재 수준을 점검하고 싶은 분',
      '결과를 바로 확인하고 학습 방향을 잡고 싶은 분',
    ],
    ctaLabel: '일반 검사 시작하기 →',
    href: '/assessment',
  },
  {
    title: '기관 검사',
    descriptionLines: [
      '기관용 정밀 분석과 결과 리포트를 제공합니다.',
      '기관 인증코드 입력 후 시작할 수 있습니다.',
    ],
    recommendTitle: '이런 기관에 추천합니다.',
    recommendItems: [
      '구성원 역량 현황을 기준으로 교육 설계를 하고 싶은 기관',
      '조직 단위 AX 역량 결과 리포트가 필요한 기관',
    ],
    ctaLabel: '기관 검사 시작하기 →',
    href: '/assessment',
    variant: 'dark-blue',
  },
];

export function AssessmentTypeSection() {
  return (
    <Section>
      <div className="flex w-full flex-col gap-[30px]">
        <div className="txt-t2">검사 유형 안내</div>
        <div className="flex flex-wrap gap-6">
          {assessmentTypes.map((item) => (
            <div key={item.title} className="flex min-w-[300px] flex-1 flex-col gap-[30px]">
              <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
                <div className="txt-st-bold">{item.title}</div>
                <div>
                  {item.descriptionLines[0]}
                  <br />
                  {item.descriptionLines[1]}
                </div>
                <div className="bg-purple-0 rounded-card p-3 shadow lg:p-5">
                  <div className="txt-st2-bold mb-1.5">{item.recommendTitle}</div>
                  <div className="ml-2">
                    <ul className="ml-4 flex list-outside list-disc flex-col">
                      <li>{item.recommendItems[0]}</li>
                      <li>{item.recommendItems[1]}</li>
                    </ul>
                  </div>
                </div>
                <Button
                  render={<Link href={item.href} />}
                  variant={item.variant}
                  className="w-fit"
                >
                  {item.ctaLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
