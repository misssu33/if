import { runEncode } from './encode';
import type { FfmpegEncodeOptions } from './types';

/** GIF 인코딩 — fluent-ffmpeg 래퍼 */
export function encodeGif(options: FfmpegEncodeOptions): Promise<void> {
  return runEncode({ ...options, outputPath: options.outputPath });
}
