import { readFile } from 'fs/promises';
import path from 'path';
import {
  getOutputDir,
  getOutputGifDir,
  getOutputMp4Dir,
  getOutputWebpDir,
  getTempDir,
} from '@/lib/storage';

function isUnderRoot(resolved: string, root: string): boolean {
  const base = path.resolve(root);
  return resolved === base || resolved.startsWith(`${base}${path.sep}`);
}

/** temp/ · outputs/ 하위 미디어만 스트리밍 허용 */
function resolveAllowedMediaPath(filePath: string): string | null {
  const resolved = path.resolve(filePath);
  const allowedRoots = [
    getTempDir(),
    getOutputDir(),
    getOutputGifDir(),
    getOutputWebpDir(),
    getOutputMp4Dir(),
  ];

  for (const root of allowedRoots) {
    if (isUnderRoot(resolved, root)) {
      return resolved;
    }
  }
  return null;
}

/** 미리보기용 미디어 스트리밍 (업로드 temp · 변환 outputs) */
export async function GET(request: Request) {
  const filePath = new URL(request.url).searchParams.get('path');
  if (!filePath) {
    return new Response('path required', { status: 400 });
  }

  const resolved = resolveAllowedMediaPath(filePath);
  if (!resolved) {
    return new Response('forbidden', { status: 403 });
  }

  try {
    const buffer = await readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    const type =
      ext === '.mp4'
        ? 'video/mp4'
        : ext === '.webm'
          ? 'video/webm'
          : ext === '.gif'
            ? 'image/gif'
            : ext === '.webp'
              ? 'image/webp'
              : 'application/octet-stream';

    return new Response(buffer, {
      headers: { 'Content-Type': type, 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response('not found', { status: 404 });
  }
}
