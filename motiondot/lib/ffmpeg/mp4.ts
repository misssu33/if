import type { ConvertOptions } from './types';
import { buildVideoFilterChain } from './filters';
import { getMp4Crf, getMp4Preset, resolveQuality } from './quality';
import { runFfmpegCommand } from './run-command';

/** MP4 변환 (H.264 · FPS · 해상도 · CRF 품질) */
export function encodeMp4(options: ConvertOptions): Promise<void> {
  const { inputPath, outputPath, width, height, fps } = options;
  const quality = resolveQuality(options.quality);
  const vf = buildVideoFilterChain(width, height, fps);

  return runFfmpegCommand(inputPath, outputPath, (cmd) =>
    cmd
      .videoCodec('libx264')
      .outputOptions([
        `-crf ${getMp4Crf(quality)}`,
        `-preset ${getMp4Preset(quality)}`,
        '-movflags +faststart',
        '-pix_fmt yuv420p',
        `-vf ${vf}`,
      ])
      .noAudio(),
  );
}
