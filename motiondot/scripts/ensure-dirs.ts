/**
 * temp/ · outputs/ 디렉터리 초기화
 * 실행: npm run ensure-dirs
 */
import { mkdir } from 'fs/promises';
import {
  getTempArchiveDir,
  getTempFramesDir,
  getTempGifDir,
  getTempLogsDir,
  getTempJobsDir,
  getExportMetaDir,
  getOutputGifDir,
  getOutputMp4Dir,
  getOutputWebpDir,
} from '../lib/storage/paths';

async function main() {
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
  await Promise.all(dirs.map((d) => mkdir(d, { recursive: true })));
  console.log('[MotionDot] storage directories ready');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
