'use client';

import { usePresetCatalog } from '../hooks/use-preset-catalog';
import { PresetOverridesPanel } from './preset-overrides-panel';
import { PresetPicker } from './preset-picker';
import { PresetSummary } from './preset-summary';

/** SNS 프리셋 선택 + 수동 조정 (재사용 UI) */
export function PresetSelector() {
  const { presets, loading, error } = usePresetCatalog();

  return (
    <section className="flex flex-col gap-4 min-w-0 rounded-xl border border-zinc-200 p-4 sm:p-6 dark:border-zinc-800">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        SNS GIF Export
      </h2>
        <p className="text-xs text-zinc-500">
          TikTok · Reels · Threads · 쿠팡 · 카카오톡 — 플랫폼별 최적 GIF 설정
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <PresetPicker presets={presets} loading={loading} />
      <PresetSummary />
      <PresetOverridesPanel />
    </section>
  );
}
