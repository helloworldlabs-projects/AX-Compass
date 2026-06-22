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
  ReportHeroSection,
  InstitutionRollingBanner,
  AssessmentStatsSection,
  AssessmentSupportCtaSection,
  CuponSection,
  TestimonialSection,
  ResultReportSection,
} from './components/section';
import SectionNav from '@/components/layout/SectionNav';

const NAV_GROUPS = [
  {
    items: [
      { label: 'AX 검사 필요성', targetId: 'assessment-need' },
      { label: 'AX 성장 로직', targetId: 'growth-process' },
      { label: 'AX 검사 시스템', targetId: 'assessment-system' },
      { label: '검사 전·후 비교', targetId: 'progress-comparison' },
    ],
  },
];

export default function Home() {
  return (
    <>
      <SectionNav groups={NAV_GROUPS} />
      <ReportHeroSection />
      <Container className="rounded-t-none">
        <CompassIcon className="absolute top-[100px] left-1/2 h-[300px] w-[272px] -translate-x-1/2 lg:h-[600px] lg:w-[543px]" />

        <InstitutionRollingBanner />
        <AssessmentStatsSection />
        <AssessmentSupportCtaSection />
        <HeroSection />
        <CuponSection />
        {/* <AssessmentNeedSection /> */}
        {/* <GrowthProcessSection /> */}
        {/* <ConsultingCtaSection /> */}
        {/* <AssessmentSystemSection /> */}
        {/* <ProgressComparisonSection /> */}
        {/* <OrganizationBenefitSection /> */}
        <TestimonialSection />
        <ResultReportSection />
        <FinalCtaSection />
      </Container>
    </>
  );
}
