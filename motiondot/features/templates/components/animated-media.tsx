'use client';

import { AbsoluteFill, Img, Video } from 'remotion';
import type { MediaZoneConfig } from '@/types/motion-template';
import { resolvePlaybackKind } from '@/features/preview/utils/resolve-media-kind';
import { useAnimationPreset } from '../animation';
import { AnimatedSequenceSlot } from './animated-sequence-slot';
import { MotionContainer } from './motion-container';

type AnimatedMediaProps = {
  config: MediaZoneConfig;
  src?: string;
  loopComposition?: boolean;
  fill?: boolean;
  /** true: 상단 워터마크 영역용 고정 박스 */
  stackLayout?: boolean;
};

/** 배경·제품·로고 미디어 레이어 */
export function AnimatedMedia({
  config,
  src,
  loopComposition,
  fill = false,
  stackLayout = false,
}: AnimatedMediaProps) {
  const style = useAnimationPreset(config.timing, config.animation, loopComposition);

  const playback = resolvePlaybackKind(config, src ?? '');
  if (playback === 'none' || !src) return null;

  const mediaStyle = {
    width: '100%',
    height: '100%',
    objectFit: config.objectFit ?? 'cover',
    opacity: style.opacity,
    transform: style.transform,
    filter: style.filter,
  } as const;

  const content =
    playback === 'video' ? (
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

  if (stackLayout) {
    return (
      <AnimatedSequenceSlot timing={config.timing}>
        <div
          style={{
            width: 72,
            height: 40,
            maxWidth: '100%',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {content}
        </div>
      </AnimatedSequenceSlot>
    );
  }

  return (
    <MotionContainer timing={config.timing} position={config.position}>
      {content}
    </MotionContainer>
  );
}
