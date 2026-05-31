import type { ConvertQuality } from './types';

const DEFAULT_QUALITY: ConvertQuality = 'medium';

/** 기본 품질 */
export function resolveQuality(quality?: ConvertQuality): ConvertQuality {
  return quality ?? DEFAULT_QUALITY;
}

/** H.264 CRF (낮을수록 고품질) */
export function getMp4Crf(quality: ConvertQuality): number {
  const map = { low: 28, medium: 23, high: 18 } as const;
  return map[quality];
}

/** x264 인코딩 속도 */
export function getMp4Preset(quality: ConvertQuality): string {
  const map = { low: 'veryfast', medium: 'medium', high: 'slow' } as const;
  return map[quality];
}

/** WebP -q:v (0–100) */
export function getWebpQuality(quality: ConvertQuality): number {
  const map = { low: 60, medium: 80, high: 95 } as const;
  return map[quality];
}

/** GIF 팔레트 최대 색 수 */
export function getGifMaxColors(quality: ConvertQuality): number {
  const map = { low: 64, medium: 128, high: 256 } as const;
  return map[quality];
}
