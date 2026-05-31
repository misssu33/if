import path from 'path';
import { loadPreset } from '@/features/presets/load-preset';
import { resolveOutputPath } from '@/features/export/services/export-service';
import { encodeGif, encodeMp4, encodeWebp } from '@/lib/ffmpeg';
import { setJobProgress } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';

/** 단일 변환 작업 — FFmpeg는 lib/ffmpeg만 사용 */
export async function processConvertJob(
  payload: ConvertJobPayload,
): Promise<string> {
  const { jobId, inputPath, presetId, format } = payload;
  const preset = await loadPreset(presetId);
  const outputPath = resolveOutputPath(jobId, format);

  await setJobProgress({
    jobId,
    status: 'active',
    progress: 10,
    message: '변환 시작',
  });

  const encodeOptions = {
    inputPath,
    outputPath,
    width: preset.width,
    height: preset.height,
    fps: preset.fps,
  };

  if (format === 'gif') await encodeGif(encodeOptions);
  else if (format === 'mp4') await encodeMp4(encodeOptions);
  else await encodeWebp(encodeOptions);

  await setJobProgress({
    jobId,
    status: 'completed',
    progress: 100,
    outputPath: path.basename(outputPath),
  });

  return outputPath;
}
