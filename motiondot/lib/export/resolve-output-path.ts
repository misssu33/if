import path from 'path';
import {
  getOutputGifDir,
  getOutputMp4Dir,
  getOutputWebpDir,
} from '@/lib/storage/paths';
import type { OutputFormat } from '@/types';

/** 최종 outputs/ 경로 (server-only 없음 — worker·스크립트 공용) */
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
