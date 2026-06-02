import type { PresetQualityLevel } from '@/types';
import type { MotionDotPreset, ResolvedExportSettings } from '@/types/preset';

/** Export 수동 조정 폼 값 (프리셋 + overrides 병합 표시) */
export type ExportOverridesFormValues = {
  frameDelayMs: number;
  fps: number;
  quality: PresetQualityLevel;
  maxColors: number;
  width: number;
  height: number;
  maxFileSizeBytes: number;
  loop: boolean;
};

export function buildExportOverridesFormValues(
  preset: MotionDotPreset,
  resolved: ResolvedExportSettings | null,
): ExportOverridesFormValues {
  return {
    frameDelayMs: resolved?.frameDelayMs ?? preset.frameDelayMs ?? 67,
    fps: resolved?.fps ?? preset.fps,
    quality: resolved?.quality ?? preset.quality,
    maxColors: resolved?.maxColors ?? preset.maxColors ?? 128,
    width: resolved?.width ?? preset.width,
    height: resolved?.height ?? preset.height,
    maxFileSizeBytes: resolved?.maxFileSizeBytes ?? preset.maxFileSizeBytes,
    loop: resolved?.loop ?? preset.loop,
  };
}

/** react-hook-form + Zustand export 설정 동기화 */
export const exportOverrideInputClass =
  'mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900';

export const exportOverrideErrorClass = 'mt-0.5 block text-[10px] text-red-600 dark:text-red-400';
