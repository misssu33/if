import path from 'path';
import { loadPreset } from '@/features/presets/server/load-preset';
import { resolveExportSettings } from '@/features/presets/utils/resolve-export-settings';
import { resolveOutputPath } from '@/features/export/services/export-service';
import { convertByFormat } from '@/lib/ffmpeg/convert';
import { isJobCancelled, setJobProgress } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';

/** FFmpeg 변환 실행 — 프리셋 로드와 FFmpeg 분리 */
export async function executeConvert(
  payload: ConvertJobPayload,
): Promise<string> {
  const { jobId, batchId, overrides } = payload;

  if (await isJobCancelled(jobId)) {
    await setJobProgress({
      jobId,
      batchId,
      status: 'cancelled',
      progress: 0,
      message: 'Cancelled',
    });
    throw new Error('Job cancelled');
  }

  const preset = await loadPreset(payload.presetId);
  const settings = resolveExportSettings(preset, {
    ...overrides,
    outputFormat: payload.format,
    width: payload.width,
    height: payload.height,
    fps: payload.fps,
    quality: payload.quality ?? overrides?.quality,
    loop: payload.loop ?? overrides?.loop,
    maxFileSizeBytes:
      payload.maxFileSizeBytes ?? overrides?.maxFileSizeBytes,
  });

  const outputPath = resolveOutputPath(jobId, settings.outputFormat);

  await setJobProgress({
    jobId,
    batchId,
    status: 'processing',
    progress: 10,
    message: `${settings.outputFormat.toUpperCase()} 변환 중`,
  });

  await convertByFormat({
    inputPath: payload.inputPath,
    outputPath,
    width: settings.width,
    height: settings.height,
    fps: settings.fps,
    quality: settings.quality,
    format: settings.outputFormat,
  });

  if (await isJobCancelled(jobId)) {
    await setJobProgress({
      jobId,
      batchId,
      status: 'cancelled',
      progress: 0,
      message: 'Cancelled',
    });
    throw new Error('Job cancelled');
  }

  await setJobProgress({
    jobId,
    batchId,
    status: 'completed',
    progress: 100,
    message: '완료',
    outputPath: path.basename(outputPath),
  });

  return outputPath;
}
