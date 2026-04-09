import Container from '@/components/layout/Container';
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

export default function AboutPage() {
  return (
    <Container>
      <div className="mx-auto flex max-w-[728px] flex-col gap-[50px] lg:max-w-[1024px] lg:gap-[75px]">
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
  );
}
