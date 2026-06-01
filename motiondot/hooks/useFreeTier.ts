'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import type { FreeTierPreferences, FreeTierUsage } from '@/lib/freeTier/types';

function emitUsageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('motiondot:free-tier'));
  }
}

/** 무료 플랜 제한·워터마크·사용량 (localStorage / sessionStorage) */
export function useFreeTier() {
  const [usage, setUsage] = useState<FreeTierUsage>({
    exportCount: 0,
    sessionId: '',
  });
  const [prefs, setPrefs] = useState<FreeTierPreferences>({
    watermarkOpacity: 0.55,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUsage(readFreeTierUsage());
    setPrefs(readFreeTierPreferences());
    setMounted(true);
    const handler = () => {
      setUsage(readFreeTierUsage());
      setPrefs(readFreeTierPreferences());
    };
    window.addEventListener('motiondot:free-tier', handler);
    return () => window.removeEventListener('motiondot:free-tier', handler);
  }, []);

  const plan = useMemo(() => (mounted ? readPlanTier() : 'free'), [mounted, usage.exportCount]);
  const isFree = plan !== 'pro';
  const limits = FREE_TIER_LIMITS;

  const exportsRemaining = Math.max(
    0,
    limits.maxExportsPerSession - usage.exportCount,
  );

  const canExport = !isFree || exportsRemaining > 0;

  const recordExport = useCallback(
    (count = 1) => {
      if (!isFree) return;
      const current = readFreeTierUsage();
      writeFreeTierUsage({
        ...current,
        exportCount: current.exportCount + count,
      });
      emitUsageChange();
    },
    [isFree],
  );

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

  const showWatermark = isFree && mounted;

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
    mounted,
  };
}
