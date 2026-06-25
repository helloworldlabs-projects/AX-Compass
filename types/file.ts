// ─── DTO — 백엔드 raw ─────────────────────────────────────────────────────────

export interface UploadedFileDto {
  fileName: string;
  publicUrl: string;
  folder: string;
}

// ─── Domain Model — UI 소비용 ─────────────────────────────────────────────────

export interface UploadedFile {
  fileName: string;
  publicUrl: string;
}
