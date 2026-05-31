'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Sequence } from 'remotion';
import type { ZoneTiming } from '@/types/motion-template';

type AnimatedSequenceSlotProps = {
  timing: ZoneTiming;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

/** 스택 레이아웃용 — 타임라인만 유지, absolute 위치 없음 */
export function AnimatedSequenceSlot({
  timing,
  children,
  style,
}: AnimatedSequenceSlotProps) {
  return (
    <Sequence from={timing.startFrame} durationInFrames={timing.durationFrames}>
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          flexShrink: 0,
          ...style,
        }}
      >
        {children}
      </div>
    </Sequence>
  );
}
