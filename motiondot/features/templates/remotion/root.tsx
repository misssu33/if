import React, { type ComponentType } from 'react';
import { Composition } from 'remotion';
import { AdMotionComposition } from './ad-motion-composition';
import type { MotionCompositionProps } from '@/types/motion-template';

export const REMOTION_AD_COMPOSITION_ID = 'MotionDotAd';

const defaultProps: MotionCompositionProps = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 150,
  loop: true,
  template: {} as MotionCompositionProps['template'],
  headline: 'MotionDot',
  subline: '',
  ctaText: '',
  badgeText: '',
};

/** Remotion Studio / CLI 진입점 */
export const RemotionRoot: React.FC = () => (
  <Composition
    id={REMOTION_AD_COMPOSITION_ID}
    component={AdMotionComposition as unknown as ComponentType<Record<string, unknown>>}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
  />
);
