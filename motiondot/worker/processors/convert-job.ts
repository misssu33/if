import { setJobProgress } from '@/lib/queue';
import { recordExportResult } from '@/lib/export/record-result';
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

    if (!isCancelled) {
      await recordExportResult({
        payload,
        status: 'failed',
        error: message,
      });
    } else {
      await recordExportResult({
        payload,
        status: 'cancelled',
        error: message,
      });
    }
    throw err;
  }
}
