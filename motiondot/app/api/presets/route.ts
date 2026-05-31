import { listPresets } from '@/features/presets/server/load-preset';

/** SNS 프리셋 목록 */
export async function GET() {
  const presets = await listPresets();
  return Response.json(presets);
}
