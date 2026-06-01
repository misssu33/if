import path from 'path';
import { readPresetJson } from '@/features/presets/utils/read-preset-json';
import { resolveExportSettings } from '@/features/presets/utils/resolve-export-settings';
import { recordExportResult } from '@/lib/export/record-result';
import { runConvertPipeline } from '@/lib/ffmpeg/pipeline';
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

  const preset = await readPresetJson(payload.presetId);
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
  const effectiveSettings = {
    ...settings,
    watermarkText: payload.watermarkText,
  };

  try {
    const outputPath = await runConvertPipeline(
      {
        jobId,
        batchId,
        inputPath: payload.inputPath,
        settings: effectiveSettings,
        format: payload.format,
      },
      async (progress, message) => {
        if (await isJobCancelled(jobId)) {
          throw new Error('Job cancelled');
        }
        await setJobProgress({
          jobId,
          batchId,
          status: 'processing',
          progress,
          message,
        });
      },
    );

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

    await recordExportResult({
      payload,
      status: 'completed',
      outputPath,
    });

    return outputPath;
  } catch (err) {
    throw err;
  }
}
