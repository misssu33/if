import { enqueueConvertJob } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';
import {
  resolveSubscriptionTier,
  resolveWatermarkTextByTier,
  validateFreeTierJobs,
} from '@/features/billing/server/free-tier-policy';

type RouteContext = { params: Promise<{ jobId: string }> };

/** 실패 작업 재시도 (새 jobId) */
export async function POST(request: Request, context: RouteContext) {
  const { jobId: _oldId } = await context.params;
  const body = (await request.json()) as Omit<ConvertJobPayload, 'jobId'>;

  if (!body.inputPath || !body.presetId || !body.format) {
    return Response.json({ error: 'invalid payload' }, { status: 400 });
  }
  const tier = resolveSubscriptionTier(request);
  if (tier === 'free') {
    const error = validateFreeTierJobs([body]);
    if (error) {
      return Response.json({ error }, { status: 400 });
    }
  }

  const newJobId = await enqueueConvertJob({
    ...body,
    tier,
    watermarkText: resolveWatermarkTextByTier(tier),
  });
  return Response.json({ jobId: newJobId, status: 'queued' });
}
