'use client';

import type { UploadFileMeta } from '../types';

/** 클라이언트: FormData → POST /api/upload */
export async function uploadFilesClient(
  files: File[],
): Promise<UploadFileMeta[]> {
  const results: UploadFileMeta[] = [];

  for (const file of files) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) {
      throw new Error(`Upload failed: ${file.name}`);
    }
    results.push((await res.json()) as UploadFileMeta);
  }

  return results;
}
