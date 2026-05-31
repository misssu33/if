'use client';

import { useBatchStore } from '@/stores';
import { PreviewPanel } from '@/features/preview';
import {
  ExportPanel,
  ExportProgress,
  BatchDownloadPanel,
} from '@/features/export';
import { BatchProgressPanel } from '@/features/queue';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { OnboardingTooltip } from './onboarding-tooltip';
import { Button } from '@/components/ui';
import { EmptyState } from './empty-state';

export function StepPreviewExport() {
  const files = useBatchStore((s) => s.files);
  const prevStep = useOnboardingStore((s) => s.prevStep);
  const hasVideo = files.some((f) => !f.mediaKind || f.mediaKind === 'video');

  return (
    <div className="flex flex-col gap-6">
      <OnboardingTooltip id="export-formats" />
      {!hasVideo && (
        <EmptyState
          title="배치 변환용 비디오가 없습니다"
          description="GIF/MP4/WebP 변환은 비디오 업로드가 필요합니다. 1단계에서 비디오를 추가하거나 샘플 템플릿만 미리보기할 수 있습니다."
          actionLabel="1단계로 이동"
          onAction={() => useOnboardingStore.getState().setStep(1)}
        />
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <PreviewPanel />
        <div className="flex flex-col gap-6">
          <ExportPanel />
          <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="mb-3 text-sm font-semibold">Export 진행</h3>
            <ExportProgress />
            <BatchDownloadPanel />
          </section>
          <BatchProgressPanel />
        </div>
      </div>
      <div className="flex justify-start">
        <Button type="button" variant="secondary" onClick={() => prevStep()}>
          이전
        </Button>
      </div>
    </div>
  );
}
