// ─── Institution-specific primitives ─────────────────────────────────────────
// API 스펙의 영문 코드 값을 사용하는 전용 타입
// (constants/levelConfig.ts의 Level은 한국어 UI 레이블이므로 별도 정의)

import { Level } from '@/constants/levelConfig';
import type {
  ExecutiveResultCompetencyScoreDTO,
  MaturityStage,
  ProfileType,
  ProfileTypeLabel,
} from '@/types/exam';

export type InstitutionLevel = 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED';

// ─── Competency ───────────────────────────────────────────────────────────────

export interface InstitutionCompetencyTag {
  tagCode: string;
  tagName: string;
  avgScore: number;
}

export interface InstitutionCompetencyStat {
  competencyCode: string;
  dominantLevel: InstitutionLevel;
  levelRatios: Record<InstitutionLevel, number>;
  seAvg: number;
  sjAvg: number;
  bhAvg: number;
  tags: InstitutionCompetencyTag[];
}

// ─── Score Stats ──────────────────────────────────────────────────────────────

export interface InstitutionScoreStats {
  seAvg: number;
  sjAvg: number;
  bhAvg: number;
  gapSrAvg: number;
  gapSbAvg: number;
}

// ─── Profile Stats ────────────────────────────────────────────────────────────

export interface InstitutionProfileStats {
  top3ProfileTypes: ProfileType[];
  profileRatios: Record<ProfileType, number>;
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export interface InstitutionRoadmapCurriculumItem {
  curriculumName: string;
  step: Level;
  role: '메인' | '확장' | '보조';
  durationHour: number;
}

export interface InstitutionCurriculumTree {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}

export interface InstitutionRoadmapStep {
  stepId: number;
  stepName: string;
  curriculumItems: InstitutionRoadmapCurriculumItem[];
  learningTips: string[];
  curriculumTree: InstitutionCurriculumTree;
}

export interface InstitutionRoadmap {
  steps: InstitutionRoadmapStep[];
}

export interface InstitutionRoadmaps {
  overallRoadmap: InstitutionRoadmap | null;
  beginnerElementaryRoadmap: InstitutionRoadmap | null;
  intermediateAdvancedRoadmap: InstitutionRoadmap | null;
  overallCount: number;
  beginnerElementaryCount: number;
  intermediateAdvancedCount: number;
}

export interface ExecutiveMaturityStats {
  avgCurrentMaturityStage: MaturityStage;
  avgTargetMaturityStage: MaturityStage;
  avgCurrentMaturityScore: number;
  avgTargetMaturityScore: number;
  resultSummary: string[];
  currentCompetencyScores: ExecutiveResultCompetencyScoreDTO[];
  targetCompetencyScores: ExecutiveResultCompetencyScoreDTO[];
}

// ─── Department Stats ─────────────────────────────────────────────────────────

export interface DepartmentStat {
  department: string;
  memberCount: number;
  executiveCount: number;
}

// ─── Top-level DTO ────────────────────────────────────────────────────────────

export interface InstitutionStatsDTO {
  safarionCode: string;
  institutionName: string;
  totalCounts: {
    memberCount: number;
    memberExamCount: number;
    executiveCount: number;
    executiveExamCount: number;
  };
  filteredCounts: {
    memberCount: number;
    memberExamCount: number;
    executiveCount: number;
    executiveExamCount: number;
  };
  competencyStats: InstitutionCompetencyStat[];
  scoreStats: InstitutionScoreStats;
  profileStats: InstitutionProfileStats;
  institutionRoadmap: InstitutionRoadmaps;
  executiveMaturityStats: ExecutiveMaturityStats;
  departments: DepartmentStat[];
}

// ─── Domain Model ─────────────────────────────────────────────────────────────
// DTO 구조가 이미 정제된 형태이므로 Domain Model은 DTO를 그대로 alias

export type InstitutionStats = InstitutionStatsDTO;

// ─── Member List ──────────────────────────────────────────────────────────────

export interface MemberDTO {
  memberId: number;
  memberName: string;
  department: string;
  resultCode: string | null;
  overallLevel: InstitutionLevel | null;
  profileType: ProfileTypeLabel | null;
  understandLevel: InstitutionLevel | null;
  useApplyLevel: InstitutionLevel | null;
  evaluateLevel: InstitutionLevel | null;
  responsibleLevel: InstitutionLevel | null;
  seScore: number | null;
  sjScore: number | null;
  bhScore: number | null;
}

export interface MemberPageInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface MemberListDTO {
  institutionCode: string;
  institutionName: string;
  totalMemberCount: number;
  examCompletedCount: number;
  pageInfo: MemberPageInfo;
  members: MemberDTO[];
}

export interface MemberListParams {
  keyword?: string;
  examCompleted?: boolean;
  page?: number;
  size?: number;
}

// ─── Executive List ───────────────────────────────────────────────────────────

export interface ExecutiveDTO {
  executiveId: number;
  executiveName: string;
  department: string;
  resultCode: string | null;
  currentMaturityStage: MaturityStage | null;
  currentScore: number | null;
  targetMaturityStage: MaturityStage | null;
  targetScore: number | null;
  gapMs: number | null;
}

export interface ExecutiveListDTO {
  institutionCode: string;
  institutionName: string;
  totalExecutiveCount: number;
  examCompletedCount: number;
  pageInfo: MemberPageInfo;
  executives: ExecutiveDTO[];
}

export interface ExecutiveListParams {
  keyword?: string;
  examCompleted?: boolean;
  page?: number;
  size?: number;
}

// ─── Bulk Register ────────────────────────────────────────────────────────────

export interface BulkRegisterMember {
  no: number;
  name: string;
  department: string;
}

export interface BulkRegisterResponse {
  registeredCount: number;
  skippedCount: number;
  skippedNumbers: number[];
}

export type BulkUploadResult =
  | { status: 'SUCCESS' }
  | { status: 'PARTIAL'; failedNos: number[] }
  | { status: 'ALL_FAILED' }
  | { status: 'INVALID_FORMAT' }
  | { status: 'SYSTEM_ERROR' };
