'use client';

import { useEffect } from 'react';
import { useBatchStore } from '@/stores';
import { usePreviewStore } from '@/features/preview/stores/use-preview-store';

/** 이미지 업로드 플로우: 미리보기·Export 포맷을 GIF로 맞춤 */
export function useImageGifPreviewFormat(enabled: boolean) {
  const files = useBatchStore((s) => s.files);
  const setPreviewFormat = usePreviewStore((s) => s.setPreviewFormat);

  useEffect(() => {
    if (!enabled) return;
    const hasImage = files.some((f) => f.mediaKind === 'image');
    if (hasImage) {
      setPreviewFormat('gif');
    }
  }, [enabled, files, setPreviewFormat]);
}
