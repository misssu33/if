'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { PresetOverrides } from '@/types';
import { useExportSettingsStore } from '../stores/use-export-settings-store';
import {
  buildExportOverridesFormValues,
  type ExportOverridesFormValues,
} from '../types/export-overrides-form';

/** Export 수동 조정 — react-hook-form 검증 + Zustand overrides 동기화 */
export function useExportOverridesForm() {
  const preset = useExportSettingsStore((s) => s.preset);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const setOverride = useExportSettingsStore((s) => s.setOverride);
  const resetOverrides = useExportSettingsStore((s) => s.resetOverrides);

  const values = useMemo(
    () =>
      preset ? buildExportOverridesFormValues(preset, resolved) : null,
    [preset, resolved],
  );

  const form = useForm<ExportOverridesFormValues>({
    values: values ?? undefined,
    mode: 'onChange',
  });

  const syncOverride = <K extends keyof PresetOverrides>(
    key: K,
    value: PresetOverrides[K],
  ) => {
    setOverride(key, value);
  };

  const resetToPreset = () => {
    resetOverrides();
  };

  return {
    preset,
    resolved,
    form,
    syncOverride,
    resetToPreset,
    isGif: (resolved?.outputFormat ?? preset?.outputFormat) === 'gif',
    isCustom: preset?.id === 'custom',
  };
}
