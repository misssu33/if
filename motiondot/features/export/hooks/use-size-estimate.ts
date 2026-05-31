'use client';

import { useEffect, useState } from 'react';
import type { ExportSizeEstimate } from '@/types/export';
import type { OutputFormat } from '@/types';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';

type Options = {
  format: OutputFormat;
  durationSec: number;
  enabled?: boolean;
};

/** 렌더 전 용량 추정 API */
export function useSizeEstimate({ format, durationSec, enabled }: Options) {
  const resolved = useExportSettingsStore((s) => s.resolved);
  const [estimate, setEstimate] = useState<ExportSizeEstimate | null>(null);

  useEffect(() => {
    if (!enabled || !resolved) {
      setEstimate(null);
      return;
    }

    const params = new URLSearchParams({
      format,
      width: String(resolved.width),
      height: String(resolved.height),
      fps: String(resolved.fps),
      durationSec: String(durationSec),
      quality: resolved.quality,
      loop: String(resolved.loop),
    });

    void fetch(`/api/export/estimate?${params}`)
      .then((r) => r.json())
      .then((d) => setEstimate(d as ExportSizeEstimate))
      .catch(() => setEstimate(null));
  }, [enabled, resolved, format, durationSec]);

  return estimate;
}
