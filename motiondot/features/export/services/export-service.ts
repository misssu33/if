import 'server-only';

import path from 'path';
import {
  getOutputGifDir,
  getOutputMp4Dir,
  getOutputWebpDir,
} from '@/lib/storage';
import type { OutputFormat } from '@/types';

/** export 파이프라인: 최종 outputs/ 경로 결정 */
export function resolveOutputPath(
  jobId: string,
  format: OutputFormat,
  ext?: string,
): string {
  const suffix = ext ?? format;
  const filename = `${jobId}.${suffix}`;

  const dir =
    format === 'gif'
      ? getOutputGifDir()
      : format === 'mp4'
        ? getOutputMp4Dir()
        : getOutputWebpDir();

  return path.join(dir, filename);
}
