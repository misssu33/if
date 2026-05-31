'use client';

import { useBatchStore } from '@/stores';
import { UploadZone } from '@/features/upload';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { useImageGifPreviewFormat } from '../hooks/use-image-gif-preview-format';
import { EmptyState } from './empty-state';
import { OnboardingFlowPlaceholder } from './onboarding-flow-placeholder';
import { OnboardingTooltip } from './onboarding-tooltip';
import { Button } from '@/components/ui';

export function StepUpload() {
  const files = useBatchStore((s) => s.files);
  const intent = useOnboardingStore((s) => s.uploadIntent);
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const openLanding = useOnboardingStore((s) => s.openLanding);

  const hasFiles = files.length > 0;
  const isVideoIntent = intent === 'video';
  const isImageIntent = intent === 'image';

  useImageGifPreviewFormat(isImageIntent);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <OnboardingTooltip id="batch-conversion" />

      {isVideoIntent ? (
        <OnboardingFlowPlaceholder intent="video" onBack={openLanding} />
      ) : (
        <>
          {!hasFiles ? (
            <EmptyState
              title="아직 업로드된 파일이 없습니다"
              description="이미지를 올리면 2단계에서 SNS GIF 프리셋·모션 템플릿을 적용하고 3단계에서 미리보기할 수 있습니다."
            />
          ) : null}
          <UploadZone mediaKind="image" />
        </>
      )}

      {!isVideoIntent && (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
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
            className="w-full sm:w-auto"
            onClick={() => nextStep()}
          >
            다음: 프리셋 · 템플릿
          </Button>
        </div>
      )}

      {isImageIntent && !hasFiles && (
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => nextStep()}
        >
          이미지 없이 템플릿만 선택
        </Button>
      )}
    </div>
  );
}
