'use client';

import { useCallback } from 'react';
import { useBatchStore } from '@/stores';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import { enqueueConvertBatch } from '@/features/queue/services/enqueue-batch-client';
import {
  useExportSettingsStore,
  useHasValidExportSettings,
} from '@/features/presets/stores/use-export-settings-store';
import { useExportProgressStore } from '../stores/use-export-progress-store';

/** 수동 export — 아직 큐에 없는 파일만 등록 */
export function useStartExport() {
  const files = useBatchStore((s) => s.files);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const hasSettings = useHasValidExportSettings();
  const registerBatch = useConversionStore((s) => s.registerBatch);
  const beginSession = useExportProgressStore((s) => s.beginSession);
  const attachBatch = useExportProgressStore((s) => s.attachBatch);
  const markError = useExportProgressStore((s) => s.markError);
  const isBlockingExport = useExportProgressStore((s) => s.isBlockingExport);

  const activeFileIds = useConversionStore((s) =>
    new Set(
      s.jobs
        .filter((j) => j.status !== 'failed' && j.status !== 'cancelled')
        .map((j) => j.fileId),
    ),
  );

  const startExport = useCallback(async () => {
    if (!resolved || files.length === 0 || isBlockingExport) return;

    const pendingFiles = files.filter(
      (f) =>
        (!f.mediaKind || f.mediaKind === 'video') &&
        !activeFileIds.has(f.id),
    );

    if (pendingFiles.length === 0) return;

    beginSession();

    try {
      const { batchId, jobIds } = await enqueueConvertBatch({
        jobs: pendingFiles.map((file) => ({
          fileId: file.id,
          inputPath: file.tempPath,
          presetId: resolved.presetId,
          format: resolved.outputFormat,
          quality: resolved.quality,
          width: resolved.width,
          height: resolved.height,
          fps: resolved.fps,
          loop: resolved.loop,
          maxFileSizeBytes: resolved.maxFileSizeBytes,
          overrides,
        })),
      });

      attachBatch(batchId);

      registerBatch({
        batchId,
        jobIds,
        files: pendingFiles,
        presetId: resolved.presetId,
        format: resolved.outputFormat,
        quality: resolved.quality,
        width: resolved.width,
        height: resolved.height,
        fps: resolved.fps,
        loop: resolved.loop,
        maxFileSizeBytes: resolved.maxFileSizeBytes,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Batch enqueue failed';
      markError(message);
    }
  }, [
    files,
    resolved,
    overrides,
    registerBatch,
    activeFileIds,
    isBlockingExport,
    beginSession,
    attachBatch,
    markError,
  ]);

  return {
    startExport,
    loading: isBlockingExport,
    canExport: hasSettings && files.length > 0 && !isBlockingExport,
  };
}
