import ffmpegStatic from 'ffmpeg-static';

/** ffmpeg-static 바이너리 경로 */
export function getFfmpegBinaryPath(): string {
  if (!ffmpegStatic) {
    throw new Error('ffmpeg-static binary not found');
  }
  return ffmpegStatic;
}
