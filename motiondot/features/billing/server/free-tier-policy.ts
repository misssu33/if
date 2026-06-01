import 'server-only';
import type { ConvertJobPayload } from '@/types';

export type SubscriptionTier = 'free' | 'pro';

const FREE_TIER_MAX_BATCH_JOBS = Number.parseInt(
  process.env.FREE_TIER_MAX_BATCH_JOBS ?? '3',
  10,
);
const FREE_TIER_MAX_WIDTH = Number.parseInt(
  process.env.FREE_TIER_MAX_WIDTH ?? '1280',
  10,
);
const FREE_TIER_MAX_HEIGHT = Number.parseInt(
  process.env.FREE_TIER_MAX_HEIGHT ?? '720',
  10,
);
const FREE_TIER_WATERMARK_TEXT =
  process.env.FREE_TIER_WATERMARK_TEXT ?? 'MotionDot Free';

/** 헤더 기반으로 요청 tier 판별 (기본 free) */
export function resolveSubscriptionTier(request: Request): SubscriptionTier {
  const rawTier = request.headers.get('x-motiondot-tier');
  return rawTier === 'pro' ? 'pro' : 'free';
}

/** free-tier 배치 작업 수 및 해상도 제한 검증 */
export function validateFreeTierJobs(
  jobs: Omit<ConvertJobPayload, 'jobId' | 'batchId'>[],
): string | null {
  if (jobs.length > FREE_TIER_MAX_BATCH_JOBS) {
    return `Free tier supports up to ${FREE_TIER_MAX_BATCH_JOBS} jobs per batch`;
  }

  for (const job of jobs) {
    if (job.width > FREE_TIER_MAX_WIDTH || job.height > FREE_TIER_MAX_HEIGHT) {
      return `Free tier max resolution is ${FREE_TIER_MAX_WIDTH}x${FREE_TIER_MAX_HEIGHT}`;
    }
  }

  return null;
}

/** tier에 따른 워터마크 텍스트 계산 */
export function resolveWatermarkTextByTier(
  tier: SubscriptionTier,
): string | undefined {
  if (tier === 'pro') return undefined;
  return FREE_TIER_WATERMARK_TEXT;
}
