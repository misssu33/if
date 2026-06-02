import type { MotionTemplateDefinition } from '@/types/motion-template';

const PLATFORM_LABEL: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  coupang: 'Coupang',
  reels: 'Reels',
  affiliate: 'Affiliate',
  multi: 'Multi',
};

/** 템플릿 셀렉터 표시 라벨 */
export function formatTemplateOptionLabel(template: MotionTemplateDefinition): string {
  const platform = template.targetPlatform
    ? PLATFORM_LABEL[template.targetPlatform] ?? template.targetPlatform
    : null;
  const parts: string[] = [];
  if (template.affiliateCategory) parts.push(template.affiliateCategory);
  parts.push(template.name, template.aspectRatio);
  if (platform) parts.push(platform);
  return parts.join(' · ');
}
