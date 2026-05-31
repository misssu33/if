'use client';

import { useCallback, useState } from 'react';
import { useBatchStore } from '@/stores';
import { useQueueUiStore } from '@/features/queue';

/** export 파이프라인: 배치 큐 일괄 등록 */
export function useStartExport() {
  const [loading, setLoading] = useState(false);
  const files = useBatchStore((s) => s.files);
  const presetId = useBatchStore((s) => s.presetId);
  const format = useBatchStore((s) => s.format);
  const trackJob = useQueueUiStore((s) => s.trackJob);

  const startExport = useCallback(async () => {
    if (!presetId || files.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/jobs/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobs: files.map((file) => ({
            inputPath: file.tempPath,
            presetId,
            format,
          })),
        }),
      });

      if (!res.ok) throw new Error('Batch enqueue failed');

      const { jobIds } = (await res.json()) as { jobIds: string[] };
      jobIds.forEach(trackJob);
    } finally {
      setLoading(false);
    }
  }, [files, presetId, format, trackJob]);

  return { startExport, loading, canExport: !!presetId && files.length > 0 };
}
