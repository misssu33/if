import { loadPreset } from '@/features/presets/server/load-preset';

type RouteContext = { params: Promise<{ id: string }> };

/** 단일 SNS 프리셋 */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const preset = await loadPreset(id);
    return Response.json(preset);
  } catch {
    return Response.json({ error: 'Preset not found' }, { status: 404 });
  }
}
