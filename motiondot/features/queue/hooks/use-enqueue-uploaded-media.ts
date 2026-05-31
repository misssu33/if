'use client';

import { useCallback } from 'react';
import type { UploadFileMeta } from '@/types';
import {
  useExportSettingsStore,
  useHasValidExportSettings,
} from '@/features/presets/stores/use-export-settings-store';
import { useExportSessionStore } from '@/features/export/stores/use-export-session-store';
import { useConversionStore } from '../stores/use-conversion-store';
import { enqueueConvertBatch } from '../services/enqueue-batch-client';

/** 업로드 완료 미디어 → BullMQ 자동 등록 */
export function useEnqueueUploadedMedia() {
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const hasSettings = useHasValidExportSettings();
  const formats = useExportSessionStore((s) => s.selectedFormats);
  const attachQueueJobs = useConversionStore((s) => s.attachQueueJobs);
  const completeImageOnlyJob = useConversionStore((s) => s.completeImageOnlyJob);
  const failJobByLocalId = useConversionStore((s) => s.failJobByLocalId);

  const enqueueUploaded = useCallback(
    async (
      items: { localId: string; meta: UploadFileMeta }[],
    ): Promise<void> => {
      if (!resolved || items.length === 0) return;

      const videos = items.filter(
        (i) => !i.meta.mediaKind || i.meta.mediaKind === 'video',
      );
      const images = items.filter((i) => i.meta.mediaKind === 'image');

      for (const { localId } of images) {
        completeImageOnlyJob(localId);
      }

      if (videos.length === 0 || !hasSettings) {
        if (videos.length > 0 && !hasSettings) {
          for (const { localId } of videos) {
            failJobByLocalId(
              localId,
              'SNS 프리셋을 선택하면 비디오가 자동 변환됩니다.',
            );
          }
        }
        return;
      }

      const apiJobs = videos.flatMap(({ meta }) =>
        formats.map((format) => ({
          fileId: meta.id,
          inputPath: meta.tempPath,
          presetId: resolved.presetId,
          format,
          quality: resolved.quality,
          width: resolved.width,
          height: resolved.height,
          fps: resolved.fps,
          loop: resolved.loop,
          maxFileSizeBytes: resolved.maxFileSizeBytes,
          overrides,
        })),
      );

      const { batchId, jobIds } = await enqueueConvertBatch({ jobs: apiJobs });

      let jobIndex = 0;
      const mappings = videos.flatMap(({ localId, meta }) =>
        formats.map((format) => ({
          localId,
          fileId: meta.id,
          jobId: jobIds[jobIndex++] ?? '',
          presetId: resolved.presetId,
          format,
          quality: resolved.quality,
          width: resolved.width,
          height: resolved.height,
          fps: resolved.fps,
          loop: resolved.loop,
          maxFileSizeBytes: resolved.maxFileSizeBytes,
        })),
      );

      attachQueueJobs(batchId, mappings);
    },
    [
      resolved,
      overrides,
      hasSettings,
      formats,
      attachQueueJobs,
      completeImageOnlyJob,
      failJobByLocalId,
    ],
  );

  return { enqueueUploaded, canAutoEnqueue: hasSettings };
}
