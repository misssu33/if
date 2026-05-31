import { listSnsExportPresets } from '@/features/presets/server/load-preset';

/** SNS GIF export 프리셋 목록 (config/sns-export-presets.json) */
export async function GET() {
  const presets = await listSnsExportPresets();
  return Response.json(presets);
}
