'use client';

import type { OutputFormat } from '@/types';
import { Button } from '@/components/ui';
import { useStartExport } from '../hooks/use-start-export';
import { useBatchExport } from '../hooks/use-batch-export';
import { useExportSessionStore } from '../stores/use-export-session-store';

const FORMATS: OutputFormat[] = ['gif', 'mp4', 'webp'];

/** export 파이프라인 UI — 단일/다중 포맷 */
export function ExportPanel() {
  const { startExport, loading: singleLoading, canExport } = useStartExport();
  const { runBatchExport, loading: batchLoading, canExport: canBatch } =
    useBatchExport();
  const selectedFormats = useExportSessionStore((s) => s.selectedFormats);
  const toggleFormat = useExportSessionStore((s) => s.toggleFormat);
  const namingPattern = useExportSessionStore((s) => s.namingPattern);
  const setNamingPattern = useExportSessionStore((s) => s.setNamingPattern);

  const loading = singleLoading || batchLoading;

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-zinc-200 p-4 sm:p-6 dark:border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        최종 Export
      </h2>

      <div>
        <span className="text-xs text-zinc-500">출력 포맷 (다중 선택)</span>
        <div className="mt-1 flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFormat(f)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 py-2 text-xs font-medium uppercase sm:min-h-0 sm:min-w-0 sm:rounded sm:px-2 sm:py-1 ${
                selectedFormats.includes(f)
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-xs">
        <span className="text-zinc-500">출력 파일명 패턴</span>
        <input
          type="text"
          value={namingPattern}
          onChange={(e) => setNamingPattern(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 sm:min-h-0 sm:py-1 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="{name}-{format}"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={!canExport || loading}
          onClick={() => void startExport()}
        >
          {singleLoading ? '등록 중…' : '단일 포맷 큐'}
        </Button>
        <Button
          type="button"
          disabled={!canBatch || loading}
          onClick={() => void runBatchExport()}
        >
          {batchLoading ? '배치 등록 중…' : '다중 포맷 배치'}
        </Button>
      </div>
    </section>
  );
}
