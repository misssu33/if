'use client';

import { useCallback, useState } from 'react';
import { useBatchStore } from '@/stores';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import {
  useExportSettingsStore,
  useHasValidExportSettings,
} from '@/features/presets/stores/use-export-settings-store';
import { useExportSessionStore } from '../stores/use-export-session-store';

/** 다중 포맷 · 다중 파일 배치 export → 기존 큐 연동 */
export function useBatchExport() {
  const [loading, setLoading] = useState(false);
  const files = useBatchStore((s) => s.files);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const hasSettings = useHasValidExportSettings();
  const formats = useExportSessionStore((s) => s.selectedFormats);
  const namingPattern = useExportSessionStore((s) => s.namingPattern);
  const setLastBatchId = useExportSessionStore((s) => s.setLastBatchId);
  const registerBatch = useConversionStore((s) => s.registerBatch);

  const runBatchExport = useCallback(async () => {
    if (!resolved || files.length === 0 || formats.length === 0) return;
    setLoading(true);
    try {
      const jobs = files.flatMap((file) =>
        formats.map((format) => ({
          fileId: file.id,
          inputPath: file.tempPath,
          presetId: resolved.presetId,
          format,
          quality: resolved.quality,
          width: resolved.width,
          height: resolved.height,
          fps: resolved.fps,
          loop: resolved.loop,
          maxFileSizeBytes: resolved.maxFileSizeBytes,
          overrides,
          namingPattern,
        })),
      );

      const res = await fetch('/api/export/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs }),
      });

      if (!res.ok) throw new Error('Batch export failed');

      const { batchId, jobIds } = (await res.json()) as {
        batchId: string;
        jobIds: string[];
      };

      setLastBatchId(batchId);
      const items = files.flatMap((file) =>
        formats.map((fmt) => ({
          fileId: file.id,
          fileName: file.originalName,
          inputPath: file.tempPath,
          presetId: resolved.presetId,
          format: fmt,
          quality: resolved.quality,
          width: resolved.width,
          height: resolved.height,
          fps: resolved.fps,
          loop: resolved.loop,
          maxFileSizeBytes: resolved.maxFileSizeBytes,
        })),
      );

      registerBatch({
        batchId,
        jobIds,
        items,
        presetId: resolved.presetId,
        format: formats[0],
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
  }, [
    files,
    formats,
    resolved,
    overrides,
    namingPattern,
    setLastBatchId,
    registerBatch,
  ]);

  return {
    runBatchExport,
    loading,
    canExport: hasSettings && files.length > 0 && formats.length > 0,
    formats,
  };
}
