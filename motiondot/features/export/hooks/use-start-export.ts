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
import { useFreeTier } from '@/hooks/useFreeTier';

/** 수동 export — 아직 큐에 없는 파일만 등록 */
export function useStartExport() {
  const [loading, setLoading] = useState(false);
  const files = useBatchStore((s) => s.files);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const hasSettings = useHasValidExportSettings();
  const { canExport: canExportTier, recordExport, applyLimitsToSettings } =
    useFreeTier();
  const registerBatch = useConversionStore((s) => s.registerBatch);
  const activeFileIdList = useConversionStore(
    useShallow((s) =>
      s.jobs
        .filter((j) => j.status !== 'failed' && j.status !== 'cancelled')
        .map((j) => j.fileId),
    ),
  );
  const activeFileIds = useMemo(
    () => new Set(activeFileIdList),
    [activeFileIdList],
  );

  const startExport = useCallback(async () => {
    if (!resolved || files.length === 0 || !canExportTier) return;

    const pendingFiles = files.filter(
      (f) =>
        (!f.mediaKind || f.mediaKind === 'video') &&
        !activeFileIds.has(f.id),
    );

    if (pendingFiles.length === 0) return;

    const settings = applyLimitsToSettings(resolved);

    setLoading(true);
    try {
      const { batchId, jobIds } = await enqueueConvertBatch({
        jobs: pendingFiles.map((file) => ({
          fileId: file.id,
          inputPath: file.tempPath,
          presetId: settings.presetId,
          format: settings.outputFormat,
          quality: settings.quality,
          width: settings.width,
          height: settings.height,
          fps: settings.fps,
          loop: settings.loop,
          maxFileSizeBytes: settings.maxFileSizeBytes,
          overrides,
        })),
      });

      registerBatch({
        batchId,
        jobIds,
        files: pendingFiles,
        presetId: settings.presetId,
        format: settings.outputFormat,
        quality: settings.quality,
        width: settings.width,
        height: settings.height,
        fps: settings.fps,
        loop: settings.loop,
        maxFileSizeBytes: settings.maxFileSizeBytes,
      });

      recordExport(pendingFiles.length);
    } finally {
      setLoading(false);
    }
  }, [
    files,
    resolved,
    overrides,
    registerBatch,
    activeFileIdList,
    canExportTier,
    applyLimitsToSettings,
    recordExport,
  ]);

  return {
    startExport,
    loading,
    canExport: hasSettings && files.length > 0 && canExportTier,
  };
}
