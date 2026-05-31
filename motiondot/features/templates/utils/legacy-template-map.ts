import type { MotionTemplateDefinition } from '@/types/motion-template';

/** preview 구 템플릿 ID 호환 */
export const LEGACY_TEMPLATE_MAP: Record<string, string> = {
  'mixed-media': 'tiktok-product-hook',
  'text-overlay': 'flash-sale-banner',
  'product-hero': 'product-review-highlight',
};

export function resolveTemplateId(
  id: string,
  templates: MotionTemplateDefinition[],
): MotionTemplateDefinition | undefined {
  const resolvedId = LEGACY_TEMPLATE_MAP[id] ?? id;
  return templates.find((t) => t.id === resolvedId);
}
