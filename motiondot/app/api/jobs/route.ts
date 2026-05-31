import { randomUUID } from 'crypto';
import { enqueueConvertJob } from '@/lib/queue';
import type { ConvertJobPayload, OutputFormat } from '@/types';

/** 배치 작업 큐 등록 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    inputPath: string;
    presetId: string;
    format: OutputFormat;
  };

  const jobId = randomUUID();
  const payload: ConvertJobPayload = {
    jobId,
    inputPath: body.inputPath,
    presetId: body.presetId,
    format: body.format,
  };

  await enqueueConvertJob(payload);

  return Response.json({ jobId, status: 'queued' });
}
