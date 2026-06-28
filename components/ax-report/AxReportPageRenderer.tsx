'use client';

import type { AxPageData } from '../../types/ax-report';
import { AxReportPageLayout } from './pages/AxReportPageLayout';
import { AxCoverPage } from './pages/AxCoverPage';
import { AxSummaryPage } from './pages/AxSummaryPage';
import { AxOverviewPage } from './pages/AxOverviewPage';
import { AxResponseStatusPage } from './pages/AxResponseStatusPage';
import { AxMaturityBasicPage } from './pages/AxMaturityBasicPage';
import { AxMaturityDetailPage } from './pages/AxMaturityDetailPage';
import { AxCompetencyBasicPage } from './pages/AxCompetencyBasicPage';
import { AxGradeDistributionPage } from './pages/AxGradeDistributionPage';
import { AxDetailCompetencyPage } from './pages/AxDetailCompetencyPage';
import { AxMultiDimensionPage } from './pages/AxMultiDimensionPage';
import { AxCorrelationPage } from './pages/AxCorrelationPage';
import { AxProfilePage } from './pages/AxProfilePage';
import { AxConclusionPage } from './pages/AxConclusionPage';

interface AxReportPageRendererProps {
  page: AxPageData;
  institutionLogoUrl: string;
  institutionName: string;
  isLastPage?: boolean;
}

export function AxReportPageRenderer({
  page,
  institutionLogoUrl,
  institutionName,
  isLastPage,
}: AxReportPageRendererProps) {
  if (page.type === 'ax_cover') {
    return (
      <>
        <AxCoverPage
          institutionName={institutionName}
          completedAt={page.data.completedAt}
        />
      </>
    );
  }

  return (
    <>
      <AxReportPageLayout
        institutionLogoUrl={institutionLogoUrl}
        isLastPage={isLastPage}
      >
        {(() => {
          switch (page.type) {
            case 'ax_summary':
              return <AxSummaryPage data={page.data} />;
            case 'ax_overview':
              return <AxOverviewPage />;
            case 'ax_response_status':
              return <AxResponseStatusPage data={page.data} />;
            case 'ax_maturity_basic':
              return <AxMaturityBasicPage data={page.data} />;
            case 'ax_maturity_detail':
              return <AxMaturityDetailPage data={page.data} />;
            case 'ax_competency_basic':
              return <AxCompetencyBasicPage data={page.data} />;
            case 'ax_grade_distribution':
              return <AxGradeDistributionPage data={page.data} />;
            case 'ax_detail_competency':
              return <AxDetailCompetencyPage data={page.data} />;
            case 'ax_multi_dimension':
              return <AxMultiDimensionPage data={page.data} />;
            case 'ax_correlation':
              return <AxCorrelationPage data={page.data} />;
            case 'ax_profile':
              return <AxProfilePage data={page.data} />;
            case 'ax_conclusion':
              return <AxConclusionPage data={page.data} />;
          }
        })()}
      </AxReportPageLayout>
    </>
  );
}
