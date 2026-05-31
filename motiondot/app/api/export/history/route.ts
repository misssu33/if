import {
  getExportHistoryByBatch,
  listExportHistory,
} from '@/lib/export';

/** export 히스토리 조회 */
export async function GET(request: Request) {
  const batchId = new URL(request.url).searchParams.get('batchId');
  const limit = Number(new URL(request.url).searchParams.get('limit') ?? 50);

  const records = batchId
    ? await getExportHistoryByBatch(batchId)
    : await listExportHistory(limit);

  return Response.json(records);
}
