'use client';

import { Button } from '@/components/ui';
import { useExportSessionStore } from '../stores/use-export-session-store';
import { useExportHistory } from '../hooks/use-export-history';
import { useDownloadManager } from '../hooks/use-download-manager';
import { useIsIOS } from '../hooks/use-is-ios';
import { IOSDownloadGuide } from './ios-download-guide';

/** 개별 · 전체 · ZIP 다운로드 */
export function BatchDownloadPanel() {
  const lastBatchId = useExportSessionStore((s) => s.lastBatchId);
  const { records, loading } = useExportHistory(lastBatchId);
  const { downloadOne, downloadAll, downloadZip } = useDownloadManager();
  const isIOS = useIsIOS();

  const completed = records.filter(
    (r) => r.status === 'completed' && r.outputPath,
  );

  if (!lastBatchId) {
    return (
      <p className="text-xs text-zinc-500">
        배치 export 후 다운로드할 수 있습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {isIOS && completed.length > 0 && (
        <IOSDownloadGuide
          fileName={completed[0]!.fileName}
          outputPath={completed[0]!.outputPath!}
          format={completed[0]!.format}
          compact={completed.length > 1}
        />
      )}
      {isIOS && completed.length > 1 && (
        <p className="text-xs text-zinc-500">
          파일별로 아래 「받기」를 누르거나, 위 안내의 공유·열기를 사용하세요.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={loading || completed.length === 0}
          onClick={() => downloadAll(records)}
        >
          전체 다운로드
        </Button>
        <Button
          type="button"
          disabled={loading || completed.length === 0}
          onClick={() => downloadZip(lastBatchId)}
        >
          ZIP 배치
        </Button>
      </div>
      <ul className="max-h-40 overflow-y-auto text-xs">
        {records.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-2 border-b border-zinc-100 py-2 dark:border-zinc-800"
          >
            <span className="truncate">
              {r.fileName} · {r.format.toUpperCase()} · {r.status}
            </span>
            {r.status === 'completed' && r.outputPath && (
              <button
                type="button"
                className="shrink-0 text-violet-600 hover:underline"
                onClick={() => downloadOne(r)}
              >
                받기
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
