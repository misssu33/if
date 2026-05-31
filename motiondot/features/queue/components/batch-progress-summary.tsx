'use client';

import { ProgressBar } from '@/components/feedback';
import type { BatchProgressState } from '../types';

type BatchProgressSummaryProps = {
  batch: BatchProgressState;
};

/** 배치 전체 진행률 요약 */
export function BatchProgressSummary({ batch }: BatchProgressSummaryProps) {
  if (!batch.batchId || batch.total === 0) {
    return (
      <p className="text-sm text-zinc-500">변환 작업이 없습니다.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">
          전체 진행률
        </span>
        <span className="text-zinc-500">{batch.progress}%</span>
      </div>
      <ProgressBar value={batch.progress} />
      <dl className="grid grid-cols-3 gap-2 text-xs text-zinc-500 sm:grid-cols-6">
        <div>
          <dt>전체</dt>
          <dd className="font-medium text-zinc-800 dark:text-zinc-200">
            {batch.total}
          </dd>
        </div>
        <div>
          <dt>완료</dt>
          <dd className="font-medium text-emerald-600">{batch.completed}</dd>
        </div>
        <div>
          <dt>변환 중</dt>
          <dd className="font-medium text-violet-600">{batch.processing}</dd>
        </div>
        <div>
          <dt>대기</dt>
          <dd>{batch.queued + batch.pending}</dd>
        </div>
        <div>
          <dt>실패</dt>
          <dd className="font-medium text-red-600">{batch.failed}</dd>
        </div>
        <div>
          <dt>취소</dt>
          <dd>{batch.cancelled}</dd>
        </div>
      </dl>
    </div>
  );
}
