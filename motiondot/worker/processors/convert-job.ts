import { setJobProgress } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';
import { getConvertThreadPool } from '../pool/thread-pool';

/** BullMQ job → worker_thread 풀에서 변환 */
export async function processConvertJob(
  payload: ConvertJobPayload,
): Promise<string> {
  try {
    return await getConvertThreadPool().run(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Convert failed';
    const isCancelled = message.includes('cancelled');

    await setJobProgress({
      jobId: payload.jobId,
      batchId: payload.batchId,
      status: isCancelled ? 'cancelled' : 'failed',
      progress: 0,
      error: message,
    });
    throw err;
  }
}
