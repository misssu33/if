import type { MotionTemplateDefinition } from '@/types/motion-template';

/** 런타임 템플릿 ID → 정의 (서버 로드 결과 캐시용) */
const registry = new Map<string, MotionTemplateDefinition>();

export function registerTemplate(def: MotionTemplateDefinition): void {
  registry.set(def.id, def);
}

export function getRegisteredTemplate(
  id: string,
): MotionTemplateDefinition | undefined {
  return registry.get(id);
}

export function listRegisteredTemplates(): MotionTemplateDefinition[] {
  return Array.from(registry.values());
}
