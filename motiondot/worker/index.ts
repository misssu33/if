import { Worker } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from '@/lib/queue/config';
import { getRedisConnection, getRedisHostConfig } from '@/lib/redis';
import { BULLMQ_CONCURRENCY } from './config';
import { processConvertJob } from './processors/convert-job';
import type { ConvertJobPayload } from './jobs/types';

/**
 * MotionDot BullMQ Worker
 * - export_queue: FFmpeg 변환 (worker_threads 풀)
 * - upload_queue / render_queue: 큐 이름만 등록 (향후 processor 연동)
 */
const exportWorker = new Worker<ConvertJobPayload>(
  QUEUE_NAMES.EXPORT,
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

exportWorker.on('completed', (job) => {
  console.log(`[worker] export_queue completed ${job.id}`);
});

exportWorker.on('failed', (job, err) => {
  console.error(`[worker] export_queue failed ${job?.id}`, err.message);
});

const { host, port } = getRedisHostConfig();
console.log(
  `[worker] queues=${QUEUE_NAMES.UPLOAD},${QUEUE_NAMES.EXPORT},${QUEUE_NAMES.RENDER} active=${QUEUE_NAMES.EXPORT} redis=${host}:${port} concurrency=${BULLMQ_CONCURRENCY}`,
);
