import type {
  MotionDotPreset,
  PresetOverrides,
  ResolvedExportSettings,
} from '@/types';

/** 프리셋 + 사용자 덮어쓰기 → 변환 설정 (FFmpeg 로직과 분리) */
export function resolveExportSettings(
  preset: MotionDotPreset,
  overrides: PresetOverrides = {},
): ResolvedExportSettings {
  return {
    presetId: preset.id,
    presetName: preset.name,
    platform: preset.platform,
    outputFormat: overrides.outputFormat ?? preset.outputFormat,
    aspectRatio: preset.aspectRatio,
    width: overrides.width ?? preset.width,
    height: overrides.height ?? preset.height,
    fps: overrides.fps ?? preset.fps,
    maxFileSizeBytes: overrides.maxFileSizeBytes ?? preset.maxFileSizeBytes,
    loop: overrides.loop ?? preset.loop,
    quality: overrides.quality ?? preset.quality,
    maxDurationSec: preset.maxDurationSec,
  };
}
