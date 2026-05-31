import ffmpeg from 'fluent-ffmpeg';
import type { FfmpegEncodeOptions } from './types';
import { getFfmpegBinaryPath } from './binary';

/** fluent-ffmpeg 인스턴스 (바이너리 경로 설정) */
export function createFfmpegCommand(inputPath: string) {
  const command = ffmpeg(inputPath);
  command.setFfmpegPath(getFfmpegBinaryPath());
  return command;
}

/** 인코딩 작업 — 모든 FFmpeg 호출은 이 모듈을 통해서만 */
export function runEncode(options: FfmpegEncodeOptions): Promise<void> {
  const { inputPath, outputPath, width, height, fps } = options;

  return new Promise((resolve, reject) => {
    let cmd = createFfmpegCommand(inputPath).output(outputPath);

    if (width != null && height != null) {
      cmd = cmd.size(`${width}x${height}`);
    }
    if (fps != null) {
      cmd = cmd.fps(fps);
    }

    cmd.on('end', () => resolve()).on('error', reject).run();
  });
}
