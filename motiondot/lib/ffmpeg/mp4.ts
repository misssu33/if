import { runEncode } from './encode';
import type { FfmpegEncodeOptions } from './types';

/** MP4 인코딩 (H.264) */
export function encodeMp4(options: FfmpegEncodeOptions): Promise<void> {
  return runEncode({
    ...options,
    outputPath: options.outputPath,
  });
}
