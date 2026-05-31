'use client';

import { useExportHistory } from '../hooks/use-export-history';
import { useDownloadManager } from '../hooks/use-download-manager';

/** 최근 export 히스토리 */
export function ExportHistoryList() {
  const { records, loading } = useExportHistory();
  const { downloadOne } = useDownloadManager();

  if (loading) {
    return <p className="text-xs text-zinc-500">히스토리 불러오는 중…</p>;
  }

  if (records.length === 0) {
    return <p className="text-xs text-zinc-500">아직 export 기록이 없습니다.</p>;
  }

  return (
    <ul className="max-h-48 overflow-y-auto text-xs">
      {records.map((r) => (
        <li
          key={r.id}
          className="flex items-center justify-between gap-2 border-b border-zinc-100 py-2 dark:border-zinc-800"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-zinc-800 dark:text-zinc-200">
              {r.fileName} · {r.format}
            </p>
            <p className="text-zinc-500">
              {new Date(r.createdAt).toLocaleString()} · {r.status}
              {r.actualBytes
                ? ` · ${Math.round(r.actualBytes / 1024)} KB`
                : ''}
            </p>
          </div>
          {r.status === 'completed' && r.outputPath && (
            <button
              type="button"
              className="shrink-0 text-violet-600 hover:underline"
              onClick={() => downloadOne(r)}
            >
              다운로드
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
