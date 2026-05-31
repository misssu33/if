import { loadMotionTemplate } from '@/features/templates/server/load-template';

type RouteContext = { params: Promise<{ id: string }> };

/** 단일 템플릿 JSON */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const template = await loadMotionTemplate(id);
    return Response.json(template);
  } catch {
    return Response.json({ error: 'not found' }, { status: 404 });
  }
}
