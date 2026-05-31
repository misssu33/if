/** 최종 산출물 포맷 */
export type OutputFormat = 'gif' | 'mp4' | 'webp';

/** 업로드 파이프라인 파일 메타 */
export interface UploadFileMeta {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  tempPath: string;
  /** video | image */
  mediaKind?: 'video' | 'image';
}
