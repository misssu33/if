import { randomUUID } from 'crypto';
import type { BatchConvertResponse, ConvertJobPayload } from '@/types';
import { getExportQueue } from './client';
import { saveBatchJobIds } from './batch-registry';
import { DEFAULT_JOB_OPTIONS } from './job-options';
import { setJobProgress } from './progress';
import { JOB_NAMES } from './config';

type EnqueueConvertInput = Omit<ConvertJobPayload, 'jobId'> & {
  jobId?: string;
};

/** 단일 작업 큐 등록 */
export async function enqueueConvertJob(
  input: EnqueueConvertInput,
): Promise<string> {
  const jobId = input.jobId ?? randomUUID();
  const payload: ConvertJobPayload = { ...input, jobId };

  await getExportQueue().add(JOB_NAMES.CONVERT, payload, {
    ...DEFAULT_JOB_OPTIONS,
    jobId,
  });

  await setJobProgress({
    jobId,
    batchId: input.batchId,
    status: 'queued',
    progress: 0,
    message: 'Queued',
  });

  return jobId;
}

/** 배치 변환 작업 일괄 등록 (jobIds 순서 유지) */
export async function enqueueBatchConvertJobs(
  jobs: EnqueueConvertInput[],
  batchId: string = randomUUID(),
): Promise<BatchConvertResponse> {
  const queue = getExportQueue();
  const jobIds: string[] = [];

  for (const item of jobs) {
    const jobId = item.jobId ?? randomUUID();
    jobIds.push(jobId);
    const payload: ConvertJobPayload = { ...item, jobId, batchId };

    await queue.add(JOB_NAMES.CONVERT, payload, {
      ...DEFAULT_JOB_OPTIONS,
      jobId,
    });

    await setJobProgress({
      jobId,
      batchId,
      status: 'queued',
      progress: 0,
      message: 'Queued',
    });
  }

  await saveBatchJobIds(batchId, jobIds);
  return { batchId, jobIds };
}
