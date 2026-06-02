import type { SampleProject } from '../types';

/** 샘플 프로젝트 — TikTok 제휴 우선, 쿠팡 보조 */
export const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: 'tiktok-product-gif',
    title: 'TikTok 꿀템 훅',
    description: '9:16 · 제품 훅 · 기본 제휴',
    presetId: 'tiktok-short-clip',
    templateId: 'tiktok-product-hook',
    formats: ['gif', 'mp4'],
    accent: 'from-violet-600 to-fuchsia-600',
  },
  {
    id: 'tiktok-review-gif',
    title: '후기 폭발 숏폼',
    description: '9:16 · 후기·평점 강조',
    presetId: 'tiktok-short-clip',
    templateId: 'review-proof',
    formats: ['gif', 'webp'],
    accent: 'from-emerald-600 to-teal-500',
  },
  {
    id: 'tiktok-recommend-gif',
    title: '꿀템 추천',
    description: '9:16 · 제휴 추천형',
    presetId: 'tiktok-short-clip',
    templateId: 'product-recommendation',
    formats: ['gif', 'mp4'],
    accent: 'from-indigo-600 to-violet-600',
  },
  {
    id: 'instagram-story-loop',
    title: 'Instagram Reels',
    description: '9:16 · 스토리 루프',
    presetId: 'instagram-reels',
    templateId: 'sns-story-loop',
    formats: ['mp4', 'webp'],
    accent: 'from-pink-600 to-purple-600',
  },
  {
    id: 'coupang-detail-gif',
    title: 'Coupang 상세 (보조)',
    description: '1:1 · 상세페이지 GIF',
    presetId: 'coupang-product-detail-gif',
    templateId: 'coupang-discount-gif',
    formats: ['gif', 'webp'],
    accent: 'from-rose-600 to-orange-500',
  },
];
