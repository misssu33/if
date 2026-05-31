import 'server-only';

import { stat } from 'fs/promises';
import path from 'path';
import { appendExportHistory } from './history';
import { estimateExportSize } from './estimate-size';
import type { ConvertJobPayload } from '@/types';
import type { ExportHistoryRecord } from '@/types/export';
import { loadPreset } from '@/features/presets/server/load-preset';

type RecordExportInput = {
  payload: ConvertJobPayload;
  status: ExportHistoryRecord['status'];
  outputPath?: string;
  error?: string;
};

/** Worker 완료/실패 시 히스토리 기록 */
export async function recordExportResult(
  input: RecordExportInput,
): Promise<void> {
  const { payload, status, outputPath, error } = input;
  const preset = await loadPreset(payload.presetId);
  const quality = payload.quality ?? preset.quality;
  const loop = payload.loop ?? preset.loop;

  let actualBytes: number | undefined;
  if (outputPath) {
    try {
      const st = await stat(outputPath);
      actualBytes = st.size;
    } catch {
      actualBytes = undefined;
    }
  }

  const estimate = estimateExportSize({
    format: payload.format,
    width: payload.width,
    height: payload.height,
    fps: payload.fps,
    durationSec: 5,
    quality,
    loop: loop ?? false,
  });

  const fileName =
    path.basename(payload.inputPath).replace(/\.[^.]+$/, '') ||
    payload.jobId;

  await appendExportHistory({
    jobId: payload.jobId,
    batchId: payload.batchId,
    fileId: payload.fileId,
    fileName,
    presetId: payload.presetId,
    presetName: preset.name,
    format: payload.format,
    status,
    outputPath: outputPath ? path.basename(outputPath) : undefined,
    width: payload.width,
    height: payload.height,
    fps: payload.fps,
    quality,
    loop: loop ?? false,
    estimatedBytes: estimate.estimatedBytes,
    actualBytes,
    bitrateKbps: estimate.bitrateKbps,
    completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    error,
  });
}
