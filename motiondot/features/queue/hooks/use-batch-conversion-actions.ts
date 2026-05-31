'use client';

import { useCallback } from 'react';
import { useConversionStore } from '../stores/use-conversion-store';
import { cancelJobApi, retryJobApi } from '../services/job-actions-api';

/** 취소 · 재시도 액션 */
export function useBatchConversionActions() {
  const markJobCancelled = useConversionStore((s) => s.markJobCancelled);
  const replaceJobId = useConversionStore((s) => s.replaceJobId);
  const setJobStatus = useConversionStore((s) => s.setJobStatus);
  const getJob = useConversionStore((s) => s.getJob);

  const cancelJob = useCallback(
    async (jobId: string) => {
      const job = getJob(jobId);
      if (!job) return;
      if (
        job.status !== 'pending' &&
        job.status !== 'queued' &&
        job.status !== 'processing'
      ) {
        return;
      }

      markJobCancelled(jobId);
      try {
        await cancelJobApi(jobId);
      } catch (err) {
        setJobStatus(jobId, {
          status: 'failed',
          error: err instanceof Error ? err.message : 'Cancel failed',
        });
      }
    },
    [getJob, markJobCancelled, setJobStatus],
  );

  const retryJob = useCallback(
    async (jobId: string) => {
      const job = getJob(jobId);
      if (!job || (job.status !== 'failed' && job.status !== 'cancelled')) {
        return;
      }

      setJobStatus(jobId, {
        status: 'queued',
        progress: 0,
        error: undefined,
        message: '재시도 중…',
      });

      try {
        const newJobId = await retryJobApi(jobId, {
          batchId: job.batchId,
          fileId: job.fileId,
          inputPath: job.inputPath,
          presetId: job.presetId,
          format: job.format,
          quality: job.quality,
        });
        replaceJobId(jobId, newJobId);
      } catch (err) {
        setJobStatus(jobId, {
          status: 'failed',
          error: err instanceof Error ? err.message : 'Retry failed',
        });
      }
    },
    [getJob, replaceJobId, setJobStatus],
  );

  return { cancelJob, retryJob };
}
