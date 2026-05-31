import { randomUUID } from 'crypto';
import { enqueueBatchConvertJobs } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';

type ExportBatchBody = {
  batchId?: string;
  jobs: Omit<ConvertJobPayload, 'jobId' | 'batchId'>[];
};

/** 다중 포맷 배치 export — 기존 BullMQ 큐 재사용 */
export async function POST(request: Request) {
  const body = (await request.json()) as ExportBatchBody;

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
