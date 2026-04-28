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
import { CompassIcon } from '@/components/icons/CompassIcon';

export default function AboutPage() {
  return (
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
  );
}
