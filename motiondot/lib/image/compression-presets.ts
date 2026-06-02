/** 브라우저 이미지 압축 프리셋 */
export type ImageCompressionPresetId =
  | 'off'
  | 'coupang-safe'
  | 'balanced'
  | 'high-quality';

export type ImageCompressionPreset = {
  id: Exclude<ImageCompressionPresetId, 'off'>;
  label: string;
  shortLabel: string;
  description: string;
  maxSizeMB: number;
  maxWidthOrHeight: number;
  initialQuality: number;
  /** UI용 목표 용량 안내 */
  targetLabel: string;
};

export const IMAGE_COMPRESSION_PRESETS: ImageCompressionPreset[] = [
  {
    id: 'coupang-safe',
    label: '쿠팡 안전 용량',
    shortLabel: '쿠팡 안전',
    description: '상세페이지·썸네일용 — 약 800KB 이하 목표',
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1000,
    initialQuality: 0.75,
    targetLabel: '~800KB 이하',
  },
  {
    id: 'balanced',
    label: '균형',
    shortLabel: '균형',
    description: '화질과 용량 균형 — 약 1.5MB 이하',
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1280,
    initialQuality: 0.82,
    targetLabel: '~1.5MB 이하',
  },
  {
    id: 'high-quality',
    label: '고화질',
    shortLabel: '고화질',
    description: '선명도 우선 — 약 3MB 이하',
    maxSizeMB: 3,
    maxWidthOrHeight: 1920,
    initialQuality: 0.9,
    targetLabel: '~3MB 이하',
  },
];

export function getCompressionPreset(
  id: ImageCompressionPresetId,
): ImageCompressionPreset | null {
  if (id === 'off') return null;
  return IMAGE_COMPRESSION_PRESETS.find((p) => p.id === id) ?? null;
}
