import 'server-only';

import { randomUUID } from 'crypto';
import type { BatchConvertResponse, ConvertJobPayload } from '@/types';
import { getConvertQueue } from './client';
import { DEFAULT_JOB_OPTIONS } from './job-options';
import { JOB_NAMES } from './types';

type EnqueueConvertInput = Omit<ConvertJobPayload, 'jobId'> & {
  jobId?: string;
};

/** 단일 작업 큐 등록 */
export async function enqueueConvertJob(
  input: EnqueueConvertInput,
): Promise<string> {
  const jobId = input.jobId ?? randomUUID();
  const payload: ConvertJobPayload = { ...input, jobId };

  const job = await getConvertQueue().add(JOB_NAMES.CONVERT, payload, {
    ...DEFAULT_JOB_OPTIONS,
    jobId,
  });

  return job.id ?? jobId;
}

/** 배치 변환 작업 일괄 등록 */
export async function enqueueBatchConvertJobs(
  jobs: EnqueueConvertInput[],
  batchId: string = randomUUID(),
): Promise<BatchConvertResponse> {
  const queue = getConvertQueue();
  const jobIds: string[] = [];

  await Promise.all(
    jobs.map(async (item) => {
      const jobId = item.jobId ?? randomUUID();
      jobIds.push(jobId);
      const payload: ConvertJobPayload = {
        ...item,
        jobId,
        batchId,
      };
      await queue.add(JOB_NAMES.CONVERT, payload, {
        ...DEFAULT_JOB_OPTIONS,
        jobId,
      });
    }),
  );

  return { batchId, jobIds };
}
