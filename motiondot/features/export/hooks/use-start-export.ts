'use client';

import { useCallback, useState } from 'react';
import { useBatchStore } from '@/stores';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import {
  useExportSettingsStore,
  useHasValidExportSettings,
} from '@/features/presets/stores/use-export-settings-store';

/** export 파이프라인: resolved 설정으로 배치 큐 등록 */
export function useStartExport() {
  const [loading, setLoading] = useState(false);
  const files = useBatchStore((s) => s.files);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const overrides = useExportSettingsStore((s) => s.overrides);
  const hasSettings = useHasValidExportSettings();
  const registerBatch = useConversionStore((s) => s.registerBatch);

  const startExport = useCallback(async () => {
    if (!resolved || files.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/jobs/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobs: files.map((file) => ({
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
        }),
      });

      if (!res.ok) throw new Error('Batch enqueue failed');

      const { batchId, jobIds } = (await res.json()) as {
        batchId: string;
        jobIds: string[];
      };

      registerBatch({
        batchId,
        jobIds,
        files,
        presetId: resolved.presetId,
        format: resolved.outputFormat,
        quality: resolved.quality,
        width: resolved.width,
        height: resolved.height,
        fps: resolved.fps,
      });
    } finally {
      setLoading(false);
    }
  }, [files, resolved, overrides, registerBatch]);

  return {
    startExport,
    loading,
    canExport: hasSettings && files.length > 0,
  };
}
