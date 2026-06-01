'use client';

import type { ExportStage } from '../types/export-progress';
import { EXPORT_STAGE_LABELS } from '../types/export-progress';

type ExportStatusBadgeProps = {
  stage: ExportStage;
};

const BADGE_STYLES: Record<
  Exclude<ExportStage, 'idle'>,
  string
> = {
  preparing: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  rendering: 'bg-violet-100 text-violet-900 dark:bg-violet-950/50 dark:text-violet-200',
  encoding: 'bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200',
  optimizing: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200',
  completed: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200',
  failed: 'bg-red-100 text-red-900 dark:bg-red-950/50 dark:text-red-200',
};

/** Export 단계 뱃지 */
export function ExportStatusBadge({ stage }: ExportStatusBadgeProps) {
  if (stage === 'idle') return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_STYLES[stage]}`}
    >
      {EXPORT_STAGE_LABELS[stage]}
    </span>
  );
}
