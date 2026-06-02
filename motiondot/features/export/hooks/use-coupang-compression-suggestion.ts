'use client';

import { useEffect, useRef } from 'react';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import { useImageCompressionStore } from '../stores/use-image-compression-store';

/** 쿠팡 프리셋 선택 시 안전 압축 프리셋 권장 (강제 아님 — 사용자가 off 가능) */
export function useCoupangCompressionSuggestion() {
  const preset = useExportSettingsStore((s) => s.preset);
  const presetId = useImageCompressionStore((s) => s.presetId);
  const setPresetId = useImageCompressionStore((s) => s.setPresetId);
  const lastAppliedPreset = useRef<string | null>(null);

  useEffect(() => {
    if (!preset) return;
    if (preset.platform !== 'coupang') return;
    if (lastAppliedPreset.current === preset.id) return;

    lastAppliedPreset.current = preset.id;
    if (preset.id === 'coupang-product-detail-gif') {
      setPresetId('coupang-safe');
    }
  }, [preset, setPresetId]);
}
