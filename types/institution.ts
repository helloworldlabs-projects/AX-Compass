// ─── Institution-specific primitives ─────────────────────────────────────────
// API 스펙의 영문 코드 값을 사용하는 전용 타입
// (constants/levelConfig.ts의 Level은 한국어 UI 레이블이므로 별도 정의)

export type InstitutionLevel = 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED';

export type InstitutionProfileType =
  | 'BALANCED'
  | 'LEARNER'
  | 'ANALYST'
  | 'DOER'
  | 'CAUTIOUS'
  | 'OVERCONFIDENT';

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
  top3ProfileTypes: InstitutionProfileType[];
  profileRatios: Record<InstitutionProfileType, number>;
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export interface InstitutionRoadmapCurriculumItem {
  curriculumName: string;
  levelTarget: string;
  curriculumRole: string;
  durationHour: number;
}

export interface InstitutionRoadmapStep {
  stepId: number;
  stepName: string;
  curriculumItems: InstitutionRoadmapCurriculumItem[];
  learningTips: string[];
}

export interface InstitutionCurriculumTree {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}

export interface InstitutionRoadmap {
  steps: InstitutionRoadmapStep[];
  curriculumTree: InstitutionCurriculumTree;
}

export interface InstitutionRoadmaps {
  overallRoadmap: InstitutionRoadmap;
  beginnerElementaryRoadmap: InstitutionRoadmap;
  intermediateAdvancedRoadmap: InstitutionRoadmap;
}

// ─── Top-level DTO ────────────────────────────────────────────────────────────

export interface InstitutionStatsDTO {
  safarionCode: string;
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
