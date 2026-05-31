import { readConversionLog } from '@/lib/ffmpeg';

type RouteContext = { params: Promise<{ jobId: string }> };

/** 변환 로그 tail 조회 */
export async function GET(_request: Request, context: RouteContext) {
  const { jobId } = await context.params;
  const log = await readConversionLog(jobId);
  return Response.json({ jobId, log });
}
