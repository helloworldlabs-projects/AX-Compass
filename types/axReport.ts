export type AxReportStatus = 'DRAFT' | 'COMPLETED';

export type AxReportType = 'STANDALONE' | 'AGGREGATE';

export type AxMaturityStage = 'INITIATION' | 'UTILIZATION' | 'INTEGRATION' | 'INNOVATION';

export type AxSkillLevel = 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED';

export type AxProfileType =
  | 'BALANCED'
  | 'OVERCONFIDENT'
  | 'DOER'
  | 'ANALYST'
  | 'CAUTIOUS'
  | 'LEARNER';

export type AxExecCompetencyCode =
  | 'EXEC_ADOPTION'
  | 'EXEC_GOVERNANCE'
  | 'EXEC_DATA_SYSTEM'
  | 'EXEC_STRATEGY';

export type AxMemberCompetencyCode = 'UNDERSTAND' | 'USE_AND_APPLY' | 'EVALUATE' | 'RESPONSIBLE';

export interface AxReportAnalysisInsight {
  title: string;
  content: string;
}

export interface AxTagItem {
  tagCode: string;
  tagName: string;
}

export interface AxTagWithScore extends AxTagItem {
  avgScore: number;
}

export interface AxTagRanking {
  rank: number;
  tagCode: string;
  tagName: string;
  score: number;
  level: AxSkillLevel;
  deviation: number | null;
}

export interface AxCoreSummarySection {
  top3StrengthTags: AxTagItem[];
  top3WeaknessTags: AxTagItem[];
  top3ProfileTypes: AxProfileType[];
  avgCurrentMaturityStage: AxMaturityStage;
  avgTargetMaturityStage: AxMaturityStage;
  memberAxAvg: number;
  memberAxGap: number | null;
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxResponseStatusSection {
  memberExamCount: number;
  executiveExamCount: number;
}

export interface AxExecutiveMaturitySection {
  avgCurrentMaturityStage: AxMaturityStage;
  avgTargetMaturityStage: AxMaturityStage;
  avgCurrentMaturityScore: number;
  avgTargetMaturityScore: number;
  gapMs: number;
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxFourPerspectiveScore {
  competencyCode: AxExecCompetencyCode;
  currentScore: number;
  targetScore: number;
  gap: number;
  improvementPriority: string;
}

export interface AxFourPerspectiveSection {
  competencyScores: AxFourPerspectiveScore[];
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxMemberCompetencyScore {
  competencyCode: AxMemberCompetencyCode;
  currentScore: number;
  targetScore: number | null;
  gap: number | null;
  achievementRate: number | null;
}

export interface AxMemberCompetencyAnalysisSection {
  competencies: AxMemberCompetencyScore[];
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxLevelCounts {
  ADVANCED: number;
  BEGINNER: number;
  ELEMENTARY: number;
  INTERMEDIATE: number;
}

export interface AxMemberCompetencyLevel {
  competencyCode: AxMemberCompetencyCode;
  dominantLevel: AxSkillLevel;
  levelCounts: AxLevelCounts;
}

export interface AxMemberCompetencyLevelSection {
  competencies: AxMemberCompetencyLevel[];
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxMemberCompetencyDetailSection {
  top3StrengthTags: AxTagWithScore[];
  top3WeaknessTags: AxTagWithScore[];
  tagRankings: AxTagRanking[];
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxMemberCompetencyMultiFacetSection {
  seAvg: number;
  sjAvg: number;
  bhAvg: number;
  gapSrAvg: number;
  gapSbAvg: number;
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxProfileSection {
  topProfileType: AxProfileType;
  profileCounts: Partial<Record<AxProfileType, number>>;
  profileRatios: Partial<Record<AxProfileType, number>>;
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxInsightSection {
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxTagCorrelation {
  tagCode1: string;
  tagName1: string;
  tagCode2: string;
  tagName2: string;
  correlationCoefficient: number;
  interpretation: string;
}

export interface AxCorrelationMatrixItem {
  tagCode1: string;
  tagCode2: string;
  correlationCoefficient: number;
}

export interface AxCompetencyTagMapping {
  competencyCode: AxMemberCompetencyCode | AxExecCompetencyCode;
  tagCodes: string[];
}

export interface AxTagCorrelationSection {
  topCorrelations: AxTagCorrelation[];
  correlationMatrix: AxCorrelationMatrixItem[];
  competencyTags: AxCompetencyTagMapping[];
  insights: AxReportAnalysisInsight[];
  completed: boolean;
}

export interface AxReportAnalysis {
  coreSummarySection: AxCoreSummarySection;
  responseStatusSection: AxResponseStatusSection;
  executiveMaturitySection: AxExecutiveMaturitySection;
  fourPerspectiveSection: AxFourPerspectiveSection;
  memberCompetencyAnalysisSection: AxMemberCompetencyAnalysisSection;
  memberCompetencyLevelSection: AxMemberCompetencyLevelSection;
  memberCompetencyDetailSection: AxMemberCompetencyDetailSection;
  memberCompetencyMultiFacetSection: AxMemberCompetencyMultiFacetSection;
  profileSection: AxProfileSection;
  insightSection: AxInsightSection;
  tagCorrelationSection: AxTagCorrelationSection;
  complete: boolean;
}

export interface AxReportDetail {
  reportId: string;
  institutionId: number;
  institutionName: string;
  institutionLogoUrl: string;
  status: AxReportStatus;
  reportType: AxReportType;
  departmentLabel: string;
  aggregateReportId: string | null;
  createdAt: string;
  completedAt: string | null;
  analysis: AxReportAnalysis;
}

export type AxReportStatusResponse = {
  status: 'NOT_STARTED' | 'DRAFT' | 'COMPLETED';
};
