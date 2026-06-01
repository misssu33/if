'use client';

import { useBatchStore } from '@/stores';
import { PreviewPanel } from '@/features/preview';
import { ExportPanel, BatchDownloadPanel } from '@/features/export';
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
    <div className="flex min-w-0 flex-col gap-6">
      <OnboardingTooltip id="export-formats" />
      {!hasVideo && (
        <EmptyState
          title="배치 변환용 비디오가 없습니다"
          description="GIF/MP4/WebP 변환은 비디오 업로드가 필요합니다. 1단계에서 비디오를 추가하거나 샘플 템플릿만 미리보기할 수 있습니다."
          actionLabel="1단계로 이동"
          onAction={() => useOnboardingStore.getState().setStep(1)}
        />
      )}
      <div className="flex min-w-0 flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start">
        {/* 모바일: 변환·Export 우선 */}
        <div className="order-1 flex min-w-0 flex-col gap-6 lg:order-2">
          <ExportPanel />
          <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800 sm:p-6">
            <h3 className="mb-3 text-sm font-semibold">다운로드</h3>
            <BatchDownloadPanel />
          </section>
          <BatchProgressPanel />
        </div>
        <div className="order-2 min-w-0 lg:order-1">
          <PreviewPanel />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-start">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => prevStep()}
        >
          이전
        </Button>
      </div>
    </div>
  );
}
