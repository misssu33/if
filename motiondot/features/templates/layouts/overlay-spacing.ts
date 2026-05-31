/** 세로형·정사각·가로형 안전 여백 규칙 */

export type OverlayAspectPreset = '9:16' | '4:5' | '1:1' | '16:9' | 'default';

export type OverlaySpacing = {
  topPaddingPx: number;
  bottomPaddingPx: number;
  horizontalPaddingPx: number;
  stackGapPx: number;
  topRowGapPx: number;
  bottomSafeExtraPx: number;
  headlineMaxWidthPct: number;
  sublineMaxWidthPct: number;
  ctaMaxWidthPct: number;
};

const SPACING: Record<OverlayAspectPreset, OverlaySpacing> = {
  '9:16': {
    topPaddingPx: 52,
    bottomPaddingPx: 64,
    horizontalPaddingPx: 28,
    stackGapPx: 12,
    topRowGapPx: 10,
    bottomSafeExtraPx: 36,
    headlineMaxWidthPct: 100,
    sublineMaxWidthPct: 100,
    ctaMaxWidthPct: 88,
  },
  '4:5': {
    topPaddingPx: 40,
    bottomPaddingPx: 52,
    horizontalPaddingPx: 24,
    stackGapPx: 10,
    topRowGapPx: 8,
    bottomSafeExtraPx: 28,
    headlineMaxWidthPct: 100,
    sublineMaxWidthPct: 100,
    ctaMaxWidthPct: 90,
  },
  '1:1': {
    topPaddingPx: 32,
    bottomPaddingPx: 44,
    horizontalPaddingPx: 24,
    stackGapPx: 10,
    topRowGapPx: 8,
    bottomSafeExtraPx: 24,
    headlineMaxWidthPct: 92,
    sublineMaxWidthPct: 92,
    ctaMaxWidthPct: 85,
  },
  '16:9': {
    topPaddingPx: 24,
    bottomPaddingPx: 32,
    horizontalPaddingPx: 40,
    stackGapPx: 8,
    topRowGapPx: 8,
    bottomSafeExtraPx: 20,
    headlineMaxWidthPct: 70,
    sublineMaxWidthPct: 70,
    ctaMaxWidthPct: 42,
  },
  default: {
    topPaddingPx: 36,
    bottomPaddingPx: 48,
    horizontalPaddingPx: 24,
    stackGapPx: 10,
    topRowGapPx: 8,
    bottomSafeExtraPx: 28,
    headlineMaxWidthPct: 94,
    sublineMaxWidthPct: 94,
    ctaMaxWidthPct: 88,
  },
};

/** aspectRatio 문자열·해상도 → 프리셋 */
export function resolveAspectPreset(
  aspectRatio: string,
  width: number,
  height: number,
): OverlayAspectPreset {
  const normalized = aspectRatio.trim();
  if (normalized === '9:16' || height / width > 1.45) return '9:16';
  if (normalized === '4:5') return '4:5';
  if (normalized === '1:1' || Math.abs(width - height) / width < 0.12) return '1:1';
  if (normalized === '16:9' || width / height > 1.55) return '16:9';
  return 'default';
}

export function getOverlaySpacing(
  aspectRatio: string,
  width: number,
  height: number,
): OverlaySpacing {
  const preset = resolveAspectPreset(aspectRatio, width, height);
  return SPACING[preset];
}
