'use client';

import { ProgressBar } from '@/components/feedback';
import { Button } from '@/components/ui';
import { useBatchConversionActions } from '@/features/queue/hooks/use-batch-conversion-actions';
import { useExportProgress } from '../hooks/use-export-progress';
import { useExportProgressStore } from '../stores/use-export-progress-store';
import { ExportStatusBadge } from './export-status-badge';

function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-violet-600 border-t-transparent dark:border-violet-400"
      aria-hidden="true"
    />
  );
}

/** Export 진행 패널 — 모바일 상단 고정, 즉시 피드백 */
export function ExportProgressPanel() {
  const {
    stage,
    displayProgress,
    statusText,
    etaLabel,
    isVisible,
    isRunning,
    isSuccess,
    isFailed,
    failedJobs,
    completedCount,
    totalCount,
  } = useExportProgress();
  const dismiss = useExportProgressStore((s) => s.dismiss);
  const { retryJob } = useBatchConversionActions();

  if (!isVisible) return null;

  return (
    <div
      className="sticky top-0 z-10 -mx-4 border-y border-violet-200 bg-violet-50/95 px-4 py-3 backdrop-blur-sm dark:border-violet-900 dark:bg-violet-950/90 sm:-mx-6 sm:px-6"
      role="region"
      aria-label="Export 진행 상태"
      aria-live="polite"
      aria-busy={isRunning}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {isRunning && <Spinner />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {isSuccess
                  ? 'Export 완료'
                  : isFailed
                    ? 'Export 실패'
                    : 'Export 진행 중'}
              </p>
              {totalCount > 0 && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {completedCount}/{totalCount} 파일
                </p>
              )}
            </div>
          </div>
          <ExportStatusBadge stage={stage} />
        </div>

        {isRunning && (
          <>
            <div className="flex items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-300">
              <span className="min-w-0 truncate">{statusText || '처리 중…'}</span>
              <span className="shrink-0 font-mono font-medium tabular-nums">
                {displayProgress}%
              </span>
            </div>
            <ProgressBar value={displayProgress} />
            {etaLabel && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{etaLabel}</p>
            )}
          </>
        )}

        {isSuccess && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            변환이 완료되었습니다. 아래에서 다운로드할 수 있습니다.
          </div>
        )}

        {isFailed && (
          <div className="flex flex-col gap-2">
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
              role="alert"
            >
              {statusText || '변환 중 오류가 발생했습니다.'}
            </p>
            {failedJobs.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  for (const job of failedJobs) {
                    void retryJob(job.jobId);
                  }
                  useExportProgressStore.getState().beginSession();
                  useExportProgressStore
                    .getState()
                    .attachBatch(failedJobs[0]!.batchId);
                }}
              >
                다시 시도
              </Button>
            )}
          </div>
        )}

        {(isSuccess || isFailed) && (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={dismiss}
          >
            닫기
          </Button>
        )}
      </div>
    </div>
  );
}
