import { getJobProgress } from '@/lib/queue';

/** 작업 진행률 조회 (폴링용) */
export async function GET(request: Request) {
  const jobId = new URL(request.url).searchParams.get('jobId');
  if (!jobId) {
    return Response.json({ error: 'jobId required' }, { status: 400 });
  }

  const progress = await getJobProgress(jobId);
  if (!progress) {
    return Response.json({ jobId, status: 'pending', progress: 0 });
  }
  return Response.json(progress);
}
