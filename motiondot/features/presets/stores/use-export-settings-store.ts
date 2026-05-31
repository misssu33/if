import { create } from 'zustand';
import type {
  MotionDotPreset,
  PresetOverrides,
  PresetQualityLevel,
  ResolvedExportSettings,
} from '@/types';
import { resolveExportSettings } from '../utils/resolve-export-settings';

interface ExportSettingsState {
  preset: MotionDotPreset | null;
  overrides: PresetOverrides;
  resolved: ResolvedExportSettings | null;
  setPreset: (preset: MotionDotPreset) => void;
  setOverride: <K extends keyof PresetOverrides>(
    key: K,
    value: PresetOverrides[K],
  ) => void;
  resetOverrides: () => void;
  clear: () => void;
}

function applyResolved(
  preset: MotionDotPreset | null,
  overrides: PresetOverrides,
): ResolvedExportSettings | null {
  if (!preset) return null;
  return resolveExportSettings(preset, overrides);
}

export const useExportSettingsStore = create<ExportSettingsState>((set, get) => ({
  preset: null,
  overrides: {},
  resolved: null,

  setPreset: (preset) => {
    const overrides =
      preset.id === 'custom' ? get().overrides : {};
    const resolved = applyResolved(preset, overrides);
    set({ preset, overrides, resolved });
  },

  setOverride: (key, value) => {
    const { preset, overrides } = get();
    const next = { ...overrides, [key]: value };
    set({
      overrides: next,
      resolved: applyResolved(preset, next),
    });
  },

  resetOverrides: () => {
    const { preset } = get();
    set({
      overrides: {},
      resolved: applyResolved(preset, {}),
    });
  },

  clear: () => set({ preset: null, overrides: {}, resolved: null }),
}));

/** 편의 셀렉터 */
export function useResolvedExportSettings(): ResolvedExportSettings | null {
  return useExportSettingsStore((s) => s.resolved);
}

export function useHasValidExportSettings(): boolean {
  return useExportSettingsStore((s) => s.resolved !== null);
}
