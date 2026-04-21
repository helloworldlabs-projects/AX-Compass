// ─── Institution-specific primitives ─────────────────────────────────────────
// API 스펙의 영문 코드 값을 사용하는 전용 타입
// (constants/levelConfig.ts의 Level은 한국어 UI 레이블이므로 별도 정의)

import { Level } from '@/constants/levelConfig';
import type { ProfileType } from '@/types/exam';

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
  overallRoadmap: InstitutionRoadmap;
  beginnerElementaryRoadmap: InstitutionRoadmap;
  intermediateAdvancedRoadmap: InstitutionRoadmap;
}

// ─── Top-level DTO ────────────────────────────────────────────────────────────

export interface InstitutionStatsDTO {
  safarionCode: string;
  institutionName: string;
  memberCount: number;
  memberExamCount: number;
  executiveCount: number;
  executiveExamCount: number;
  competencyStats: InstitutionCompetencyStat[];
  scoreStats: InstitutionScoreStats;
  profileStats: InstitutionProfileStats;
  institutionRoadmap: InstitutionRoadmaps;
}

// ─── Domain Model ─────────────────────────────────────────────────────────────
// DTO 구조가 이미 정제된 형태이므로 Domain Model은 DTO를 그대로 alias

export type InstitutionStats = InstitutionStatsDTO;

// ─── Member List ──────────────────────────────────────────────────────────────

export interface MemberDTO {
  memberId: number;
  memberName: string;
  resultCode: string | null;
  overallLevel: InstitutionLevel | null;
  profileType: string | null;
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
  name?: string;
  examCompleted?: boolean;
  page?: number;
  size?: number;
}
