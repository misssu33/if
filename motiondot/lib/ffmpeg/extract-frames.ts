import path from 'path';
import { createFfmpegCommand } from './encode';
import type { FfmpegExtractFramesOptions } from './types';

/** 영상 → 프레임 시퀀스 추출 (temp/frames) */
export function extractFrames(
  options: FfmpegExtractFramesOptions,
): Promise<void> {
  const { inputPath, outputDir, fps = 10 } = options;
  const pattern = path.join(outputDir, 'frame_%04d.png');

  return new Promise((resolve, reject) => {
    createFfmpegCommand(inputPath)
      .outputOptions([`-vf fps=${fps}`])
      .output(pattern)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });
}
