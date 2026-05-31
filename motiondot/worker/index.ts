import { Worker } from 'bullmq';
import { JOB_NAMES, MOTIONDOT_QUEUE_NAME } from '@/lib/queue';
import { getRedisConnection, getRedisHostConfig } from '@/lib/redis';
import { BULLMQ_CONCURRENCY } from './config';
import { processConvertJob } from './processors/convert-job';
import type { ConvertJobPayload } from './jobs/types';

/**
 * MotionDot BullMQ Worker
 * - 큐: Redis + BullMQ
 * - 처리: worker_threads 풀에서 FFmpeg 변환
 */
const worker = new Worker<ConvertJobPayload>(
  MOTIONDOT_QUEUE_NAME,
  async (job) => {
    if (job.name !== JOB_NAMES.CONVERT) {
      throw new Error(`Unknown job: ${job.name}`);
    }
    return processConvertJob(job.data);
  },
  {
    connection: getRedisConnection(),
    concurrency: BULLMQ_CONCURRENCY,
  },
);

worker.on('completed', (job) => {
  console.log(`[worker] completed ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`[worker] failed ${job?.id}`, err.message);
});

const { host, port } = getRedisHostConfig();
console.log(
  `[worker] queue=${MOTIONDOT_QUEUE_NAME} redis=${host}:${port} concurrency=${BULLMQ_CONCURRENCY}`,
);
