'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Sequence } from 'remotion';
import type { ZonePosition, ZoneTiming } from '@/types/motion-template';

type MotionContainerProps = {
  timing: ZoneTiming;
  position: ZonePosition;
  children: ReactNode;
  style?: CSSProperties;
};

/** 타임라인 구간 + 절대 위치 래퍼 */
export function MotionContainer({
  timing,
  position,
  children,
  style,
}: MotionContainerProps) {
  const posStyle: CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: position.width,
    height: position.height,
    transform:
      position.x === '50%' ? 'translateX(-50%)' : undefined,
    ...style,
  };

  return (
    <Sequence from={timing.startFrame} durationInFrames={timing.durationFrames}>
      <div style={posStyle}>{children}</div>
    </Sequence>
  );
}
