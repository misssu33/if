import { readFile } from 'fs/promises';
import path from 'path';
import { getPresetsDir } from '@/lib/storage/paths';
import type { MotionDotPreset } from '@/types';

/** server-only 없이 프리셋 JSON 로드 (스크립트·worker) */
export async function readPresetJson(id: string): Promise<MotionDotPreset> {
  const filePath = path.join(getPresetsDir(), `${id}.json`);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as MotionDotPreset;
}
