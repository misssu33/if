import type { FfmpegCommand } from 'fluent-ffmpeg';
import { FfmpegConversionError } from './errors';
import { createFfmpegCommand } from './binary';
import type { ConversionLogger } from './conversion-logger';

type ConfigureFn = (cmd: FfmpegCommand) => FfmpegCommand;

export type RunFfmpegOptions = {
  logger?: ConversionLogger;
  onProgress?: (percent: number) => void;
  jobId?: string;
  format?: string;
};

/** fluent-ffmpeg Promise 래퍼 + 진행률·로그 */
export function runFfmpegCommand(
  inputPath: string,
  outputPath: string,
  configure: ConfigureFn,
  options: RunFfmpegOptions = {},
): Promise<void> {
  const { logger, onProgress, jobId, format } = options;

  return new Promise((resolve, reject) => {
    let cmd: FfmpegCommand;
    try {
      cmd = configure(createFfmpegCommand(inputPath)).output(outputPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'FFmpeg setup failed';
      logger?.error(message);
      reject(
        new FfmpegConversionError(message, {
          jobId,
          format,
          cause: err instanceof Error ? err : undefined,
        }),
      );
      return;
    }

    logger?.info(`ffmpeg start → ${outputPath}`);

    cmd
      .on('progress', (p) => {
        if (p.percent != null && Number.isFinite(p.percent)) {
          onProgress?.(Math.min(99, Math.max(0, p.percent)));
        }
      })
      .on('stderr', (line) => {
        if (typeof line === 'string' && line.trim()) {
          logger?.info(`stderr: ${line.trim().slice(0, 200)}`);
        }
      })
      .on('end', () => {
        logger?.info('ffmpeg completed');
        resolve();
      })
      .on('error', (err) => {
        const message = err.message || 'FFmpeg failed';
        logger?.error(message);
        reject(
          new FfmpegConversionError(message, {
            jobId,
            format,
            cause: err,
          }),
        );
      })
      .run();
  });
}
