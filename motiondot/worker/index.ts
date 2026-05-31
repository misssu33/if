import { Worker } from 'bullmq';
import { JOB_NAMES, MOTIONDOT_QUEUE_NAME } from '@/lib/queue';
import { getRedisConnection, getRedisHostConfig } from '@/lib/redis';
import { processConvertJob } from './processors/convert-job';
import type { ConvertJobPayload } from './jobs/types';

/**
 * MotionDot BullMQ Worker — 배치 변환 처리
 * 실행: npm run worker
 */
const worker = new Worker<ConvertJobPayload>(
  MOTIONDOT_QUEUE_NAME,
  async (job) => {
    if (job.name !== JOB_NAMES.CONVERT) {
      throw new Error(`Unknown job: ${job.name}`);
    }
    return processConvertJob(job.data);
  },
  { connection: getRedisConnection() },
);

worker.on('completed', (job) => {
  console.log(`[MotionDot worker] completed ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`[MotionDot worker] failed ${job?.id}`, err);
});

const { host, port } = getRedisHostConfig();
console.log(`[MotionDot worker] ${MOTIONDOT_QUEUE_NAME} @ ${host}:${port}`);
