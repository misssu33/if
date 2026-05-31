import type { ConversionFileStatus } from '../types';

const LABELS: Record<ConversionFileStatus, string> = {
  pending: '대기',
  queued: '큐 대기',
  processing: '변환 중',
  completed: '완료',
  failed: '실패',
  cancelled: '취소',
};

const STYLES: Record<ConversionFileStatus, string> = {
  pending: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  queued: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  processing: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  failed: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  cancelled: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
};

type ConversionStatusBadgeProps = {
  status: ConversionFileStatus;
};

export function ConversionStatusBadge({ status }: ConversionStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
