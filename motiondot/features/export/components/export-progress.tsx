'use client';

import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import { useExportSessionStore } from '../stores/use-export-session-store';
import { useExportHistory } from '../hooks/use-export-history';

/** 배치 export 진행률 + 히스토리 동기화 */
export function ExportProgress() {
  const batch = useConversionStore((s) => s.batch);
  const jobs = useConversionStore((s) => s.jobs);
  const lastBatchId = useExportSessionStore((s) => s.lastBatchId);
  const { records } = useExportHistory(lastBatchId);

  const failed = jobs.filter((j) => j.status === 'failed');
  const completed = jobs.filter((j) => j.status === 'completed');

  return (
    <div className="flex flex-col gap-3 text-sm">
      {batch.batchId && (
        <p className="text-xs text-zinc-500">
          배치 ID: <span className="font-mono">{batch.batchId.slice(0, 8)}…</span>
        </p>
      )}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
          <div className="text-lg font-semibold text-violet-600">{completed.length}</div>
          <div className="text-zinc-500">완료</div>
        </div>
        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
          <div className="text-lg font-semibold text-amber-600">{batch.processing}</div>
          <div className="text-zinc-500">처리 중</div>
        </div>
        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
          <div className="text-lg font-semibold text-red-600">{failed.length}</div>
          <div className="text-zinc-500">실패</div>
        </div>
      </div>
      {records.length > 0 && (
        <p className="text-xs text-zinc-500">
          히스토리 {records.length}건 (완료{' '}
          {records.filter((r) => r.status === 'completed').length} / 실패{' '}
          {records.filter((r) => r.status === 'failed').length})
        </p>
      )}
      {failed.length > 0 && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          실패한 작업은 진행률 패널에서 재시도할 수 있습니다.
        </p>
      )}
    </div>
  );
}
