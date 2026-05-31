'use client';

import { PageShell } from '@/components/ui';
import { AppHeader } from '@/components/layout';
import { UploadZone } from '@/features/upload';
import { PreviewPanel } from '@/features/preview';
import { PresetSelector } from '@/features/presets';
import { ExportPanel } from '@/features/export';
import { JobProgressList } from '@/features/queue';
import { useQueueUiStore } from '@/features/queue';

/** MotionDot 메인 워크스페이스 — feature 조합만 담당 */
export function ConverterWorkspace() {
  const activeJobIds = useQueueUiStore((s) => s.activeJobIds);

  const jobs = activeJobIds.map((jobId) => ({
    jobId,
    label: jobId.slice(0, 8),
    progress: 0,
    status: 'queued',
  }));

  return (
    <PageShell className="min-h-screen">
      <AppHeader />
      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-6 px-6 py-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <UploadZone />
          <PresetSelector />
          <ExportPanel />
        </div>
        <div className="flex flex-col gap-6">
          <PreviewPanel />
          <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              작업 진행률
            </h2>
            <JobProgressList jobs={jobs} />
          </section>
        </div>
      </div>
    </PageShell>
  );
}
