'use client';

import { useCallback, useState } from 'react';
import { useBatchStore } from '@/stores';
import { useQueueUiStore } from '@/features/queue';

/** export 파이프라인: 큐에 배치 작업 등록 */
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
      for (const file of files) {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputPath: file.tempPath,
            presetId,
            format,
          }),
        });
        if (!res.ok) throw new Error('Job enqueue failed');
        const { jobId } = (await res.json()) as { jobId: string };
        trackJob(jobId);
      }
    } finally {
      setLoading(false);
    }
  }, [files, presetId, format, trackJob]);

  return { startExport, loading, canExport: !!presetId && files.length > 0 };
}
