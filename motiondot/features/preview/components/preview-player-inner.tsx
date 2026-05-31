'use client';

import type { ComponentType } from 'react';
import { Player } from '@remotion/player';
import { AdMotionComposition } from '@/features/templates/remotion/ad-motion-composition';
import type { MotionCompositionProps } from '@/types/motion-template';

type PreviewPlayerInnerProps = {
  inputProps: MotionCompositionProps;
  loop?: boolean;
};

export function PreviewPlayerInner({
  inputProps,
  loop = true,
}: PreviewPlayerInnerProps) {
  const { width, height, fps, durationInFrames } = inputProps;

  return (
    <Player
      component={AdMotionComposition as unknown as ComponentType<Record<string, unknown>>}
      inputProps={inputProps}
      durationInFrames={durationInFrames}
      compositionWidth={width}
      compositionHeight={height}
      fps={fps}
      loop={loop}
      style={{
        width: '100%',
        aspectRatio: `${width} / ${height}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}
      controls
    />
  );
}
