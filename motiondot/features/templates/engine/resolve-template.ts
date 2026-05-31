import type {
  MotionCompositionProps,
  MotionTemplateDefinition,
} from '@/types/motion-template';
import { buildTimeline } from './timeline-builder';

export type TemplateContentOverrides = {
  headline?: string;
  subline?: string;
  ctaText?: string;
  badgeText?: string;
  backgroundSrc?: string;
  productSrc?: string;
  logoSrc?: string;
};

/** JSON 정의 + 사용자 콘텐츠 병합 */
export function resolveTemplateContent(
  template: MotionTemplateDefinition,
  overrides: TemplateContentOverrides = {},
): Pick<
  MotionCompositionProps,
  | 'headline'
  | 'subline'
  | 'ctaText'
  | 'badgeText'
  | 'backgroundSrc'
  | 'productSrc'
  | 'logoSrc'
> {
  const { layout } = template;
  return {
    headline: overrides.headline ?? layout.headline.defaultText,
    subline: overrides.subline ?? layout.subline?.defaultText ?? '',
    ctaText: overrides.ctaText ?? layout.cta?.defaultText ?? '',
    badgeText: overrides.badgeText ?? layout.badge?.defaultText ?? '',
    backgroundSrc: overrides.backgroundSrc,
    productSrc: overrides.productSrc,
    logoSrc: overrides.logoSrc,
  };
}

/** 타임라인이 비어 있으면 layout에서 생성 */
export function resolveTemplateDefinition(
  template: MotionTemplateDefinition,
): MotionTemplateDefinition {
  const timeline = buildTimeline(template);
  return { ...template, timeline };
}
