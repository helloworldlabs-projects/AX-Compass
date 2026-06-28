export * from './axReport';
import type {
  AxCoreSummarySection,
  AxResponseStatusSection,
  AxExecutiveMaturitySection,
  AxFourPerspectiveSection,
  AxMemberCompetencyAnalysisSection,
  AxMemberCompetencyLevelSection,
  AxMemberCompetencyDetailSection,
  AxMemberCompetencyMultiFacetSection,
  AxProfileSection,
  AxInsightSection,
  AxTagCorrelationSection,
  AxReportAnalysisInsight,
  AxReportDetail,
} from './axReport';

export type AxPageData =
  | { type: 'ax_cover'; data: { completedAt: string | null } }
  | { type: 'ax_summary'; data: AxCoreSummarySection }
  | { type: 'ax_overview' }
  | { type: 'ax_response_status'; data: AxResponseStatusSection }
  | { type: 'ax_maturity_basic'; data: AxExecutiveMaturitySection }
  | { type: 'ax_maturity_detail'; data: AxFourPerspectiveSection }
  | { type: 'ax_competency_basic'; data: AxMemberCompetencyAnalysisSection }
  | { type: 'ax_grade_distribution'; data: AxMemberCompetencyLevelSection }
  | { type: 'ax_detail_competency'; data: AxMemberCompetencyDetailSection }
  | { type: 'ax_multi_dimension'; data: AxMemberCompetencyMultiFacetSection }
  | { type: 'ax_correlation'; data: AxTagCorrelationSection }
  | { type: 'ax_profile'; data: AxProfileSection }
  | { type: 'ax_conclusion'; data: AxInsightSection };

export function getAxInsightContent(
  insights: AxReportAnalysisInsight[],
  index: number,
): string {
  return insights[index]?.content ?? '';
}

export function buildAxPageData(detail: AxReportDetail): AxPageData[] {
  const { analysis } = detail;
  return [
    { type: 'ax_cover', data: { completedAt: detail.completedAt } },
    { type: 'ax_summary', data: analysis.coreSummarySection },
    { type: 'ax_overview' },
    { type: 'ax_response_status', data: analysis.responseStatusSection },
    { type: 'ax_maturity_basic', data: analysis.executiveMaturitySection },
    { type: 'ax_maturity_detail', data: analysis.fourPerspectiveSection },
    { type: 'ax_competency_basic', data: analysis.memberCompetencyAnalysisSection },
    { type: 'ax_grade_distribution', data: analysis.memberCompetencyLevelSection },
    { type: 'ax_detail_competency', data: analysis.memberCompetencyDetailSection },
    { type: 'ax_multi_dimension', data: analysis.memberCompetencyMultiFacetSection },
    { type: 'ax_correlation', data: analysis.tagCorrelationSection },
    { type: 'ax_profile', data: analysis.profileSection },
    { type: 'ax_conclusion', data: analysis.insightSection },
  ];
}
