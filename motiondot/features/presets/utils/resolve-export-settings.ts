import type {
  MotionDotPreset,
  PresetOverrides,
  ResolvedExportSettings,
} from '@/types';

function resolveFps(
  preset: MotionDotPreset,
  overrides: PresetOverrides,
): number {
  if (overrides.fps !== undefined) return overrides.fps;
  if (overrides.frameDelayMs !== undefined && overrides.frameDelayMs > 0) {
    return Math.max(1, Math.round(1000 / overrides.frameDelayMs));
  }
  if (preset.frameDelayMs !== undefined && preset.frameDelayMs > 0) {
    return Math.max(1, Math.round(1000 / preset.frameDelayMs));
  }
  return preset.fps;
}

function resolveFrameDelayMs(
  preset: MotionDotPreset,
  overrides: PresetOverrides,
  fps: number,
): number | undefined {
  if (overrides.frameDelayMs !== undefined) return overrides.frameDelayMs;
  if (preset.frameDelayMs !== undefined) return preset.frameDelayMs;
  return fps > 0 ? Math.round(1000 / fps) : undefined;
}

function resolveMaxColors(
  preset: MotionDotPreset,
  overrides: PresetOverrides,
): number | undefined {
  if (overrides.maxColors !== undefined) return overrides.maxColors;
  return preset.maxColors;
}

/** 프리셋 + 사용자 덮어쓰기 → 변환 설정 (FFmpeg 로직과 분리) */
export function resolveExportSettings(
  preset: MotionDotPreset,
  overrides: PresetOverrides = {},
): ResolvedExportSettings {
  const fps = resolveFps(preset, overrides);
  const quality = overrides.quality ?? preset.quality;

  return {
    presetId: preset.id,
    presetName: preset.name,
    platform: preset.platform,
    outputFormat: overrides.outputFormat ?? preset.outputFormat,
    aspectRatio: preset.aspectRatio,
    aspectRatioRecommendation: preset.aspectRatioRecommendation,
    width: overrides.width ?? preset.width,
    height: overrides.height ?? preset.height,
    fps,
    frameDelayMs: resolveFrameDelayMs(preset, overrides, fps),
    maxFileSizeBytes: overrides.maxFileSizeBytes ?? preset.maxFileSizeBytes,
    loop: overrides.loop ?? preset.loop,
    quality,
    maxColors: resolveMaxColors(preset, overrides),
    maxDurationSec: preset.maxDurationSec,
  };
}
