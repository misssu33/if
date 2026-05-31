import type { BatchProgressResponse } from '@/types';

/** 전송 계층 업데이트 (폴링 · WebSocket · SSE 공통) */
export type ProgressTransportUpdate = BatchProgressResponse;

export interface ProgressTransport {
  /** 구독 시작 — cleanup 함수 반환 */
  subscribe(
    batchId: string,
    onUpdate: (data: ProgressTransportUpdate) => void,
  ): () => void;
}
