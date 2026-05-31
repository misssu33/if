import 'server-only';

import { mkdir } from 'fs/promises';
import {
  getTempArchiveDir,
  getTempFramesDir,
  getTempGifDir,
  getOutputGifDir,
  getOutputMp4Dir,
  getOutputWebpDir,
  getExportMetaDir,
} from './paths';

/** temp/ · outputs/ 하위 디렉터리 생성 (없으면) */
export async function ensureStorageDirs(): Promise<void> {
  const dirs = [
    getTempFramesDir(),
    getTempGifDir(),
    getTempArchiveDir(),
    getOutputGifDir(),
    getOutputMp4Dir(),
    getOutputWebpDir(),
    getExportMetaDir(),
  ];
  await Promise.all(dirs.map((dir) => mkdir(dir, { recursive: true })));
}
