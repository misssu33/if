import type { FreeTierLimits } from './types';

/** 무료 플랜 기본 제한 (가벼운 클라이언트 게이트) */
export const FREE_TIER_LIMITS: FreeTierLimits = {
  maxExportsPerSession: 5,
  maxGifDurationSec: 5,
  maxWidth: 720,
  maxHeight: 1280,
};

export const FREE_TIER_STORAGE_KEYS = {
  plan: 'motiondot:plan',
  usage: 'motiondot:free-tier:usage',
  prefs: 'motiondot:free-tier:prefs',
} as const;

export const DEFAULT_WATERMARK_OPACITY = 0.55;
