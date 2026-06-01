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
  const intent = useOnboardingStore((s) => s.uploadIntent);
  const prevStep = useOnboardingStore((s) => s.prevStep);
  const openLanding = useOnboardingStore((s) => s.openLanding);
  const hasVideo = files.some((f) => !f.mediaKind || f.mediaKind === 'video');
  const hasImage = files.some((f) => f.mediaKind === 'image');

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <OnboardingTooltip id="export-formats" />
      {intent === 'video' && (
        <EmptyState
          title="Video to GIF — 준비 중"
          description="비디오 배치 변환은 아직 연결되지 않았습니다. 이미지·템플릿 워크플로를 이용해 주세요."
          actionLabel="랜딩으로"
          onAction={openLanding}
        />
      )}
      {!hasVideo && intent !== 'video' && (
        <EmptyState
          title={hasImage ? '이미지 GIF · 모션 미리보기' : '배치 변환용 비디오가 없습니다'}
          description={
            hasImage
              ? '아래 미리보기에서 모션 템플릿을 확인하세요. FFmpeg 배치 Export는 비디오가 있을 때 사용할 수 있습니다.'
              : 'GIF/MP4/WebP 배치 변환은 비디오 업로드가 필요합니다. 1단계에서 비디오를 추가하거나 샘플 템플릿만 미리보기할 수 있습니다.'
          }
          actionLabel="1단계로 이동"
          onAction={() => useOnboardingStore.getState().setStep(1)}
        />
      )}
      <div className="flex min-w-0 flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start">
        <div className="order-1 flex min-w-0 flex-col gap-6 lg:order-2">
          {hasVideo && <ExportPanel />}
          <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800 sm:p-6">
            <h3 className="mb-3 text-sm font-semibold">Export 진행</h3>
            <ExportProgress />
            <BatchDownloadPanel />
          </section>
          {hasVideo && <BatchProgressPanel />}
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
          onClick={openLanding}
        >
          랜딩으로
        </Button>
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
