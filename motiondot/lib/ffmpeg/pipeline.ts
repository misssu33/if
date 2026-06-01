import { access } from 'fs/promises';
import path from 'path';
import type { OutputFormat } from '@/types';
import type { ResolvedExportSettings } from '@/types/preset';
import { resolveOutputPath } from '@/lib/export/resolve-output-path';
import { convertByFormat } from './convert';
import { ConversionLogger } from './conversion-logger';
import { FfmpegConversionError } from './errors';
import {
  cleanupJobTempWorkspace,
  createJobTempWorkspace,
} from './temp-workspace';
import type { ConvertQuality } from './types';

export type ConvertPipelineInput = {
  jobId: string;
  batchId?: string;
  inputPath: string;
  settings: ResolvedExportSettings;
  format: OutputFormat;
};

export type ProgressCallback = (
  progress: number,
  message: string,
) => void | Promise<void>;

/** MP4 → GIF/WebP/MP4 변환 파이프라인 (temp · logs · outputs) */
export async function runConvertPipeline(
  input: ConvertPipelineInput,
  onProgress?: ProgressCallback,
): Promise<string> {
  const { jobId, inputPath, settings, format } = input;
  const logger = new ConversionLogger(jobId);
  let workspace: Awaited<ReturnType<typeof createJobTempWorkspace>> | null =
    null;

  try {
    await onProgress?.(2, '입력 파일 확인');
    await access(inputPath);
    logger.info(`input=${inputPath}`);

    await onProgress?.(5, 'temp 워크스페이스 준비');
    workspace = await createJobTempWorkspace(jobId, inputPath);
    logger.info(`workspace=${workspace.root}`);

    const outputPath = resolveOutputPath(jobId, format);
    logger.info(
      `preset=${settings.presetId} ${settings.width}x${settings.height} @${settings.fps}fps quality=${settings.quality} maxColors=${settings.maxColors ?? 'auto'}`,
    );

    await onProgress?.(10, `${format.toUpperCase()} FFmpeg 변환 시작`);

    let lastReported = 10;
    await convertByFormat(
      {
        inputPath: workspace.input,
        outputPath,
        width: settings.width,
        height: settings.height,
        fps: settings.fps,
        quality: settings.quality as ConvertQuality,
        maxColors: settings.maxColors,
        watermarkText: input.settings.watermarkText,
        format,
      },
      {
        logger,
        jobId,
        format,
        onProgress: async (pct) => {
          const mapped = Math.round(10 + (pct / 100) * 85);
          if (mapped >= lastReported + 2) {
            lastReported = mapped;
            await onProgress?.(mapped, `${format.toUpperCase()} 인코딩 ${Math.round(pct)}%`);
          }
        },
      },
    );

    await access(outputPath);
    const size = (await import('fs/promises')).stat(outputPath).then((s) => s.size);
    logger.info(`output=${outputPath} bytes=${await size}`);

    await onProgress?.(98, 'temp 정리');
    await cleanupJobTempWorkspace(jobId);

    await onProgress?.(100, '완료');
    await logger.flush();
    return outputPath;
  } catch (err) {
    const message =
      err instanceof FfmpegConversionError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Conversion failed';
    logger.error(message);
    await logger.flush();
    if (workspace) {
      await cleanupJobTempWorkspace(jobId).catch(() => undefined);
    }
    throw err instanceof FfmpegConversionError
      ? err
      : new FfmpegConversionError(message, { jobId, format, cause: err instanceof Error ? err : undefined });
  }
}
