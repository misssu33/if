import { listMotionTemplates } from '@/features/templates/server/load-template';

/** 광고 모션 템플릿 카탈로그 */
export async function GET() {
  try {
    const templates = await listMotionTemplates();
    return Response.json(templates);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load templates';
    return Response.json({ error: message }, { status: 500 });
  }
}
