import type { MediaZoneConfig } from '@/types/motion-template';

/** URL·MIME 기준 이미지 여부 (비디오 템플릿 + 이미지 업로드 시 Remotion Video 크래시 방지) */
export function isImageMediaSrc(src: string): boolean {
  if (!src) return false;
  if (/\.(jpe?g|png|webp|gif|bmp)(\?|$)/i.test(src)) return true;
  if (src.includes('image/')) return true;
  return false;
}

/** zone 설정과 실제 소스에 맞는 렌더 종류 */
export function resolvePlaybackKind(
  config: MediaZoneConfig,
  src: string,
): 'image' | 'video' | 'none' {
  if (config.kind === 'none' || !src) return 'none';
  if (config.kind === 'image' || isImageMediaSrc(src)) return 'image';
  return 'video';
}
