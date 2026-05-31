'use client';

import { AbsoluteFill } from 'remotion';
import type { MotionCompositionProps } from '@/types/motion-template';
import { AdTemplateLayout } from '../layouts';

/** MotionDot 광고 모션 메인 컴포지션 */
export function AdMotionComposition(props: MotionCompositionProps) {
  return (
    <AbsoluteFill>
      <AdTemplateLayout {...props} />
    </AbsoluteFill>
  );
}
