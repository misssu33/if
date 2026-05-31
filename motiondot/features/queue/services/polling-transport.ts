import type { ProgressTransport } from './progress-transport';
import { fetchBatchProgress } from './progress-api';

/** 폴링 기반 진행률 (기본) — SSE/WebSocket 전환 시 transport만 교체 */
export function createPollingTransport(
  intervalMs = 1500,
): ProgressTransport {
  return {
    subscribe(batchId, onUpdate) {
      let active = true;

      const poll = async () => {
        if (!active) return;
        try {
          const data = await fetchBatchProgress(batchId);
          if (active) onUpdate(data);
        } catch {
          /* 다음 폴링에서 재시도 */
        }
      };

      void poll();
      const id = setInterval(() => void poll(), intervalMs);

      return () => {
        active = false;
        clearInterval(id);
      };
    },
  };
}
