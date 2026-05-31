'use client';

import { AbsoluteFill, Img, Video } from 'remotion';
import type { MediaZoneConfig } from '@/types/motion-template';
import { useAnimationPreset } from '../animation';
import { MotionContainer } from './motion-container';

type AnimatedMediaProps = {
  config: MediaZoneConfig;
  src?: string;
  loopComposition?: boolean;
  fill?: boolean;
};

/** 배경·제품·로고 미디어 레이어 */
export function AnimatedMedia({
  config,
  src,
  loopComposition,
  fill = false,
}: AnimatedMediaProps) {
  const style = useAnimationPreset(config.timing, config.animation, loopComposition);

  if (config.kind === 'none' || !src) return null;

  const mediaStyle = {
    width: '100%',
    height: '100%',
    objectFit: config.objectFit ?? 'cover',
    opacity: style.opacity,
    transform: style.transform,
    filter: style.filter,
  } as const;

  const content =
    config.kind === 'video' ? (
      <Video src={src} style={mediaStyle} muted />
    ) : (
      <Img src={src} style={mediaStyle} />
    );

  if (fill) {
    return (
      <AbsoluteFill style={{ opacity: style.opacity }}>
        {content}
      </AbsoluteFill>
    );
  }

  return (
    <MotionContainer timing={config.timing} position={config.position}>
      {content}
    </MotionContainer>
  );
}
