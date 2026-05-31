'use client';

import { usePresetCatalog } from '../hooks/use-preset-catalog';
import { PresetOverridesPanel } from './preset-overrides-panel';
import { PresetPicker } from './preset-picker';
import { PresetSummary } from './preset-summary';

/** SNS 프리셋 선택 + 수동 조정 (재사용 UI) */
export function PresetSelector() {
  const { presets, loading, error } = usePresetCatalog();

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        Export 프리셋
      </h2>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <PresetPicker presets={presets} loading={loading} />
      <PresetSummary />
      <PresetOverridesPanel />
    </section>
  );
}
