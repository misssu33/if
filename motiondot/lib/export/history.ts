import 'server-only';

import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { getExportHistoryPath, getExportMetaDir } from '@/lib/storage';
import type { ExportHistoryRecord } from '@/types/export';

async function readHistory(): Promise<ExportHistoryRecord[]> {
  try {
    const raw = await readFile(getExportHistoryPath(), 'utf-8');
    return JSON.parse(raw) as ExportHistoryRecord[];
  } catch {
    return [];
  }
}

async function writeHistory(records: ExportHistoryRecord[]): Promise<void> {
  await mkdir(getExportMetaDir(), { recursive: true });
  await writeFile(getExportHistoryPath(), JSON.stringify(records, null, 2));
}

/** export 완료/실패 기록 */
export async function appendExportHistory(
  entry: Omit<ExportHistoryRecord, 'id' | 'createdAt'> & {
    id?: string;
    createdAt?: string;
  },
): Promise<ExportHistoryRecord> {
  const records = await readHistory();
  const record: ExportHistoryRecord = {
    id: entry.id ?? randomUUID(),
    createdAt: entry.createdAt ?? new Date().toISOString(),
    ...entry,
  };
  records.unshift(record);
  await writeHistory(records.slice(0, 500));
  return record;
}

export async function listExportHistory(
  limit = 50,
): Promise<ExportHistoryRecord[]> {
  const records = await readHistory();
  return records.slice(0, limit);
}

export async function getExportHistoryByBatch(
  batchId: string,
): Promise<ExportHistoryRecord[]> {
  return (await readHistory()).filter((r) => r.batchId === batchId);
}

export async function updateExportHistory(
  id: string,
  patch: Partial<ExportHistoryRecord>,
): Promise<void> {
  const records = await readHistory();
  const next = records.map((r) => (r.id === id ? { ...r, ...patch } : r));
  await writeHistory(next);
}
