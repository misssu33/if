'use client';

import type { OutputFormat, PresetQualityLevel } from '@/types';
import { useExportSettingsStore } from '../stores/use-export-settings-store';
import { formatMegabytes } from '../utils/format-bytes';

const FORMATS: OutputFormat[] = ['gif', 'mp4', 'webp'];
const QUALITIES: PresetQualityLevel[] = ['low', 'medium', 'high'];

/** FPS · 해상도 · 품질 · 용량 수동 덮어쓰기 */
export function PresetOverridesPanel() {
  const preset = useExportSettingsStore((s) => s.preset);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const setOverride = useExportSettingsStore((s) => s.setOverride);
  const resetOverrides = useExportSettingsStore((s) => s.resetOverrides);

  if (!preset) return null;

  const isCustom = preset.id === 'custom';

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          수동 조정 {isCustom && '(Custom)'}
        </span>
        <button
          type="button"
          className="text-xs text-violet-600 hover:underline dark:text-violet-400"
          onClick={resetOverrides}
        >
          초기화
        </button>
      </div>

      <div>
        <label className="mb-1 block text-xs text-zinc-500">출력 포맷</label>
        <div className="flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setOverride('outputFormat', f)}
              className={`rounded-lg px-2 py-1 text-xs uppercase ${
                (resolved?.outputFormat ?? preset.outputFormat) === f
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs">
          <span className="text-zinc-500">FPS</span>
          <input
            type="number"
            min={1}
            max={60}
            className="mt-1 w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={resolved?.fps ?? preset.fps}
            onChange={(e) => setOverride('fps', Number(e.target.value))}
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">품질</span>
          <select
            className="mt-1 w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={resolved?.quality ?? preset.quality}
            onChange={(e) =>
              setOverride('quality', e.target.value as PresetQualityLevel)
            }
          >
            {QUALITIES.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">너비 (px)</span>
          <input
            type="number"
            min={100}
            className="mt-1 w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={resolved?.width ?? preset.width}
            onChange={(e) => setOverride('width', Number(e.target.value))}
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">높이 (px)</span>
          <input
            type="number"
            min={100}
            className="mt-1 w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={resolved?.height ?? preset.height}
            onChange={(e) => setOverride('height', Number(e.target.value))}
          />
        </label>
      </div>

      <label className="text-xs">
        <span className="text-zinc-500">
          최대 파일 크기 ({formatMegabytes(resolved?.maxFileSizeBytes ?? preset.maxFileSizeBytes)})
        </span>
        <input
          type="range"
          min={1048576}
          max={104857600}
          step={1048576}
          className="mt-1 w-full"
          value={resolved?.maxFileSizeBytes ?? preset.maxFileSizeBytes}
          onChange={(e) =>
            setOverride('maxFileSizeBytes', Number(e.target.value))
          }
        />
      </label>

      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={resolved?.loop ?? preset.loop}
          onChange={(e) => setOverride('loop', e.target.checked)}
        />
        루프 재생
      </label>
    </div>
  );
}
