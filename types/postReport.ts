// 사후검사 보고서 발행 기록 — report 테이블. 발행 시점의 보고서 전문(payload)을 담는다.
import type { CompanyReport } from '@/lib/admin/report';

// ─── DTO — 백엔드 raw ───────────────────────────────────────────────────────

/** PostExam.ReportSummary */
export interface ReportSummaryDto {
  reportId: number;
  linkId: number;
  institutionId: number;
  /** YYYY-MM-DD HH:mm:ss */
  generatedAt: string;
  generatedBy: number | null;
  revision: number;
  preRespondents: number;
  postRespondents: number;
}

/** PostExam.Report — P2 */
export interface ReportDto {
  summary: ReportSummaryDto;
  /**
   * 발행 시점의 보고서 전문. 없으면 null (전문 저장 이전 발행).
   *
   * **객체로 올 때도 있고 JSON 문자열로 올 때도 있다.** 처음에는 문자열이었고
   * 뒤에 객체로 바뀌었다. 옛 기록과 새 기록이 섞여 있을 수 있어 둘 다 받는다.
   */
  payload: CompanyReport | string | null;
}

/** PostExam.PublishReportRequest — P3 */
export interface PublishReportRequestDto {
  preRespondents: number;
  postRespondents: number;
  payload: CompanyReport;
}

// ─── Domain Model — UI 소비용 ───────────────────────────────────────────────

/** 원본 lib/report-record.ts 의 ReportRecord */
export interface ReportRecord {
  linkId: number;
  institutionId: number;
  /** YYYY-MM-DD HH:mm */
  generatedAt: string;
  /** 표지와 머리글에 찍는 YYYY.MM.DD */
  issuedOn: string;
  generatedBy: number | null;
  revision: number;
  preRespondents: number;
  postRespondents: number;
}

export interface PublishedReport {
  record: ReportRecord;
  /** 발행 시점 전문. 없거나 깨졌으면 null — 그때는 지금 데이터로 계산한다 */
  snapshot: CompanyReport | null;
}
