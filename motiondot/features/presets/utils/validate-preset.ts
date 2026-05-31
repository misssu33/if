import type { MotionDotPreset } from '@/types';

const REQUIRED_KEYS: (keyof MotionDotPreset)[] = [
  'id',
  'name',
  'platform',
  'outputFormat',
  'aspectRatio',
  'width',
  'height',
  'fps',
  'maxFileSizeBytes',
  'loop',
  'quality',
  'recommendedUseCase',
];

/** JSON 프리셋 최소 스키마 검증 */
export function validatePreset(data: unknown): data is MotionDotPreset {
  if (!data || typeof data !== 'object') return false;
  const p = data as Record<string, unknown>;
  return REQUIRED_KEYS.every((k) => p[k] !== undefined && p[k] !== null);
}
