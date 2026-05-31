'use client';

import { useExportSettingsStore } from '../stores/use-export-settings-store';
import { formatMegabytes } from '../utils/format-bytes';

/** 선택된 프리셋 요약 */
export function PresetSummary() {
  const preset = useExportSettingsStore((s) => s.preset);
  const resolved = useExportSettingsStore((s) => s.resolved);

  if (!preset || !resolved) {
    return (
      <p className="text-xs text-zinc-500">
        프리셋을 선택하면 권장 설정이 적용됩니다.
      </p>
    );
  }

  return (
    <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-400">
      <p className="font-medium text-zinc-800 dark:text-zinc-200">
        {resolved.presetName}
      </p>
      <p className="mt-1">{preset.recommendedUseCase}</p>
      <dl className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-3">
        <div>
          <dt>포맷</dt>
          <dd className="font-medium uppercase text-zinc-800 dark:text-zinc-200">
            {resolved.outputFormat}
          </dd>
        </div>
        <div>
          <dt>비율</dt>
          <dd className="font-medium">{resolved.aspectRatio}</dd>
        </div>
        <div>
          <dt>해상도</dt>
          <dd className="font-medium">
            {resolved.width}×{resolved.height}
          </dd>
        </div>
        <div>
          <dt>FPS</dt>
          <dd className="font-medium">{resolved.fps}</dd>
        </div>
        <div>
          <dt>품질</dt>
          <dd className="font-medium">{resolved.quality}</dd>
        </div>
        <div>
          <dt>최대 용량</dt>
          <dd className="font-medium">
            {formatMegabytes(resolved.maxFileSizeBytes)}
          </dd>
        </div>
      </dl>
      {resolved.loop && (
        <p className="mt-2 text-violet-600 dark:text-violet-400">루프 재생</p>
      )}
    </div>
  );
}
