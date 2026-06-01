import type { ResolvedExportSettings } from '@/types/preset';
import { FREE_TIER_LIMITS } from './config';
import type { FreeTierLimits } from './types';

/** 비율 유지하며 최대 변 한도 안으로 축소 */
export function clampResolution(
  width: number,
  height: number,
  limits: Pick<FreeTierLimits, 'maxWidth' | 'maxHeight'>,
): { width: number; height: number } {
  let w = width;
  let h = height;
  const scaleDown = Math.min(
    limits.maxWidth / w,
    limits.maxHeight / h,
    1,
  );
  if (scaleDown < 1) {
    w = Math.max(2, Math.round(w * scaleDown));
    h = Math.max(2, Math.round(h * scaleDown));
    w -= w % 2;
    h -= h % 2;
  }
  return { width: w, height: h };
}

/** 무료 플랜 — 해상도·최대 길이 적용 */
export function applyFreeTierToExportSettings(
  settings: ResolvedExportSettings,
  limits: FreeTierLimits = FREE_TIER_LIMITS,
): ResolvedExportSettings {
  const { width, height } = clampResolution(
    settings.width,
    settings.height,
    limits,
  );
  const maxDurationSec = Math.min(
    settings.maxDurationSec ?? limits.maxGifDurationSec,
    limits.maxGifDurationSec,
  );
  return {
    ...settings,
    width,
    height,
    maxDurationSec,
  };
}

export function clampDurationSec(
  durationSec: number,
  limits: Pick<FreeTierLimits, 'maxGifDurationSec'> = FREE_TIER_LIMITS,
): number {
  return Math.min(Math.max(1, durationSec), limits.maxGifDurationSec);
}
