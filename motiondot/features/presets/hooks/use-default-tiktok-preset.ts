'use client';

import { useEffect } from 'react';
import { useExportSettingsStore } from '../stores/use-export-settings-store';
import { usePresetCatalog } from './use-preset-catalog';

const DEFAULT_PRESET_ID = 'tiktok-short-clip';

/** 최초 진입 시 TikTok Affiliate 프리셋(9:16) 자동 선택 */
export function useDefaultTikTokPreset() {
  const { presets, loading } = usePresetCatalog();
  const preset = useExportSettingsStore((s) => s.preset);
  const setPreset = useExportSettingsStore((s) => s.setPreset);

  useEffect(() => {
    if (loading || preset) return;
    const tiktok = presets.find((p) => p.id === DEFAULT_PRESET_ID);
    if (tiktok) setPreset(tiktok);
  }, [loading, preset, presets, setPreset]);
}
