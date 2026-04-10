import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import {
  HeroSection,
  AssessmentNeedSection,
  GrowthProcessSection,
  ConsultingCtaSection,
  AssessmentSystemSection,
  ProgressComparisonSection,
  OrganizationBenefitSection,
  FinalCtaSection,
} from './components/section';

export default function Home() {
  return (
    <Container>
      <CompassIcon className="absolute top-[100px] left-1/2 h-[300px] w-[272px] -translate-x-1/2 lg:h-[600px] lg:w-[543px]" />
      <HeroSection />
      <AssessmentNeedSection />
      <GrowthProcessSection />
      <ConsultingCtaSection />
      <AssessmentSystemSection />
      <ProgressComparisonSection />
      <OrganizationBenefitSection />
      <FinalCtaSection />
    </Container>
  );
}
