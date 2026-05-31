import path from 'path';
import { createBatchZip } from '@/lib/export';
import { getExportHistoryByBatch } from '@/lib/export';
import { readFile } from 'fs/promises';
import {
  getOutputGifDir,
  getOutputMp4Dir,
  getOutputWebpDir,
} from '@/lib/storage';
import type { OutputFormat } from '@/types';

function resolveOutputFile(
  outputPath: string,
  format: OutputFormat,
): string {
  const base = path.basename(outputPath);
  const dir =
    format === 'gif'
      ? getOutputGifDir()
      : format === 'webp'
        ? getOutputWebpDir()
        : getOutputMp4Dir();
  return path.join(dir, base);
}

/** 배치 ZIP 다운로드 */
export async function GET(request: Request) {
  const batchId = new URL(request.url).searchParams.get('batchId');
  if (!batchId) {
    return Response.json({ error: 'batchId required' }, { status: 400 });
  }

  const records = await getExportHistoryByBatch(batchId);
  const completed = records.filter(
    (r) => r.status === 'completed' && r.outputPath,
  );

  if (completed.length === 0) {
    return Response.json({ error: 'no completed exports' }, { status: 404 });
  }

  const paths = completed.map((r) =>
    resolveOutputFile(r.outputPath!, r.format),
  );

  const zipPath = await createBatchZip(
    paths,
    `motiondot-${batchId.slice(0, 8)}.zip`,
  );
  const buffer = await readFile(zipPath);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${path.basename(zipPath)}"`,
    },
  });
}
