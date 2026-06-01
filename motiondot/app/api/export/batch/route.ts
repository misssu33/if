import { randomUUID } from 'crypto';
import { enqueueBatchConvertJobs } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';
import {
  resolveSubscriptionTier,
  resolveWatermarkTextByTier,
  validateFreeTierJobs,
} from '@/features/billing/server/free-tier-policy';

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
  const tier = resolveSubscriptionTier(request);
  if (tier === 'free') {
    const error = validateFreeTierJobs(body.jobs);
    if (error) {
      return Response.json({ error }, { status: 400 });
    }
  }

  const batchId = body.batchId ?? randomUUID();
  const result = await enqueueBatchConvertJobs(
    body.jobs.map((job) => ({
      ...job,
      jobId: randomUUID(),
      batchId,
      tier,
      watermarkText: resolveWatermarkTextByTier(tier),
    })),
    batchId,
  );

  return Response.json({ ...result, status: 'queued' });
}
