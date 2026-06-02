'use client';

import type { OutputFormat, PresetQualityLevel } from '@/types';
import { Controller } from 'react-hook-form';
import { useExportOverridesForm } from '../hooks/use-export-overrides-form';
import { formatMegabytes } from '../utils/format-bytes';
import {
  exportOverrideErrorClass,
  exportOverrideInputClass,
} from '../types/export-overrides-form';

const FORMATS: OutputFormat[] = ['gif', 'mp4', 'webp'];
const QUALITIES: PresetQualityLevel[] = ['low', 'medium', 'high'];

/** FPS · 해상도 · 품질 · GIF 색 수 · 프레임 간격 수동 덮어쓰기 (react-hook-form) */
export function PresetOverridesPanel() {
  const {
    preset,
    resolved,
    form,
    syncOverride,
    resetToPreset,
    isGif,
    isCustom,
  } = useExportOverridesForm();

  const {
    register,
    control,
    formState: { errors },
  } = form;

  if (!preset) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          수동 조정 {isCustom && '(Custom)'}
        </span>
        <button
          type="button"
          className="min-h-10 rounded-lg px-3 text-xs text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950/40"
          onClick={resetToPreset}
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
              onClick={() => syncOverride('outputFormat', f)}
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
            className={exportOverrideInputClass}
            aria-invalid={Boolean(errors.frameDelayMs)}
            {...register('frameDelayMs', {
              valueAsNumber: true,
              min: { value: 20, message: '20ms 이상 입력하세요' },
              max: { value: 1000, message: '1000ms 이하 입력하세요' },
              onChange: (e) => {
                const value = Number(e.target.value);
                if (Number.isFinite(value)) {
                  syncOverride('frameDelayMs', value);
                }
              },
            })}
          />
          {errors.frameDelayMs && (
            <span className={exportOverrideErrorClass}>
              {errors.frameDelayMs.message}
            </span>
          )}
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
            className={exportOverrideInputClass}
            aria-invalid={Boolean(errors.fps)}
            {...register('fps', {
              valueAsNumber: true,
              min: { value: 1, message: '1 FPS 이상' },
              max: { value: 60, message: '60 FPS 이하' },
              onChange: (e) => {
                const value = Number(e.target.value);
                if (Number.isFinite(value)) {
                  syncOverride('fps', value);
                }
              },
            })}
          />
          {errors.fps && (
            <span className={exportOverrideErrorClass}>{errors.fps.message}</span>
          )}
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">품질</span>
          <Controller
            control={control}
            name="quality"
            render={({ field }) => (
              <select
                className={exportOverrideInputClass}
                value={field.value}
                onChange={(e) => {
                  const value = e.target.value as PresetQualityLevel;
                  field.onChange(value);
                  syncOverride('quality', value);
                }}
              >
                {QUALITIES.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            )}
          />
        </label>
        {isGif && (
          <label className="text-xs">
            <span className="text-zinc-500">GIF 최대 색 (2–256)</span>
            <input
              type="number"
              min={2}
              max={256}
              className={exportOverrideInputClass}
              aria-invalid={Boolean(errors.maxColors)}
              {...register('maxColors', {
                valueAsNumber: true,
                min: { value: 2, message: '2색 이상' },
                max: { value: 256, message: '256색 이하' },
                onChange: (e) => {
                  const value = Number(e.target.value);
                  if (Number.isFinite(value)) {
                    syncOverride('maxColors', value);
                  }
                },
              })}
            />
            {errors.maxColors && (
              <span className={exportOverrideErrorClass}>
                {errors.maxColors.message}
              </span>
            )}
          </label>
        )}
        <label className="text-xs">
          <span className="text-zinc-500">너비 (px)</span>
          <input
            type="number"
            min={100}
            className={exportOverrideInputClass}
            aria-invalid={Boolean(errors.width)}
            {...register('width', {
              valueAsNumber: true,
              min: { value: 100, message: '100px 이상' },
              onChange: (e) => {
                const value = Number(e.target.value);
                if (Number.isFinite(value)) {
                  syncOverride('width', value);
                }
              },
            })}
          />
          {errors.width && (
            <span className={exportOverrideErrorClass}>{errors.width.message}</span>
          )}
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">높이 (px)</span>
          <input
            type="number"
            min={100}
            className={exportOverrideInputClass}
            aria-invalid={Boolean(errors.height)}
            {...register('height', {
              valueAsNumber: true,
              min: { value: 100, message: '100px 이상' },
              onChange: (e) => {
                const value = Number(e.target.value);
                if (Number.isFinite(value)) {
                  syncOverride('height', value);
                }
              },
            })}
          />
          {errors.height && (
            <span className={exportOverrideErrorClass}>{errors.height.message}</span>
          )}
        </label>
      </div>

      <label className="text-xs">
        <span className="text-zinc-500">
          최대 파일 크기 (
          {formatMegabytes(resolved?.maxFileSizeBytes ?? preset.maxFileSizeBytes)})
        </span>
        <Controller
          control={control}
          name="maxFileSizeBytes"
          rules={{
            min: { value: 1048576, message: '1MB 이상' },
            max: { value: 104857600, message: '100MB 이하' },
          }}
          render={({ field, fieldState }) => (
            <>
              <input
                type="range"
                min={1048576}
                max={104857600}
                step={1048576}
                className="mt-1 w-full min-h-11"
                value={field.value}
                aria-invalid={Boolean(fieldState.error)}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  field.onChange(value);
                  syncOverride('maxFileSizeBytes', value);
                }}
              />
              {fieldState.error && (
                <span className={exportOverrideErrorClass}>
                  {fieldState.error.message}
                </span>
              )}
            </>
          )}
        />
      </label>

      <Controller
        control={control}
        name="loop"
        render={({ field }) => (
          <label className="flex min-h-11 items-center gap-2 text-xs">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={field.value}
              onChange={(e) => {
                field.onChange(e.target.checked);
                syncOverride('loop', e.target.checked);
              }}
            />
            루프 재생
          </label>
        )}
      />
    </div>
  );
}
