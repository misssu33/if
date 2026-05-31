import type { SampleProject } from '../types';

/** 샘플 프로젝트 카드 데이터 (UI 전용) */
export const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: 'tiktok-product-gif',
    title: 'TikTok 제품 GIF',
    description: '9:16 숏폼 · 제품 훅 템플릿',
    presetId: 'tiktok-short-clip',
    templateId: 'tiktok-product-hook',
    formats: ['gif', 'mp4'],
    accent: 'from-violet-600 to-fuchsia-600',
  },
  {
    id: 'coupang-detail-gif',
    title: 'Coupang 상세 GIF',
    description: '1:1 할인 강조 · 쿠팡 스타일',
    presetId: 'coupang-product-detail-gif',
    templateId: 'coupang-discount-gif',
    formats: ['gif', 'webp'],
    accent: 'from-rose-600 to-orange-500',
  },
  {
    id: 'instagram-story-loop',
    title: 'Instagram 스토리 루프',
    description: '세로 스토리 · 반복 광고',
    presetId: 'instagram-reels',
    templateId: 'sns-story-loop',
    formats: ['mp4', 'webp'],
    accent: 'from-pink-600 to-purple-600',
  },
];
