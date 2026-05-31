import { runEncode } from './encode';
import type { FfmpegEncodeOptions } from './types';

/** WebP 인코딩 */
export function encodeWebp(options: FfmpegEncodeOptions): Promise<void> {
  return runEncode({
    ...options,
    outputPath: options.outputPath,
  });
}
