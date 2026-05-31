import { getBatchProgress } from '@/lib/queue';

/** 배치 전체 진행률 (폴링 / SSE 대체) */
export async function GET(request: Request) {
  const batchId = new URL(request.url).searchParams.get('batchId');
  if (!batchId) {
    return Response.json({ error: 'batchId required' }, { status: 400 });
  }

  const data = await getBatchProgress(batchId);
  return Response.json(data);
}
