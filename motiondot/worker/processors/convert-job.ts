import { setJobProgress } from '@/lib/queue';
import { recordExportResult } from '@/lib/export/record-result';
import type { ConvertJobPayload } from '@/types';
import { executeConvert } from './convert-runner';

/** BullMQ job → FFmpeg 변환 (메인 worker 프로세스에서 실행) */
export async function processConvertJob(
  payload: ConvertJobPayload,
): Promise<string> {
  try {
    return await executeConvert(payload);
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
