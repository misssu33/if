'use client';

import { useBatchStore } from '@/stores';

const PRESET_OPTIONS = [
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram-reels', label: 'Instagram Reels' },
  { id: 'threads', label: 'Threads' },
  { id: 'coupang-product', label: 'Coupang 상품' },
] as const;

const FORMAT_OPTIONS = [
  { id: 'gif' as const, label: 'GIF' },
  { id: 'mp4' as const, label: 'MP4' },
  { id: 'webp' as const, label: 'WebP' },
];

/** SNS 프리셋 · 출력 포맷 선택 */
export function PresetSelector() {
  const presetId = useBatchStore((s) => s.presetId);
  const format = useBatchStore((s) => s.format);
  const setPresetId = useBatchStore((s) => s.setPresetId);
  const setFormat = useBatchStore((s) => s.setFormat);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          SNS 프리셋
        </label>
        <select
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          value={presetId ?? ''}
          onChange={(e) => setPresetId(e.target.value)}
        >
          <option value="">선택…</option>
          {PRESET_OPTIONS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          출력 포맷
        </label>
        <div className="flex gap-2">
          {FORMAT_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFormat(f.id)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                format === f.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
