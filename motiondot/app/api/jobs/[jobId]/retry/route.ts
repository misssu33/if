import { enqueueConvertJob } from '@/lib/queue';
import type { ConvertJobPayload } from '@/types';

type RouteContext = { params: Promise<{ jobId: string }> };

/** 실패 작업 재시도 (새 jobId) */
export async function POST(request: Request, context: RouteContext) {
  const { jobId: _oldId } = await context.params;
  const body = (await request.json()) as Omit<ConvertJobPayload, 'jobId'>;

  if (!body.inputPath || !body.presetId || !body.format) {
    return Response.json({ error: 'invalid payload' }, { status: 400 });
  }

  const newJobId = await enqueueConvertJob(body);
  return Response.json({ jobId: newJobId, status: 'queued' });
}
