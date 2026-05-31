import 'server-only';

import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { getSnsExportPresets } from '@/config/sns-export-presets';
import { getPresetsDir } from '@/lib/storage';
import type { MotionDotPreset } from '@/types';
import { validatePreset } from '../utils/validate-preset';

/** presets/{id}.json 단일 로드 */
export async function loadPreset(id: string): Promise<MotionDotPreset> {
  const sns = getSnsExportPresets().find((p) => p.id === id);
  if (sns) return sns;

  const filePath = path.join(getPresetsDir(), `${id}.json`);
  const raw = await readFile(filePath, 'utf-8');
  const data = JSON.parse(raw) as unknown;

  if (!validatePreset(data)) {
    throw new Error(`Invalid preset schema: ${id}`);
  }
  return data;
}

/** config/sns-export-presets.json — MVP SNS GIF 프리셋 */
export async function listSnsExportPresets(): Promise<MotionDotPreset[]> {
  return getSnsExportPresets();
}

/** presets/ 내 모든 JSON (README 제외) */
export async function listPresets(): Promise<MotionDotPreset[]> {
  const dir = getPresetsDir();
  const entries = await readdir(dir, { withFileTypes: true });
  const jsonFiles = entries.filter(
    (e) => e.isFile() && e.name.endsWith('.json'),
  );

  const presets = await Promise.all(
    jsonFiles.map((e) => loadPreset(path.basename(e.name, '.json'))),
  );

  return presets.sort((a, b) => a.name.localeCompare(b.name));
}
