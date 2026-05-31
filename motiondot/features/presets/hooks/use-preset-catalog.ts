'use client';

import { useEffect, useState } from 'react';
import type { MotionDotPreset } from '@/types';

/** 클라이언트: /api/presets 카탈로그 로드 */
export function usePresetCatalog() {
  const [presets, setPresets] = useState<MotionDotPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch('/api/presets');
        if (!res.ok) throw new Error('Failed to load presets');
        const data = (await res.json()) as MotionDotPreset[];
        if (active) setPresets(data);
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : 'Load failed');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { presets, loading, error };
}
