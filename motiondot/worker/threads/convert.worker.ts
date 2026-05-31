import { parentPort, workerData } from 'worker_threads';
import type { ConvertJobPayload } from '@/types';
import { executeConvert } from '../processors/convert-runner';

const payload = workerData as ConvertJobPayload;

executeConvert(payload)
  .then((result) => {
    parentPort?.postMessage({ ok: true as const, result });
  })
  .catch((err: unknown) => {
    parentPort?.postMessage({
      ok: false as const,
      error: err instanceof Error ? err.message : 'Convert failed',
    });
  });
