import Container from '@/components/layout/Container';
import SectionNav from '@/components/layout/SectionNav';
import {
  HeroSection,
  OverviewSection,
  AssessmentTypeSection,
  QuestionTypeSection,
  CompetencySection,
  ResultSection,
  FaqSection,
  CtaSection,
} from './components/section';
import { CompassIcon } from '@/components/icons/CompassIcon';

const NAV_GROUPS = [
  {
    items: [
      { label: '검사 개요', targetId: 'ax-overview' },
      { label: '검사 유형', targetId: 'ax-assessment-type' },
      { label: '문항 유형', targetId: 'ax-question-type' },
      { label: '역량 설계', targetId: 'ax-competency' },
      { label: '검사 결과', targetId: 'ax-result' },
      { label: 'FAQ', targetId: 'ax-faq' },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <SectionNav groups={NAV_GROUPS} />
      <Container>
        <div className="mx-auto flex max-w-[728px] flex-col gap-[50px] lg:max-w-[1024px] lg:gap-[75px]">
          <CompassIcon className="absolute top-[100px] left-1/2 h-[300px] w-[272px] -translate-x-1/2 lg:h-[600px] lg:w-[543px]" />
          <HeroSection />
          <OverviewSection />
          <AssessmentTypeSection />
          <QuestionTypeSection />
          <CompetencySection />
          <ResultSection />
          <FaqSection />
          <CtaSection />
        </div>
      </Container>
    </>
  );
}
