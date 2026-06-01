'use client';

import { useCallback } from 'react';
import type { ExportHistoryRecord } from '@/types/export';
import { isIOSBrowser } from '@/lib/utils/device';
import { buildExportDownloadUrl } from '../utils/build-export-download-url';

/** 개별 · 전체 · ZIP 다운로드 */
export function useDownloadManager() {
  const downloadOne = useCallback((record: ExportHistoryRecord) => {
    if (!record.outputPath) return;
    const url = buildExportDownloadUrl(record.outputPath, record.format);

    if (isIOSBrowser()) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    window.open(url, '_blank');
  }, []);

  const downloadAll = useCallback(
    (records: ExportHistoryRecord[]) => {
      const completed = records.filter(
        (r) => r.status === 'completed' && r.outputPath,
      );
      completed.forEach((r) => downloadOne(r));
    },
    [downloadOne],
  );

  const downloadZip = useCallback((batchId: string) => {
    window.open(
      `/api/export/download/batch?batchId=${encodeURIComponent(batchId)}`,
      '_blank',
    );
  }, []);

  return { downloadOne, downloadAll, downloadZip };
}
