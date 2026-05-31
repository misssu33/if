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
        SNS 프리셋을 선택하면 GIF 최적 설정이 적용됩니다.
      </p>
    );
  }

  return (
    <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-400">
      <p className="font-medium text-zinc-800 dark:text-zinc-200">
        {resolved.presetName}
      </p>
      <p className="mt-1">{preset.recommendedUseCase}</p>
      {resolved.aspectRatioRecommendation && (
        <p className="mt-1 text-violet-700 dark:text-violet-300">
          권장 비율: {resolved.aspectRatioRecommendation}
        </p>
      )}
      <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500">포맷</dt>
          <dd className="font-medium uppercase text-zinc-800 dark:text-zinc-200">
            {resolved.outputFormat}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">비율</dt>
          <dd className="font-medium">{resolved.aspectRatio}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">해상도</dt>
          <dd className="font-medium">
            {resolved.width}×{resolved.height}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">FPS</dt>
          <dd className="font-medium">{resolved.fps}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">프레임 간격</dt>
          <dd className="font-medium">
            {resolved.frameDelayMs != null
              ? `${resolved.frameDelayMs}ms`
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">품질</dt>
          <dd className="font-medium">{resolved.quality}</dd>
        </div>
        {resolved.outputFormat === 'gif' && (
          <div>
            <dt className="text-zinc-500">최대 색</dt>
            <dd className="font-medium">{resolved.maxColors ?? 'auto'}</dd>
          </div>
        )}
        <div>
          <dt className="text-zinc-500">최대 용량</dt>
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
