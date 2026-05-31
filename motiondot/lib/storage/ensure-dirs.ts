
import { mkdir } from 'fs/promises';
import {
  getTempArchiveDir,
  getTempLogsDir,
  getTempJobsDir,
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
    getTempLogsDir(),
    getTempJobsDir(),
    getOutputGifDir(),
    getOutputMp4Dir(),
    getOutputWebpDir(),
    getExportMetaDir(),
  ];
  await Promise.all(dirs.map((dir) => mkdir(dir, { recursive: true })));
}
