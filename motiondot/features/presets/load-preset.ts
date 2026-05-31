import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { getPresetsDir } from '@/lib/storage';
import type { VideoPreset } from '@/types';

/** presets/*.json 단일 로드 (서버 전용) */
export async function loadPreset(id: string): Promise<VideoPreset> {
  const filePath = path.join(getPresetsDir(), `${id}.json`);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as VideoPreset;
}

/** presets/ 디렉터리의 모든 JSON 프리셋 */
export async function listPresets(): Promise<VideoPreset[]> {
  const dir = getPresetsDir();
  const entries = await readdir(dir, { withFileTypes: true });
  const jsonFiles = entries.filter((e) => e.isFile() && e.name.endsWith('.json'));

  return Promise.all(
    jsonFiles.map((e) => loadPreset(path.basename(e.name, '.json'))),
  );
}
