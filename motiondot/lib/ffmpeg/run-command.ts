import type { FfmpegCommand } from 'fluent-ffmpeg';
import { createFfmpegCommand } from './binary';

type ConfigureFn = (cmd: FfmpegCommand) => FfmpegCommand;

/** fluent-ffmpeg Promise 래퍼 */
export function runFfmpegCommand(
  inputPath: string,
  outputPath: string,
  configure: ConfigureFn,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cmd = configure(createFfmpegCommand(inputPath)).output(outputPath);
    cmd.on('end', () => resolve()).on('error', reject).run();
  });
}
