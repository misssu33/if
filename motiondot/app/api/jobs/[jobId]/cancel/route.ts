import { cancelConvertJob } from '@/lib/queue';

type RouteContext = { params: Promise<{ jobId: string }> };

/** 작업 취소 (pending / queued / processing) */
export async function POST(_request: Request, context: RouteContext) {
  const { jobId } = await context.params;
  if (!jobId) {
    return Response.json({ error: 'jobId required' }, { status: 400 });
  }

  try {
    await cancelConvertJob(jobId);
    return Response.json({ jobId, status: 'cancelled' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cancel failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
