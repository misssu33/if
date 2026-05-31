import type { ConvertOptions } from './types';
import { buildVideoFilterChain } from './filters';
import { getMp4Crf, resolveQuality } from './quality';
import { runFfmpegCommand, type RunFfmpegOptions } from './run-command';

/** MP4 변환 (H.264 · FPS · 해상도 · 품질) */
export function encodeMp4(
  options: ConvertOptions,
  runOptions?: RunFfmpegOptions,
): Promise<void> {
  const { inputPath, outputPath, width, height, fps } = options;
  const quality = resolveQuality(options.quality);
  const vf = buildVideoFilterChain(width, height, fps);
  const crf = getMp4Crf(quality);

  return runFfmpegCommand(
    inputPath,
    outputPath,
    (cmd) =>
      cmd
        .videoCodec('libx264')
        .outputOptions([`-vf ${vf}`, `-crf ${crf}`, '-preset fast', '-movflags +faststart', '-an']),
    { ...runOptions, format: 'mp4' },
  );
}
