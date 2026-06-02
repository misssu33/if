'use client';

import { usePresetCatalog } from '../hooks/use-preset-catalog';
import { useDefaultTikTokPreset } from '../hooks/use-default-tiktok-preset';
import { PresetOverridesPanel } from './preset-overrides-panel';
import { PresetPicker } from './preset-picker';
import { PresetSummary } from './preset-summary';
import { ImageCompressionPanel } from '@/features/export/components/image-compression-panel';

/** SNS 프리셋 선택 + 수동 조정 (재사용 UI) */
export function PresetSelector() {
  const { presets, loading, error } = usePresetCatalog();
  useDefaultTikTokPreset();

  return (
    <section className="flex flex-col gap-4 min-w-0 rounded-xl border border-zinc-200 p-4 sm:p-6 dark:border-zinc-800">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          TikTok Affiliate Export
        </h2>
        <p className="text-xs text-zinc-500">
          기본 9:16 · TikTok 숏폼 GIF/MP4/WebP. 쿠팡·카카오 등은 보조 프리셋입니다.
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <PresetPicker presets={presets} loading={loading} />
      <PresetSummary />
      <ImageCompressionPanel />
      <PresetOverridesPanel />
    </section>
  );
}
