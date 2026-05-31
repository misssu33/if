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

/** presets/*.json · config/sns-export-presets.json 스키마 */
export interface MotionDotPreset {
  id: string;
  name: string;
  platform: PresetPlatform;
  outputFormat: OutputFormat;
  aspectRatio: AspectRatio;
  /** 권장 비율 설명 (UI) */
  aspectRatioRecommendation?: string;
  width: number;
  height: number;
  fps: number;
  /** GIF 프레임 간격(ms). 미설정 시 fps만 사용 */
  frameDelayMs?: number;
  maxFileSizeBytes: number;
  loop: boolean;
  quality: PresetQualityLevel;
  /** GIF 팔레트 최대 색 수 (2–256) */
  maxColors?: number;
  maxDurationSec?: number;
  recommendedUseCase: string;
}

/** 사용자 수동 덮어쓰기 */
export interface PresetOverrides {
  outputFormat?: OutputFormat;
  width?: number;
  height?: number;
  fps?: number;
  frameDelayMs?: number;
  quality?: PresetQualityLevel;
  maxColors?: number;
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
  aspectRatioRecommendation?: string;
  width: number;
  height: number;
  fps: number;
  frameDelayMs?: number;
  maxFileSizeBytes: number;
  loop: boolean;
  quality: PresetQualityLevel;
  maxColors?: number;
  maxDurationSec?: number;
}

/** @deprecated MotionDotPreset 사용 */
export type VideoPreset = MotionDotPreset;
