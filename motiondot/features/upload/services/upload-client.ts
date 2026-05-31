'use client';

import type { UploadFileMeta } from '@/types';

type UploadProgressHandler = (progress: number) => void;

/** 단일 파일 업로드 (XHR — 진행률 지원) */
export function uploadVideoFile(
  file: File,
  onProgress?: UploadProgressHandler,
): Promise<UploadFileMeta> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append('file', file);

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

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.open('POST', '/api/upload');
    xhr.send(form);
  });
}

/** 병렬 업로드 (동시성 제한, 입력 순서 유지) */
export async function uploadVideosParallel(
  items: { file: File; onProgress: UploadProgressHandler }[],
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
        const meta = await uploadVideoFile(current.file, current.onProgress);
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
