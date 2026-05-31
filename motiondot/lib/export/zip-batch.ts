import 'server-only';

import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { getTempArchiveDir } from '@/lib/storage';

type ZipArchiveCtor = new (options?: { zlib?: { level?: number } }) => {
  pipe: (dest: NodeJS.WritableStream) => void;
  file: (filePath: string, opts: { name: string }) => void;
  finalize: () => Promise<void>;
  on: (event: string, cb: (err?: Error) => void) => void;
};

/** 배치 산출물 ZIP 생성 */
export async function createBatchZip(
  filePaths: string[],
  zipName: string,
): Promise<string> {
  const { ZipArchive } = (await import('archiver')) as unknown as {
    ZipArchive: ZipArchiveCtor;
  };

  await mkdir(getTempArchiveDir(), { recursive: true });
  const zipPath = path.join(getTempArchiveDir(), zipName);
  const output = createWriteStream(zipPath);
  const archive = new ZipArchive({ zlib: { level: 6 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(zipPath));
    archive.on('error', reject);
    archive.pipe(output);

    for (const filePath of filePaths) {
      archive.file(filePath, { name: path.basename(filePath) });
    }

    void archive.finalize().catch(reject);
  });
}
