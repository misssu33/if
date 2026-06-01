import { randomUUID } from 'crypto';
import { enqueueConvertJob } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';
import {
  resolveSubscriptionTier,
  resolveWatermarkTextByTier,
  validateFreeTierJobs,
} from '@/features/billing/server/free-tier-policy';

/** 단일 변환 작업 큐 등록 */
export async function POST(request: Request) {
  const body = (await request.json()) as Omit<ConvertJobPayload, 'jobId'>;
  const tier = resolveSubscriptionTier(request);
  if (tier === 'free') {
    const error = validateFreeTierJobs([body]);
    if (error) {
      return Response.json({ error }, { status: 400 });
    }
  }

  const jobId = await enqueueConvertJob({
    ...body,
    jobId: randomUUID(),
    tier,
    watermarkText: resolveWatermarkTextByTier(tier),
  });

  return Response.json({ jobId, status: 'queued' });
}
