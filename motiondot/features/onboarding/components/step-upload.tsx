'use client';

import { useBatchStore } from '@/stores';
import { UploadZone } from '@/features/upload';
import type { UploadMediaKind } from '@/features/upload';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { EmptyState } from './empty-state';
import { OnboardingTooltip } from './onboarding-tooltip';
import { Button } from '@/components/ui';

export function StepUpload() {
  const files = useBatchStore((s) => s.files);
  const intent = useOnboardingStore((s) => s.uploadIntent);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  const mediaKind: UploadMediaKind =
    intent === 'image' ? 'image' : 'video';

  const hasFiles = files.length > 0;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <OnboardingTooltip id="batch-conversion" />
      {!hasFiles ? (
        <EmptyState
          title="아직 업로드된 파일이 없습니다"
          description={
            intent === 'image'
              ? '이미지를 올리면 모션 템플릿 미리보기에 사용됩니다. 배치 변환은 비디오가 필요합니다.'
              : '비디오를 올리면 2단계에서 SNS 프리셋을 적용하고 GIF·MP4·WebP로 변환할 수 있습니다.'
          }
        />
      ) : null}
      <UploadZone mediaKind={mediaKind} />
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={!hasFiles && intent === 'video'}
          onClick={() => nextStep()}
        >
          다음: 프리셋 선택
        </Button>
      </div>
      {intent === 'image' && !hasFiles && (
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
