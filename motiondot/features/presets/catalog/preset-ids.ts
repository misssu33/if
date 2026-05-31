/** 기본 프리셋 ID 목록 (UI · catalog 동기화) */
export const PRESET_IDS = [
  'tiktok-short-clip',
  'instagram-reels',
  'threads-loop',
  'facebook-feed',
  'kakaotalk-share',
  'coupang-product-detail-gif',
  'naver-blog',
  'custom',
] as const;

export type PresetId = (typeof PRESET_IDS)[number];
