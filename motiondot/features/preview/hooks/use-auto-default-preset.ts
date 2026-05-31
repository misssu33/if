'use client';

import { useEffect } from 'react';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import type { MotionDotPreset } from '@/types';

/** 2단계 진입 시 프리셋 미선택이면 첫 SNS 프리셋 자동 적용 */
export function useAutoDefaultPreset(presets: MotionDotPreset[], enabled = true) {
  const preset = useExportSettingsStore((s) => s.preset);
  const setPreset = useExportSettingsStore((s) => s.setPreset);

  useEffect(() => {
    if (!enabled || preset || presets.length === 0) return;
    setPreset(presets[0]);
  }, [enabled, preset, presets, setPreset]);
}
