import { randomUUID } from 'crypto';
import { enqueueConvertJob } from '@/lib/queue';
import type { ConvertJobPayload, OutputFormat } from '@/types';

/** 단일 변환 작업 큐 등록 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    inputPath: string;
    presetId: string;
    format: OutputFormat;
    quality?: ConvertJobPayload['quality'];
    batchId?: string;
  };

  const jobId = await enqueueConvertJob({
    jobId: randomUUID(),
    inputPath: body.inputPath,
    presetId: body.presetId,
    format: body.format,
    quality: body.quality,
    batchId: body.batchId,
  });

  return Response.json({ jobId, status: 'queued' });
}
