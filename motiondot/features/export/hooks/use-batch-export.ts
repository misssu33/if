'use client';

import { useCallback } from 'react';
import { useBatchStore } from '@/stores';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import {
  useExportSettingsStore,
  useHasValidExportSettings,
} from '@/features/presets/stores/use-export-settings-store';
import { useExportSessionStore } from '../stores/use-export-session-store';
import { useExportProgressStore } from '../stores/use-export-progress-store';
import { trackExportStarted, trackTemplateAbandoned } from '@/lib/analytics';

/** 다중 포맷 · 다중 파일 배치 export → 기존 큐 연동 */
export function useBatchExport() {
  const files = useBatchStore((s) => s.files);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const hasSettings = useHasValidExportSettings();
  const formats = useExportSessionStore((s) => s.selectedFormats);
  const namingPattern = useExportSessionStore((s) => s.namingPattern);
  const setLastBatchId = useExportSessionStore((s) => s.setLastBatchId);
  const registerBatch = useConversionStore((s) => s.registerBatch);
  const beginSession = useExportProgressStore((s) => s.beginSession);
  const attachBatch = useExportProgressStore((s) => s.attachBatch);
  const markError = useExportProgressStore((s) => s.markError);
  const isBlockingExport = useExportProgressStore((s) => s.isBlockingExport);

  const runBatchExport = useCallback(async () => {
    if (
      !resolved ||
      files.length === 0 ||
      formats.length === 0 ||
      isBlockingExport
    ) {
      return;
    }

    beginSession();
    trackExportStarted();

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

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Batch export failed');
      }

      const { batchId, jobIds } = (await res.json()) as {
        batchId: string;
        jobIds: string[];
      };

      setLastBatchId(batchId);
      attachBatch(batchId);

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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Batch export failed';
      trackTemplateAbandoned('enqueue_failed');
      markError(message);
    }
  }, [
    files,
    formats,
    resolved,
    overrides,
    namingPattern,
    setLastBatchId,
    registerBatch,
    isBlockingExport,
    beginSession,
    attachBatch,
    markError,
  ]);

  return {
    runBatchExport,
    loading: isBlockingExport,
    canExport:
      hasSettings && files.length > 0 && formats.length > 0 && !isBlockingExport,
    formats,
  };
}
