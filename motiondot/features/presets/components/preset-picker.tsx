'use client';

import type { MotionDotPreset } from '@/types';
import { useExportSettingsStore } from '../stores/use-export-settings-store';

type PresetPickerProps = {
  presets: MotionDotPreset[];
  loading?: boolean;
};

const PLATFORM_LABEL: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  threads: 'Threads',
  facebook: 'Facebook',
  kakaotalk: 'KakaoTalk',
  coupang: 'Coupang',
  naver: 'Naver',
  custom: 'Custom',
};

/** SNS 프리셋 선택 */
export function PresetPicker({ presets, loading }: PresetPickerProps) {
  const preset = useExportSettingsStore((s) => s.preset);
  const setPreset = useExportSettingsStore((s) => s.setPreset);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        SNS 프리셋
      </label>
      <select
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        value={preset?.id ?? ''}
        disabled={loading}
        onChange={(e) => {
          const next = presets.find((p) => p.id === e.target.value);
          if (next) setPreset(next);
        }}
      >
        <option value="">플랫폼 프리셋 선택…</option>
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({PLATFORM_LABEL[p.platform] ?? p.platform})
          </option>
        ))}
      </select>
    </div>
  );
}
