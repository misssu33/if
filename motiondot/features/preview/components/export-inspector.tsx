'use client';

import type { OutputFormat } from '@/types';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import { usePreviewStore } from '../stores/use-preview-store';
import { useSizeEstimate } from '@/features/export/hooks/use-size-estimate';

const FORMATS: OutputFormat[] = ['gif', 'mp4', 'webp'];

/** export 전 품질·용량 검사 */
export function ExportInspector() {
  const resolved = useExportSettingsStore((s) => s.resolved);
  const format = usePreviewStore((s) => s.previewFormat);
  const setPreviewFormat = usePreviewStore((s) => s.setPreviewFormat);
  const durationSec = usePreviewStore((s) => s.durationSec);
  const loopPlayback = usePreviewStore((s) => s.loopPlayback);
  const setLoopPlayback = usePreviewStore((s) => s.setLoopPlayback);

  const estimate = useSizeEstimate({
    format,
    durationSec,
    enabled: !!resolved,
  });

  if (!resolved) {
    return (
      <p className="text-xs text-zinc-500">프리셋을 선택하면 검사할 수 있습니다.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div>
        <span className="text-xs text-zinc-500">미리보기 포맷</span>
        <div className="mt-1 flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setPreviewFormat(f)}
              className={`rounded px-2 py-1 text-xs uppercase ${
                format === f ? 'bg-violet-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-xs">
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
          <dt className="text-zinc-500">예상 용량</dt>
          <dd className="font-medium text-violet-600">{estimate?.label ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">비트레이트</dt>
          <dd className="font-medium">{estimate?.bitrateKbps ?? '—'} kbps</dd>
        </div>
      </dl>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={loopPlayback}
          onChange={(e) => setLoopPlayback(e.target.checked)}
        />
        루프 미리보기
      </label>
    </div>
  );
}
