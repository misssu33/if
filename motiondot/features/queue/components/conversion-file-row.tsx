'use client';

import { ProgressBar } from '@/components/feedback';
import { Button } from '@/components/ui';
import type { ConversionJobItem } from '../types';
import { ConversionStatusBadge } from './conversion-status-badge';

type ConversionFileRowProps = {
  job: ConversionJobItem;
  onCancel: (jobId: string) => void;
  onRetry: (jobId: string) => void;
  onRemove?: () => void;
};

export function ConversionFileRow({
  job,
  onCancel,
  onRetry,
  onRemove,
}: ConversionFileRowProps) {
  const isUploadPhase =
    job.status === 'pending' &&
    job.uploadProgress !== undefined &&
    job.uploadProgress < 100;

  const displayProgress = isUploadPhase
    ? job.uploadProgress ?? 0
    : job.progress;

  const progressLabel = isUploadPhase
    ? `업로드 ${displayProgress}%`
    : job.status === 'processing'
      ? `변환 ${displayProgress}%`
      : undefined;

  const canCancel =
    !isUploadPhase &&
    (job.status === 'queued' || job.status === 'processing');
  const canRetry =
    job.status === 'failed' || job.status === 'cancelled';
  const canRemove = !!onRemove && job.status === 'pending' && !isUploadPhase;

  return (
    <li className="min-w-0 rounded-lg border border-zinc-200 p-3 sm:p-4 dark:border-zinc-800">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {job.fileName}
          </p>
          {job.message && (
            <p className="mt-0.5 text-xs text-zinc-500">{job.message}</p>
          )}
          {progressLabel && (
            <p className="mt-0.5 text-xs text-violet-600 dark:text-violet-400">
              {progressLabel}
            </p>
          )}
        </div>
        <ConversionStatusBadge status={job.status} />
      </div>

      <ProgressBar value={displayProgress} />

      {job.error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{job.error}</p>
      )}

      {job.outputPath && job.status === 'completed' && (
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
          {job.outputPath}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {onRemove && (
          <Button
            type="button"
            variant="secondary"
            className="min-h-10 px-3 py-2 text-xs sm:min-h-0 sm:!px-2 sm:!py-1"
            onClick={onRemove}
          >
            제거
          </Button>
        )}
        {canCancel && !job.jobId.startsWith('pending') && (
          <Button
            type="button"
            variant="secondary"
            className="min-h-10 px-3 py-2 text-xs sm:min-h-0 sm:!px-2 sm:!py-1"
            onClick={() => onCancel(job.jobId)}
          >
            취소
          </Button>
        )}
        {canRetry && !job.jobId.startsWith('pending') && (
          <Button
            type="button"
            variant="primary"
            className="min-h-10 px-3 py-2 text-xs sm:min-h-0 sm:!px-2 sm:!py-1"
            onClick={() => onRetry(job.jobId)}
          >
            재시도
          </Button>
        )}
      </div>
    </li>
  );
}
