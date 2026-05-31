import { randomUUID } from 'crypto';
import { enqueueConvertJob } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';

/** 단일 변환 작업 큐 등록 */
export async function POST(request: Request) {
  const body = (await request.json()) as Omit<ConvertJobPayload, 'jobId'>;

  const jobId = await enqueueConvertJob({
    jobId: randomUUID(),
    ...body,
  });

  return Response.json({ jobId, status: 'queued' });
}
