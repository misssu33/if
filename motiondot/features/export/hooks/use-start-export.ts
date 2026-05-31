'use client';

import { useCallback, useState } from 'react';
import { useBatchStore } from '@/stores';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';

/** export 파이프라인: 배치 큐 등록 + conversion store 연동 */
export function useStartExport() {
  const [loading, setLoading] = useState(false);
  const files = useBatchStore((s) => s.files);
  const presetId = useBatchStore((s) => s.presetId);
  const format = useBatchStore((s) => s.format);
  const registerBatch = useConversionStore((s) => s.registerBatch);

  const startExport = useCallback(async () => {
    if (!presetId || files.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/jobs/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobs: files.map((file) => ({
            fileId: file.id,
            inputPath: file.tempPath,
            presetId,
            format,
          })),
        }),
      });

      if (!res.ok) throw new Error('Batch enqueue failed');

      const { batchId, jobIds } = (await res.json()) as {
        batchId: string;
        jobIds: string[];
      };

      registerBatch({ batchId, jobIds, files, presetId, format });
    } finally {
      setLoading(false);
    }
  }, [files, presetId, format, registerBatch]);

  return { startExport, loading, canExport: !!presetId && files.length > 0 };
}
