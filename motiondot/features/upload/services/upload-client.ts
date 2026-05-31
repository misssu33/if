'use client';

import type { UploadFileMeta } from '@/types';
import type { UploadMediaKind } from '../constants';

type UploadProgressHandler = (progress: number) => void;

/** 단일 파일 업로드 (XHR — 진행률 지원) */
export function uploadMediaFile(
  file: File,
  mediaKind: UploadMediaKind = 'video',
  onProgress?: UploadProgressHandler,
): Promise<UploadFileMeta> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append('file', file);
    form.append('mediaKind', mediaKind);

    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable || !onProgress) return;
      const pct = Math.round((event.loaded / event.total) * 100);
      onProgress(pct);
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as UploadFileMeta);
        } catch {
          reject(new Error('Invalid server response'));
        }
        return;
      }
      let message = `Upload failed (${xhr.status})`;
      try {
        const body = JSON.parse(xhr.responseText) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        /* ignore */
      }
      reject(new Error(message));
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.open('POST', '/api/upload');
    xhr.send(form);
  });
}

/** @deprecated uploadMediaFile 사용 */
export const uploadVideoFile = (
  file: File,
  onProgress?: UploadProgressHandler,
) => uploadMediaFile(file, 'video', onProgress);

export async function uploadMediaParallel(
  items: { file: File; onProgress: UploadProgressHandler }[],
  mediaKind: UploadMediaKind = 'video',
  concurrency = 3,
): Promise<{ file: File; meta?: UploadFileMeta; error?: string }[]> {
  const results: ({ file: File; meta?: UploadFileMeta; error?: string } | undefined)[] =
    new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      const current = items[i];
      try {
        const meta = await uploadMediaFile(current.file, mediaKind, current.onProgress);
        results[i] = { file: current.file, meta };
      } catch (err) {
        results[i] = {
          file: current.file,
          error: err instanceof Error ? err.message : 'Upload failed',
        };
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results.map(
    (r, i) => r ?? { file: items[i].file, error: 'Upload failed' },
  );
}

/** @deprecated */
export const uploadVideosParallel = uploadMediaParallel;
