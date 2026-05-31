import { readFile, stat } from 'fs/promises';
import path from 'path';
import {
  getOutputGifDir,
  getOutputMp4Dir,
  getOutputWebpDir,
} from '@/lib/storage';
import type { OutputFormat } from '@/types';

function getOutputDirForFormat(format: OutputFormat): string {
  if (format === 'gif') return getOutputGifDir();
  if (format === 'webp') return getOutputWebpDir();
  return getOutputMp4Dir();
}

/** 개별 산출물 다운로드 (outputs/ 전용) */
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const file = sp.get('file');
  const format = sp.get('format') as OutputFormat | null;

  if (!file || !format) {
    return Response.json({ error: 'file and format required' }, { status: 400 });
  }

  const base = path.basename(file);
  const dir = getOutputDirForFormat(format);
  const resolved = path.resolve(dir, base);

  if (!resolved.startsWith(path.resolve(dir))) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    const buffer = await readFile(resolved);
    const st = await stat(resolved);
    const ext = path.extname(base).toLowerCase();
    const type =
      ext === '.gif'
        ? 'image/gif'
        : ext === '.webp'
          ? 'image/webp'
          : 'video/mp4';

    return new Response(buffer, {
      headers: {
        'Content-Type': type,
        'Content-Length': String(st.size),
        'Content-Disposition': `attachment; filename="${base}"`,
      },
    });
  } catch {
    return Response.json({ error: 'not found' }, { status: 404 });
  }
}
