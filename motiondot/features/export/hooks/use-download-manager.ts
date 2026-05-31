'use client';

import { useCallback } from 'react';
import type { ExportHistoryRecord } from '@/types/export';

/** 개별 · 전체 · ZIP 다운로드 */
export function useDownloadManager() {
  const downloadOne = useCallback((record: ExportHistoryRecord) => {
    if (!record.outputPath) return;
    const url = `/api/export/download?file=${encodeURIComponent(record.outputPath)}&format=${record.format}`;
    window.open(url, '_blank');
  }, []);

  const downloadAll = useCallback((records: ExportHistoryRecord[]) => {
    const completed = records.filter((r) => r.status === 'completed' && r.outputPath);
    completed.forEach((r) => downloadOne(r));
  }, [downloadOne]);

  const downloadZip = useCallback((batchId: string) => {
    window.open(`/api/export/download/batch?batchId=${encodeURIComponent(batchId)}`, '_blank');
  }, []);

  return { downloadOne, downloadAll, downloadZip };
}
