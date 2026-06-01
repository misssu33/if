import type { ConvertOptions } from './types';
import { buildVideoFilterChain } from './filters';
import { getWebpQuality, resolveQuality } from './quality';
import { runFfmpegCommand, type RunFfmpegOptions } from './run-command';

/** WebP 변환 (libwebp · FPS · 해상도 · 품질) */
export function encodeWebp(
  options: ConvertOptions,
  runOptions?: RunFfmpegOptions,
): Promise<void> {
  const { inputPath, outputPath, width, height, fps, watermarkText } = options;
  const quality = resolveQuality(options.quality);
  const vf = buildVideoFilterChain(width, height, fps, watermarkText);
  const q = getWebpQuality(quality);

  return runFfmpegCommand(
    inputPath,
    outputPath,
    (cmd) =>
      cmd
        .videoCodec('libwebp')
        .outputOptions([`-vf ${vf}`, `-quality ${q}`, '-loop 0', '-an']),
    { ...runOptions, format: 'webp' },
  );
}
