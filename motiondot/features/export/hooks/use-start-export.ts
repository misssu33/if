'use client';

import { useCallback, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useBatchStore } from '@/stores';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import { enqueueConvertBatch } from '@/features/queue/services/enqueue-batch-client';
import {
  useExportSettingsStore,
  useHasValidExportSettings,
} from '@/features/presets/stores/use-export-settings-store';
import { trackExportStarted } from '@/lib/analytics/events';
import { usePreviewStore } from '@/features/preview/stores/use-preview-store';

/** 수동 export — 아직 큐에 없는 파일만 등록 */
export function useStartExport() {
  const [loading, setLoading] = useState(false);
  const files = useBatchStore((s) => s.files);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const hasSettings = useHasValidExportSettings();
  const registerBatch = useConversionStore((s) => s.registerBatch);
  const activeJobFileIds = useConversionStore(
    useShallow((s) =>
      s.jobs
        .filter((j) => j.status !== 'failed' && j.status !== 'cancelled')
        .map((j) => j.fileId),
    ),
  );
  const activeFileIds = useMemo(
    () => new Set(activeJobFileIds),
    [activeJobFileIds],
  );

  const startExport = useCallback(async () => {
    if (!resolved || files.length === 0) return;

    const pendingFiles = files.filter(
      (f) =>
        (!f.mediaKind || f.mediaKind === 'video') &&
        !activeFileIds.has(f.id),
    );

    if (pendingFiles.length === 0) return;

    setLoading(true);
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

      trackExportStarted({
        export_format: resolved.outputFormat,
        template_id: usePreviewStore.getState().templateId,
        preset_used: resolved.presetId,
        job_count: pendingFiles.length,
      });

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
    } finally {
      setLoading(false);
    }
  }, [files, resolved, overrides, registerBatch, activeFileIds]);

  return {
    startExport,
    loading,
    canExport: hasSettings && files.length > 0,
  };
}
