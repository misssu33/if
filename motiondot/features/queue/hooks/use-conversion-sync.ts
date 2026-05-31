'use client';

import { useEffect } from 'react';
import { useConversionStore } from '../stores/use-conversion-store';
import { createPollingTransport } from '../services/polling-transport';
import type { ProgressTransport } from '../services/progress-transport';

const defaultTransport = createPollingTransport(1500);

type UseConversionSyncOptions = {
  transport?: ProgressTransport;
  intervalMs?: number;
};

/** 배치 진행률 실시간 동기화 (폴링 → SSE/WS 교체 가능) */
export function useConversionSync(options?: UseConversionSyncOptions) {
  const batchId = useConversionStore((s) => s.batch.batchId);
  const applyServerProgress = useConversionStore((s) => s.applyServerProgress);

  const transport =
    options?.transport ??
    (options?.intervalMs
      ? createPollingTransport(options.intervalMs)
      : defaultTransport);

  useEffect(() => {
    if (!batchId) return;

    const stop = transport.subscribe(batchId, (data) => {
      applyServerProgress(
        data.jobs.map((j) => ({
          jobId: j.jobId,
          status: j.status,
          progress: j.progress,
          message: j.message,
          error: j.error,
          outputPath: j.outputPath,
        })),
      );
    });

    return stop;
  }, [batchId, transport, applyServerProgress]);
}
