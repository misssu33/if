import type { ConvertJobPayload } from '@/types';

export async function cancelJobApi(jobId: string): Promise<void> {
  const res = await fetch(`/api/jobs/${jobId}/cancel`, { method: 'POST' });
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    throw new Error(body.error ?? 'Cancel failed');
  }
}

export async function retryJobApi(
  oldJobId: string,
  payload: Omit<ConvertJobPayload, 'jobId'>,
): Promise<string> {
  const res = await fetch(`/api/jobs/${oldJobId}/retry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Retry failed');
  }
  const data = (await res.json()) as { jobId: string };
  return data.jobId;
}
