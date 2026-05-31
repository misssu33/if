'use client';

import { ProgressBar } from '@/components/feedback';
import type { UploadQueueItem } from '../types/upload-queue';
import { formatBytes } from '../utils/format-bytes';

type UploadFileItemProps = {
  item: UploadQueueItem;
  onRemove: () => void;
};

/** 업로드 큐 단일 파일 행 */
export function UploadFileItem({ item, onRemove }: UploadFileItemProps) {
  const { file, status, progress, error } = item;

  const statusLabel =
    status === 'queued'
      ? '대기'
      : status === 'uploading'
        ? `업로드 중 ${progress}%`
        : status === 'success'
          ? '완료'
          : '실패';

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {file.name}
          </p>
          <p className="text-xs text-zinc-500">
            {formatBytes(file.size)} · {statusLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-xs text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
          aria-label={`${file.name} 제거`}
        >
          제거
        </button>
      </div>
      {(status === 'uploading' || status === 'queued') && (
        <ProgressBar value={status === 'queued' ? 0 : progress} />
      )}
      {status === 'error' && error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </li>
  );
}
