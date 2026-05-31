import type { OutputFormat } from '@/types';

/** 출력 품질 프리셋 */
export type ConvertQuality = 'low' | 'medium' | 'high';

/** 포맷 공통 변환 옵션 */
export interface ConvertOptions {
  inputPath: string;
  outputPath: string;
  width: number;
  height: number;
  fps: number;
  quality?: ConvertQuality;
}

export interface ConvertByFormatOptions extends ConvertOptions {
  format: OutputFormat;
}

/** 프레임 추출 옵션 */
export interface FfmpegExtractFramesOptions {
  inputPath: string;
  outputDir: string;
  fps?: number;
}
