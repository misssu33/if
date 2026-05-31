import type { MotionDotPreset } from '@/types';
import raw from './sns-export-presets.json';

/** config/sns-export-presets.json 항목 */
export type SnsExportPresetConfig = {
  id: string;
  name: string;
  platform: MotionDotPreset['platform'];
  outputFormat: MotionDotPreset['outputFormat'];
  aspectRatio: MotionDotPreset['aspectRatio'];
  aspectRatioRecommendation: string;
  width: number;
  height: number;
  fps: number;
  frameDelayMs: number;
  quality: MotionDotPreset['quality'];
  maxColors: number;
  maxFileSizeBytes: number;
  loop: boolean;
  maxDurationSec?: number;
  recommendedUseCase: string;
};

type SnsExportPresetsFile = {
  version: number;
  presets: SnsExportPresetConfig[];
};

const file = raw as SnsExportPresetsFile;

/** MVP SNS 프리셋 ID (순서 유지) */
export const SNS_EXPORT_PRESET_IDS = [
  'tiktok-short-clip',
  'instagram-reels',
  'threads-loop',
  'coupang-product-detail-gif',
  'kakaotalk-share',
  'custom',
] as const;

export type SnsExportPresetId = (typeof SNS_EXPORT_PRESET_IDS)[number];

/** JSON → MotionDotPreset */
export function snsConfigToMotionDotPreset(
  cfg: SnsExportPresetConfig,
): MotionDotPreset {
  return {
    id: cfg.id,
    name: cfg.name,
    platform: cfg.platform,
    outputFormat: cfg.outputFormat,
    aspectRatio: cfg.aspectRatio,
    aspectRatioRecommendation: cfg.aspectRatioRecommendation,
    width: cfg.width,
    height: cfg.height,
    fps: cfg.fps,
    frameDelayMs: cfg.frameDelayMs,
    quality: cfg.quality,
    maxColors: cfg.maxColors,
    maxFileSizeBytes: cfg.maxFileSizeBytes,
    loop: cfg.loop,
    maxDurationSec: cfg.maxDurationSec,
    recommendedUseCase: cfg.recommendedUseCase,
  };
}

const byId = new Map<string, MotionDotPreset>(
  file.presets.map((p) => [p.id, snsConfigToMotionDotPreset(p)]),
);

/** SNS export 프리셋 전체 */
export function getSnsExportPresets(): MotionDotPreset[] {
  return SNS_EXPORT_PRESET_IDS.map((id) => {
    const p = byId.get(id);
    if (!p) throw new Error(`Missing SNS preset: ${id}`);
    return p;
  });
}

/** ID로 SNS 프리셋 조회 */
export function getSnsExportPresetById(id: string): MotionDotPreset | undefined {
  return byId.get(id);
}
