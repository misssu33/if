import type { MotionTemplateDefinition, TikTokAffiliateCategory } from '@/types/motion-template';

/** TikTok 제휴 카테고리 표시 순서 */
export const TIKTOK_AFFILIATE_CATEGORY_ORDER: TikTokAffiliateCategory[] = [
  '꿀템 추천',
  '후기 폭발',
  '돈 버는 법',
  '모르면 손해',
  '오늘의 발견',
  '문제 해결템',
  '구매 전 확인',
];

function categoryRank(template: MotionTemplateDefinition): number {
  if (!template.affiliateCategory) return 99;
  const idx = TIKTOK_AFFILIATE_CATEGORY_ORDER.indexOf(template.affiliateCategory);
  return idx >= 0 ? idx : 50;
}

function templateSortKey(template: MotionTemplateDefinition): number {
  if (template.aspectRatio !== '9:16') return 200;
  if (template.marketTier === 'secondary' || template.targetPlatform === 'coupang') {
    return 150 + categoryRank(template);
  }
  if (template.targetPlatform === 'tiktok' || template.targetPlatform === 'affiliate') {
    return categoryRank(template);
  }
  return 100 + categoryRank(template);
}

/** TikTok 제휴 9:16 우선 정렬 */
export function sortTemplatesForDisplay(
  templates: MotionTemplateDefinition[],
): MotionTemplateDefinition[] {
  return [...templates].sort((a, b) => {
    const diff = templateSortKey(a) - templateSortKey(b);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name, 'ko');
  });
}

export function groupTemplatesForSelect(templates: MotionTemplateDefinition[]) {
  const sorted = sortTemplatesForDisplay(templates);
  const primary916 = sorted.filter(
    (t) =>
      t.aspectRatio === '9:16' &&
      t.marketTier !== 'secondary' &&
      t.targetPlatform !== 'coupang',
  );
  const secondary916 = sorted.filter(
    (t) =>
      t.aspectRatio === '9:16' &&
      (t.marketTier === 'secondary' || t.targetPlatform === 'coupang'),
  );
  const other = sorted.filter((t) => t.aspectRatio !== '9:16');
  return { primary916, secondary916, other };
}
