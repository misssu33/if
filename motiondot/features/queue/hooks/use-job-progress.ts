'use client';

import { useCallback, useEffect, useState } from 'react';
import type { JobProgress } from '@/types';

/** 실시간(폴링) 작업 진행률 */
export function useJobProgress(jobId: string | null, intervalMs = 2000) {
  const [progress, setProgress] = useState<JobProgress | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!jobId) return;
    const res = await fetch(`/api/jobs/progress?jobId=${jobId}`);
    if (res.ok) {
      setProgress((await res.json()) as JobProgress);
    }
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    fetchProgress();
    const id = setInterval(fetchProgress, intervalMs);
    return () => clearInterval(id);
  }, [jobId, intervalMs, fetchProgress]);

  return { progress, refetch: fetchProgress };
}
