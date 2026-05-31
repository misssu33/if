'use client';

import type { OutputFormat, PresetQualityLevel } from '@/types';
import { useExportSettingsStore } from '../stores/use-export-settings-store';
import { formatMegabytes } from '../utils/format-bytes';

const FORMATS: OutputFormat[] = ['gif', 'mp4', 'webp'];
const QUALITIES: PresetQualityLevel[] = ['low', 'medium', 'high'];

/** FPS · 해상도 · 품질 · GIF 색 수 · 프레임 간격 수동 덮어쓰기 */
export function PresetOverridesPanel() {
  const preset = useExportSettingsStore((s) => s.preset);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const setOverride = useExportSettingsStore((s) => s.setOverride);
  const resetOverrides = useExportSettingsStore((s) => s.resetOverrides);

  if (!preset) return null;

  const isCustom = preset.id === 'custom';
  const isGif = (resolved?.outputFormat ?? preset.outputFormat) === 'gif';

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          수동 조정 {isCustom && '(Custom)'}
        </span>
        <button
          type="button"
          className="min-h-10 rounded-lg px-3 text-xs text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950/40"
          onClick={resetOverrides}
        >
          프리셋 값으로 초기화
        </button>
      </div>

      <div>
        <label className="mb-1 block text-xs text-zinc-500">출력 포맷</label>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setOverride('outputFormat', f)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 py-2 text-xs font-medium uppercase sm:min-h-0 sm:min-w-0 sm:py-1 ${
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-xs">
          <span className="text-zinc-500">프레임 간격 (ms)</span>
          <input
            type="number"
            min={20}
            max={1000}
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={resolved?.frameDelayMs ?? preset.frameDelayMs ?? ''}
            onChange={(e) =>
              setOverride('frameDelayMs', Number(e.target.value) || undefined)
            }
          />
          <span className="mt-0.5 block text-[10px] text-zinc-400">
            적용 FPS ≈ {resolved?.fps ?? preset.fps}
          </span>
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">FPS (직접 지정)</span>
          <input
            type="number"
            min={1}
            max={60}
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={resolved?.fps ?? preset.fps}
            onChange={(e) => setOverride('fps', Number(e.target.value))}
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">품질</span>
          <select
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
        {isGif && (
          <label className="text-xs">
            <span className="text-zinc-500">GIF 최대 색 (2–256)</span>
            <input
              type="number"
              min={2}
              max={256}
              className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              value={resolved?.maxColors ?? preset.maxColors ?? 128}
              onChange={(e) => setOverride('maxColors', Number(e.target.value))}
            />
          </label>
        )}
        <label className="text-xs">
          <span className="text-zinc-500">너비 (px)</span>
          <input
            type="number"
            min={100}
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={resolved?.width ?? preset.width}
            onChange={(e) => setOverride('width', Number(e.target.value))}
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">높이 (px)</span>
          <input
            type="number"
            min={100}
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
          className="mt-1 w-full min-h-11"
          value={resolved?.maxFileSizeBytes ?? preset.maxFileSizeBytes}
          onChange={(e) =>
            setOverride('maxFileSizeBytes', Number(e.target.value))
          }
        />
      </label>

      <label className="flex min-h-11 items-center gap-2 text-xs">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={resolved?.loop ?? preset.loop}
          onChange={(e) => setOverride('loop', e.target.checked)}
        />
        루프 재생
      </label>
    </div>
  );
}
