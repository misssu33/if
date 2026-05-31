import { readFile } from 'fs/promises';
import path from 'path';

/** 미리보기용 업로드 미디어 스트리밍 (temp 경로) */
export async function GET(request: Request) {
  const filePath = new URL(request.url).searchParams.get('path');
  if (!filePath) {
    return new Response('path required', { status: 400 });
  }

  const resolved = path.resolve(filePath);
  if (!resolved.includes('/temp/') && !resolved.includes('\\temp\\')) {
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
            : 'application/octet-stream';

    return new Response(buffer, {
      headers: { 'Content-Type': type, 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response('not found', { status: 404 });
  }
}
