import type { ConvertOptions } from './types';
import { buildVideoFilterChain } from './filters';
import { getGifMaxColors, resolveQuality } from './quality';
import { runFfmpegCommand, type RunFfmpegOptions } from './run-command';

/** GIF 변환 (팔레트 · FPS · 해상도 · 품질) */
export function encodeGif(
  options: ConvertOptions,
  runOptions?: RunFfmpegOptions,
): Promise<void> {
  const { inputPath, outputPath, width, height, fps } = options;
  const quality = resolveQuality(options.quality);
  const maxColors = getGifMaxColors(quality);
  const vf = buildVideoFilterChain(width, height, fps);

  return runFfmpegCommand(
    inputPath,
    outputPath,
    (cmd) =>
      cmd
        .outputOptions(['-loop', '0'])
        .complexFilter([
          `[0:v] ${vf},split [a][b]`,
          `[a] palettegen=max_colors=${maxColors} [p]`,
          `[b][p] paletteuse=dither=bayer`,
        ]),
    { ...runOptions, format: 'gif' },
  );
}
