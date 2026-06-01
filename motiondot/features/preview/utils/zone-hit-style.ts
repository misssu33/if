import type { CSSProperties } from 'react';
import type { ZonePosition } from '@/types/motion-template';
import type { TextOverlayLayerId } from '../types/text-overlay-layer';

/** JSON safe-zone → HTML 오버레이 히트 박스 (시각 레이아웃과 동일 비율) */
export function zonePositionToHitStyle(
  position: ZonePosition,
  layerId: TextOverlayLayerId,
): CSSProperties {
  const centered = position.x === '50%';

  const defaultWidth =
    position.width ??
    (layerId === 'cta'
      ? centered
        ? '42%'
        : '36%'
      : layerId === 'badge'
        ? '28%'
        : layerId === 'headline' || layerId === 'subline'
          ? '84%'
          : '40%');

  return {
    left: position.x,
    top: position.y,
    width: defaultWidth,
    height: position.height,
    transform: centered ? 'translateX(-50%)' : undefined,
  };
}
