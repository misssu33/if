'use client';

import { PageShell } from '@/components/ui';
import { AppHeader } from '@/components/layout';
import { UploadZone } from '@/features/upload';
import { PreviewPanel } from '@/features/preview';
import { PresetSelector } from '@/features/presets';
import {
  ExportPanel,
  ExportProgress,
  BatchDownloadPanel,
  ExportHistoryList,
} from '@/features/export';
import { BatchProgressPanel } from '@/features/queue';

/** MotionDot 메인 워크스페이스 — feature 조합만 담당 */
export function ConverterWorkspace() {
  return (
    <PageShell className="min-h-screen">
      <AppHeader />
      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-6 px-6 py-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <UploadZone />
          <PresetSelector />
          <ExportPanel />
          <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Export 진행 · 다운로드
            </h2>
            <ExportProgress />
            <BatchDownloadPanel />
          </section>
        </div>
        <div className="flex flex-col gap-6">
          <PreviewPanel />
          <BatchProgressPanel />
          <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Export 히스토리
            </h2>
            <ExportHistoryList />
          </section>
        </div>
      </div>
    </PageShell>
  );
}
