import { Worker } from 'bullmq';
import { QUEUE_NAME, redisConnection } from './config';

/**
 * BullMQ 병렬 처리 워커
 * 실행: npm run worker
 */
const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log(`[worker] job ${job.id} — ${job.name}`, job.data);
    // FFmpeg 작업은 lib/ffmpeg를 import해 처리 (구현 예정)
  },
  { connection: redisConnection },
);

worker.on('completed', (job) => {
  console.log(`[worker] completed ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`[worker] failed ${job?.id}`, err);
});

console.log(
  `[worker] listening on ${QUEUE_NAME} @ ${redisConnection.host}:${redisConnection.port}`,
);
