/** FFmpeg 인코딩 옵션 (lib/ffmpeg 전용) */
export type FfmpegEncodeOptions = {
  inputPath: string;
  outputPath: string;
  width?: number;
  height?: number;
  fps?: number;
};
