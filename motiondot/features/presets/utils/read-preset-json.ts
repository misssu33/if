import { readFile } from 'fs/promises';
import path from 'path';
import { getSnsExportPresetById } from '@/config/sns-export-presets';
import { getPresetsDir } from '@/lib/storage/paths';
import type { MotionDotPreset } from '@/types';

/** server-only 없이 프리셋 로드 (config 우선 → presets/*.json) */
export async function readPresetJson(id: string): Promise<MotionDotPreset> {
  const fromConfig = getSnsExportPresetById(id);
  if (fromConfig) return fromConfig;

  const filePath = path.join(getPresetsDir(), `${id}.json`);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as MotionDotPreset;
}
