import { Queue } from 'bullmq';
import type { ConvertJobPayload } from '@/types';
import { getRedisConnection } from '@/lib/redis';
import { MOTIONDOT_QUEUE_NAME } from './types';

let queueInstance: Queue<ConvertJobPayload> | null = null;

/** API 라우트용 BullMQ Queue */
export function getConvertQueue(): Queue<ConvertJobPayload> {
  if (!queueInstance) {
    queueInstance = new Queue<ConvertJobPayload>(MOTIONDOT_QUEUE_NAME, {
      connection: getRedisConnection(),
    });
  }
  return queueInstance;
}
