import type { ProgressTransport } from './progress-transport';
import { createPollingTransport } from './polling-transport';

/**
 * SSE transport 스텁 — EventSource 연동 시 교체
 * 현재는 polling fallback
 */
export function createSseTransport(): ProgressTransport {
  return createPollingTransport();
}
