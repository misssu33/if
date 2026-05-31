import { randomUUID } from 'crypto';
import { enqueueBatchConvertJobs } from '@/lib/queue';
import type { BatchConvertRequest } from '@/types';

/** 배치 변환 작업 일괄 등록 */
export async function POST(request: Request) {
  const body = (await request.json()) as BatchConvertRequest;

  if (!body.jobs?.length) {
    return Response.json({ error: 'jobs required' }, { status: 400 });
  }

  const batchId = body.batchId ?? randomUUID();
  const result = await enqueueBatchConvertJobs(
    body.jobs.map((job) => ({
      ...job,
      jobId: randomUUID(),
      batchId,
    })),
    batchId,
  );

  return Response.json({ ...result, status: 'queued' });
}
