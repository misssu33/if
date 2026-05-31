import type { OutputFormat } from './upload';
import type { PresetQualityLevel } from './preset';

/** export 세션 상태 */
export type ExportRecordStatus = 'completed' | 'failed' | 'cancelled';

/** export 히스토리 레코드 */
export interface ExportHistoryRecord {
  id: string;
  jobId: string;
  batchId?: string;
  fileId?: string;
  fileName: string;
  presetId: string;
  presetName?: string;
  format: OutputFormat;
  status: ExportRecordStatus;
  outputPath?: string;
  outputUrl?: string;
  width: number;
  height: number;
  fps: number;
  quality: PresetQualityLevel;
  loop: boolean;
  estimatedBytes?: number;
  actualBytes?: number;
  bitrateKbps?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

/** 용량 추정 요청 */
export interface ExportSizeEstimateInput {
  format: OutputFormat;
  width: number;
  height: number;
  fps: number;
  durationSec: number;
  quality: PresetQualityLevel;
  loop: boolean;
}

/** 용량 추정 결과 */
export interface ExportSizeEstimate {
  estimatedBytes: number;
  bitrateKbps: number;
  label: string;
}

/** 배치 export 요청 (다중 포맷) */
export interface BatchExportRequest {
  batchId?: string;
  fileIds?: string[];
  formats: OutputFormat[];
  presetId: string;
  namingPattern?: string;
}
