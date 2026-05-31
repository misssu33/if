import { parentPort, workerData } from 'worker_threads';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { ConvertJobPayload } from '@/types';

const workerDir = path.dirname(fileURLToPath(import.meta.url));

async function runConvert(): Promise<void> {
  const payload = workerData as ConvertJobPayload;
  const runnerUrl = pathToFileURL(
    path.join(workerDir, '..', 'processors', 'convert-runner.ts'),
  ).href;
  const { executeConvert } = await import(runnerUrl);
  const result = await executeConvert(payload);
  parentPort?.postMessage({ ok: true as const, result });
}

runConvert().catch((err: unknown) => {
  parentPort?.postMessage({
    ok: false as const,
    error: err instanceof Error ? err.message : 'Convert failed',
  });
});
