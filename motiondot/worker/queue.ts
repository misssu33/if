import { Queue } from 'bullmq';
import { QUEUE_NAME, redisConnection } from './config';

/** BullMQ 큐 — 프로세서는 worker/index.ts에서 등록 */
export const motiondotQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
});
