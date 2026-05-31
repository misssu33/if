import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

/** ffmpeg-static 바이너리 경로 */
export function getFfmpegBinaryPath(): string {
  if (!ffmpegStatic) {
    throw new Error('ffmpeg-static binary not found');
  }
  return ffmpegStatic;
}

/** fluent-ffmpeg 인스턴스 (바이너리 경로 설정) */
export function createFfmpegCommand(inputPath: string) {
  const command = ffmpeg(inputPath);
  command.setFfmpegPath(getFfmpegBinaryPath());
  return command;
}
