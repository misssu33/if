'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { ResolvedExportSettings } from '@/types/preset';
import {
  FREE_TIER_LIMITS,
  applyFreeTierToExportSettings,
  clampDurationSec,
  readFreeTierPreferences,
  readFreeTierUsage,
  readPlanTier,
  writeFreeTierPreferences,
  writeFreeTierUsage,
} from '@/lib/freeTier';

function subscribeUsage(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => cb();
  window.addEventListener('motiondot:free-tier', handler);
  return () => window.removeEventListener('motiondot:free-tier', handler);
}

function emitUsageChange() {
  window.dispatchEvent(new Event('motiondot:free-tier'));
}

function getUsageSnapshot() {
  return readFreeTierUsage();
}

function getPrefsSnapshot() {
  return readFreeTierPreferences();
}

/** 무료 플랜 제한·워터마크·사용량 (localStorage / sessionStorage) */
export function useFreeTier() {
  const usage = useSyncExternalStore(
    subscribeUsage,
    getUsageSnapshot,
    () => ({ exportCount: 0, sessionId: 'ssr' }),
  );
  const prefs = useSyncExternalStore(
    subscribeUsage,
    getPrefsSnapshot,
    () => ({ watermarkOpacity: 0.55 }),
  );

  const plan = useMemo(() => readPlanTier(), [usage.exportCount]);
  const isFree = plan !== 'pro';
  const limits = FREE_TIER_LIMITS;

  const exportsRemaining = Math.max(
    0,
    limits.maxExportsPerSession - usage.exportCount,
  );

  const canExport = !isFree || exportsRemaining > 0;

  const recordExport = useCallback((count = 1) => {
    if (!isFree) return;
    const next = {
      ...readFreeTierUsage(),
      exportCount: readFreeTierUsage().exportCount + count,
    };
    writeFreeTierUsage(next);
    emitUsageChange();
  }, [isFree]);

  const setWatermarkOpacity = useCallback((opacity: number) => {
    const clamped = Math.min(1, Math.max(0.15, opacity));
    writeFreeTierPreferences({ watermarkOpacity: clamped });
    emitUsageChange();
  }, []);

  const applyLimitsToSettings = useCallback(
    (settings: ResolvedExportSettings) =>
      isFree ? applyFreeTierToExportSettings(settings, limits) : settings,
    [isFree, limits],
  );

  const clampPreviewDuration = useCallback(
    (durationSec: number) =>
      isFree ? clampDurationSec(durationSec, limits) : durationSec,
    [isFree, limits],
  );

  const showWatermark = isFree;

  const watermark = useMemo(
    () => ({
      enabled: showWatermark,
      opacity: prefs.watermarkOpacity,
    }),
    [showWatermark, prefs.watermarkOpacity],
  );

  return {
    isFree,
    plan,
    limits,
    usage,
    exportsRemaining,
    canExport,
    recordExport,
    watermarkOpacity: prefs.watermarkOpacity,
    setWatermarkOpacity,
    applyLimitsToSettings,
    clampPreviewDuration,
    showWatermark,
    watermark,
  };
}
