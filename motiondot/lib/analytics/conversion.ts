/**
 * 템플릿 전환 퍼널 — viewed → selected → exported | abandoned
 * PostHog 대시보드: completion_rate = template_exported / template_selected
 */

export const TEMPLATE_CONVERSION_EVENTS = [
  'template_viewed',
  'template_selected',
  'template_exported',
  'template_abandoned',
] as const;

export type TemplateConversionEvent =
  (typeof TEMPLATE_CONVERSION_EVENTS)[number];
