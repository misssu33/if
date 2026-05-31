import { Redis } from 'ioredis';
import { getRedisHostConfig } from '@/lib/redis';

const PROGRESS_KEY = (jobId: string) => `motiondot:progress:${jobId}`;

/** 작업 진행률 조회 (폴링용) */
export async function GET(request: Request) {
  const jobId = new URL(request.url).searchParams.get('jobId');
  if (!jobId) {
    return Response.json({ error: 'jobId required' }, { status: 400 });
  }

  const redis = new Redis(getRedisHostConfig());
  try {
    const raw = await redis.get(PROGRESS_KEY(jobId));
    if (!raw) {
      return Response.json({ jobId, status: 'pending', progress: 0 });
    }
    return Response.json(JSON.parse(raw));
  } finally {
    redis.disconnect();
  }
}
