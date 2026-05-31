'use client';

import type { BatchConvertRequest, BatchConvertResponse } from '@/types';

/** 클라이언트: 배치 변환 큐 등록 API */
export async function enqueueConvertBatch(
  body: BatchConvertRequest,
): Promise<BatchConvertResponse> {
  const res = await fetch('/api/jobs/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? 'Batch enqueue failed');
  }

  return res.json() as Promise<BatchConvertResponse>;
}
