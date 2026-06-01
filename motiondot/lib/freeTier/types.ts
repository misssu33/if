/** 무료 플랜 식별 (인증 없음 — localStorage만) */
export type PlanTier = 'free' | 'pro';

export type FreeTierLimits = {
  maxExportsPerSession: number;
  maxGifDurationSec: number;
  maxWidth: number;
  maxHeight: number;
};

export type FreeTierUsage = {
  exportCount: number;
  sessionId: string;
};

export type FreeTierPreferences = {
  watermarkOpacity: number;
};

export type WatermarkConfig = {
  enabled: boolean;
  opacity: number;
};
