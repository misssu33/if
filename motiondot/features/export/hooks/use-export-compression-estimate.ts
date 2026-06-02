'use client';

import { useMemo } from 'react';
import { useBatchStore } from '@/stores';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import { usePreviewStore } from '@/features/preview/stores/use-preview-store';
import { useSizeEstimate } from './use-size-estimate';
import {
  getCompressionPreset,
  IMAGE_COMPRESSION_PRESETS,
} from '@/lib/image/compression-presets';
import { useImageCompressionStore } from '../stores/use-image-compression-store';
import { formatBytes } from '@/features/upload/utils/format-bytes';

/** Export 전 GIF 용량 + 이미지 압축 안내 */
export function useExportCompressionEstimate() {
  const resolved = useExportSettingsStore((s) => s.resolved);
  const compressionPresetId = useImageCompressionStore((s) => s.presetId);
  const files = useBatchStore((s) => s.files);
  const format = usePreviewStore((s) => s.previewFormat);
  const durationSec = usePreviewStore((s) => s.durationSec);

  const exportEstimate = useSizeEstimate({
    format,
    durationSec,
    enabled: !!resolved,
  });

  const imageFiles = useMemo(
    () => files.filter((f) => f.mediaKind === 'image'),
    [files],
  );

  const compressionPreset = getCompressionPreset(compressionPresetId);

  const sourceImageHint = useMemo(() => {
    if (imageFiles.length === 0) return null;
    if (!compressionPreset) {
      const total = imageFiles.reduce((sum, f) => sum + f.sizeBytes, 0);
      return {
        label: `원본 이미지 ${formatBytes(total)} (압축 꺼짐)`,
        detail: '압축을 켜면 업로드 시 용량을 줄일 수 있습니다.',
      };
    }
    const total = imageFiles.reduce((sum, f) => sum + f.sizeBytes, 0);
    return {
      label: `이미지 목표 ${compressionPreset.targetLabel}`,
      detail: `현재 서버 원본 ${formatBytes(total)} · 새 업로드부터 ${compressionPreset.shortLabel} 적용`,
    };
  }, [imageFiles, compressionPreset]);

  const coupangLimitHint = useMemo(() => {
    if (!resolved || resolved.platform !== 'coupang') return null;
    const limit = resolved.maxFileSizeBytes;
    if (!exportEstimate) return null;
    const over = exportEstimate.estimatedBytes > limit;
    return {
      limitLabel: formatBytes(limit),
      exportLabel: exportEstimate.label,
      over,
    };
  }, [resolved, exportEstimate]);

  return {
    exportEstimate,
    sourceImageHint,
    coupangLimitHint,
    compressionPresetId,
    presets: IMAGE_COMPRESSION_PRESETS,
  };
}
