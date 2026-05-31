import type { OutputFormat } from './upload';

/** SNS 플랫폼 */
export type PresetPlatform =
  | 'tiktok'
  | 'instagram'
  | 'threads'
  | 'facebook'
  | 'kakaotalk'
  | 'coupang'
  | 'naver'
  | 'custom';

/** 화면 비율 */
export type AspectRatio = '9:16' | '1:1' | '4:5' | '16:9' | '2:3' | 'custom';

/** 프리셋 품질 (FFmpeg quality.ts와 매핑) */
export type PresetQualityLevel = 'low' | 'medium' | 'high';

/** presets/*.json 스키마 */
export interface MotionDotPreset {
  id: string;
  name: string;
  platform: PresetPlatform;
  outputFormat: OutputFormat;
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  fps: number;
  maxFileSizeBytes: number;
  loop: boolean;
  quality: PresetQualityLevel;
  maxDurationSec?: number;
  recommendedUseCase: string;
}

/** 사용자 수동 덮어쓰기 */
export interface PresetOverrides {
  outputFormat?: OutputFormat;
  width?: number;
  height?: number;
  fps?: number;
  quality?: PresetQualityLevel;
  maxFileSizeBytes?: number;
  loop?: boolean;
}

/** 변환 파이프라인에 전달되는 최종 설정 (FFmpeg와 분리) */
export interface ResolvedExportSettings {
  presetId: string;
  presetName: string;
  platform: PresetPlatform;
  outputFormat: OutputFormat;
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  fps: number;
  maxFileSizeBytes: number;
  loop: boolean;
  quality: PresetQualityLevel;
  maxDurationSec?: number;
}

/** @deprecated MotionDotPreset 사용 */
export type VideoPreset = MotionDotPreset;
