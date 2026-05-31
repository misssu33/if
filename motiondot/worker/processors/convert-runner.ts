import path from 'path';
import { loadPreset } from '@/features/presets/load-preset';
import { resolveOutputPath } from '@/features/export/services/export-service';
import { convertByFormat } from '@/lib/ffmpeg/convert';
import { isJobCancelled, setJobProgress } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';

/** FFmpeg 변환 실행 (Worker / worker_thread 공용) */
export async function executeConvert(
  payload: ConvertJobPayload,
): Promise<string> {
  const { jobId, inputPath, presetId, format, quality, batchId } = payload;

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

  const preset = await loadPreset(presetId);
  const outputPath = resolveOutputPath(jobId, format);

  await setJobProgress({
    jobId,
    batchId,
    status: 'processing',
    progress: 10,
    message: `${format.toUpperCase()} 변환 중`,
  });

  await convertByFormat({
    inputPath,
    outputPath,
    width: preset.width,
    height: preset.height,
    fps: preset.fps,
    quality,
    format,
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
