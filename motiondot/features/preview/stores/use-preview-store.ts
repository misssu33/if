import { create } from 'zustand';

/** 광고 모션 템플릿 ID (templates/*.json) */
export type MotionAdTemplateId =
  | 'tiktok-product-hook'
  | 'coupang-discount-gif'
  | 'before-after'
  | 'product-review-highlight'
  | 'flash-sale-banner'
  | 'lifestyle-promo'
  | 'sns-story-loop'
  | 'mixed-media'
  | 'text-overlay'
  | 'product-hero';

import type { OutputFormat } from '@/types';

interface PreviewState {
  selectedFileId: string | null;
  previewFormat: OutputFormat;
  templateId: MotionAdTemplateId;
  loopPlayback: boolean;
  headline: string;
  subline: string;
  ctaText: string;
  badgeText: string;
  durationSec: number;
  setSelectedFileId: (id: string | null) => void;
  setPreviewFormat: (format: OutputFormat) => void;
  setTemplateId: (id: MotionAdTemplateId) => void;
  setLoopPlayback: (loop: boolean) => void;
  setHeadline: (text: string) => void;
  setSubline: (text: string) => void;
  setCtaText: (text: string) => void;
  setBadgeText: (text: string) => void;
  setDurationSec: (sec: number) => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  selectedFileId: null,
  previewFormat: 'mp4',
  templateId: 'tiktok-product-hook',
  loopPlayback: true,
  headline: 'MotionDot',
  subline: 'SNS 광고 미리보기',
  ctaText: '지금 구매',
  badgeText: 'NEW',
  durationSec: 5,
  setSelectedFileId: (id) => set({ selectedFileId: id }),
  setPreviewFormat: (format) => set({ previewFormat: format }),
  setTemplateId: (id) => set({ templateId: id }),
  setLoopPlayback: (loop) => set({ loopPlayback: loop }),
  setHeadline: (headline) => set({ headline }),
  setSubline: (subline) => set({ subline }),
  setCtaText: (ctaText) => set({ ctaText }),
  setBadgeText: (badgeText) => set({ badgeText }),
  setDurationSec: (durationSec) => set({ durationSec }),
}));
