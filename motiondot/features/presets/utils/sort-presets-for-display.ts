'use client';

import type { MotionDotPreset } from '@/types';

const PRIMARY_ORDER = ['tiktok', 'instagram', 'threads'] as const;
const SECONDARY_ORDER = ['coupang', 'kakaotalk', 'facebook', 'naver', 'custom'] as const;

function tierRank(platform: MotionDotPreset['platform']): number {
  const primary = PRIMARY_ORDER.indexOf(platform as (typeof PRIMARY_ORDER)[number]);
  if (primary >= 0) return primary;
  const secondary = SECONDARY_ORDER.indexOf(
    platform as (typeof SECONDARY_ORDER)[number],
  );
  return secondary >= 0 ? 10 + secondary : 99;
}

/** TikTok 제휴 프리셋 우선 정렬 */
export function sortPresetsForDisplay(presets: MotionDotPreset[]): MotionDotPreset[] {
  return [...presets].sort((a, b) => {
    const diff = tierRank(a.platform) - tierRank(b.platform);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name, 'ko');
  });
}

export function groupPresetsForDisplay(presets: MotionDotPreset[]) {
  const sorted = sortPresetsForDisplay(presets);
  const primary = sorted.filter((p) =>
    PRIMARY_ORDER.includes(p.platform as (typeof PRIMARY_ORDER)[number]),
  );
  const secondary = sorted.filter((p) =>
    SECONDARY_ORDER.includes(p.platform as (typeof SECONDARY_ORDER)[number]),
  );
  const rest = sorted.filter(
    (p) =>
      !PRIMARY_ORDER.includes(p.platform as (typeof PRIMARY_ORDER)[number]) &&
      !SECONDARY_ORDER.includes(p.platform as (typeof SECONDARY_ORDER)[number]),
  );
  return { primary, secondary: [...secondary, ...rest] };
}
