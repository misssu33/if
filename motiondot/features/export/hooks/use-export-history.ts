'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ExportHistoryRecord } from '@/types/export';

/** export 히스토리 폴링 */
export function useExportHistory(batchId?: string | null) {
  const [records, setRecords] = useState<ExportHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const q = batchId ? `?batchId=${encodeURIComponent(batchId)}` : '';
    const res = await fetch(`/api/export/history${q}`);
    if (res.ok) {
      setRecords((await res.json()) as ExportHistoryRecord[]);
    }
    setLoading(false);
  }, [batchId]);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), 4000);
    return () => clearInterval(id);
  }, [refresh]);

  return { records, loading, refresh };
}
