import { Queue } from 'bullmq';
import type { ConvertJobPayload } from '@/types';
import { getRedisConnection } from '@/lib/redis';
import { QUEUE_NAMES, type QueueName } from './config';

const queueByName = new Map<QueueName, Queue>();

function getOrCreateQueue<T = ConvertJobPayload>(name: QueueName): Queue<T> {
  const existing = queueByName.get(name);
  if (existing) {
    return existing as Queue<T>;
  }
  const queue = new Queue<T>(name, {
    connection: getRedisConnection(),
  });
  queueByName.set(name, queue as Queue);
  return queue;
}

/** 업로드 후처리용 큐 (향후 worker 연동) */
export function getUploadQueue(): Queue {
  return getOrCreateQueue(QUEUE_NAMES.UPLOAD);
}

/** FFmpeg 변환·보내기 작업 큐 */
export function getExportQueue(): Queue<ConvertJobPayload> {
  return getOrCreateQueue<ConvertJobPayload>(QUEUE_NAMES.EXPORT);
}

/** Remotion 렌더 작업 큐 (향후 worker 연동) */
export function getRenderQueue(): Queue {
  return getOrCreateQueue(QUEUE_NAMES.RENDER);
}

/** @deprecated `getExportQueue()` 사용 */
export function getConvertQueue(): Queue<ConvertJobPayload> {
  return getExportQueue();
}
