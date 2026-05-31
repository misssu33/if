import 'server-only';

import { randomUUID } from 'crypto';
import path from 'path';
import { writeFile } from 'fs/promises';
import { ensureStorageDirs, getTempArchiveDir } from '@/lib/storage';
import { MAX_VIDEO_BYTES } from '../constants';
import type { UploadFileMeta } from '../types';
import { validateVideoUpload } from './validate-upload-server';

/** 서버 전용: 업로드 버퍼 → temp/archive */
export async function saveUploadBuffer(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<UploadFileMeta> {
  const validationError = validateVideoUpload(
    originalName,
    mimeType,
    buffer.length,
    MAX_VIDEO_BYTES,
  );
  if (validationError) {
    throw new Error(validationError);
  }

  await ensureStorageDirs();
  const id = randomUUID();
  const tempPath = path.join(getTempArchiveDir(), `${id}-${originalName}`);
  await writeFile(tempPath, buffer);

  return {
    id,
    originalName,
    mimeType,
    sizeBytes: buffer.length,
    tempPath,
  };
}
