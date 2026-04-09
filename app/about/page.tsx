import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeroSection } from './components/HeroSection';
import { OverviewSection } from './components/OverviewSection';
import { AssessmentTypeSection } from './components/AssessmentTypeSection';
import { QuestionTypeSection } from './components/QuestionTypeSection';
import { CompetencySection } from './components/CompetencySection';
import { ResultSection } from './components/ResultSection';
import { FaqSection } from './components/FaqSection';

export default function AboutPage() {
  return (
    <Container className="pt-[25px] pb-[100px] lg:pt-[50px]">
      <div className="mx-auto flex max-w-[728px] flex-col gap-[50px] lg:max-w-[1024px] lg:gap-[75px]">
        <HeroSection />
        <OverviewSection />
        <AssessmentTypeSection />
        <QuestionTypeSection />
        <CompetencySection />
        <ResultSection />
        <FaqSection />
        <div className="flex justify-center gap-4 lg:gap-6">
          <Button render={<Link href="/" />} variant="gray">
            메인으로
          </Button>
          <Button variant="purple">문의하기</Button>
        </div>
      </div>
    </Container>
  );
}
