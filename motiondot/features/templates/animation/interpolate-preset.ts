import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnimationPresetId } from '@/types/motion-template';
import type { ZoneTiming } from '@/types/motion-template';

export type AnimationStyle = {
  opacity: number;
  transform: string;
  filter?: string;
};

type ComputeInput = {
  frame: number;
  fps: number;
  timing: ZoneTiming;
  preset: AnimationPresetId;
  loopComposition?: boolean;
};

/** 프레임 기준 애니메이션 스타일 계산 (Remotion 전용) */
export function computeAnimationStyle({
  frame,
  fps,
  timing,
  preset,
  loopComposition = false,
}: ComputeInput): AnimationStyle {
  const local = frame - timing.startFrame;
  const active = local >= 0 && local <= timing.durationFrames;
  const progress = active
    ? Math.min(1, local / Math.max(1, timing.durationFrames * 0.35))
    : 0;

  const baseOpacity = active ? interpolate(local, [0, 8], [0, 1], { extrapolateRight: 'clamp' }) : 0;

  switch (preset) {
    case 'fade':
      return { opacity: baseOpacity, transform: 'none' };
    case 'slide-up': {
      const y = interpolate(local, [0, 18], [48, 0], { extrapolateRight: 'clamp' });
      return { opacity: baseOpacity, transform: `translateY(${active ? y : 48}px)` };
    }
    case 'zoom': {
      const scale = spring({ frame: local, fps, config: { damping: 14 } });
      return {
        opacity: baseOpacity,
        transform: `scale(${active ? 0.85 + scale * 0.15 : 0.85})`,
      };
    }
    case 'pop': {
      const scale = spring({ frame: local, fps, config: { damping: 10, stiffness: 180 } });
      return {
        opacity: baseOpacity,
        transform: `scale(${active ? scale : 0.6})`,
      };
    }
    case 'glow': {
      const glow = interpolate(local, [0, 20], [0, 12], { extrapolateRight: 'clamp' });
      return {
        opacity: baseOpacity,
        transform: 'none',
        filter: active ? `drop-shadow(0 0 ${glow}px rgba(124,58,237,0.9))` : undefined,
      };
    }
    case 'shake': {
      const shakeX = active ? Math.sin(local * 0.8) * 6 * (1 - progress) : 0;
      return { opacity: baseOpacity, transform: `translateX(${shakeX}px)` };
    }
    case 'loop-pulse': {
      const pulse = loopComposition
        ? 0.95 + Math.sin((frame / fps) * Math.PI * 2) * 0.05
        : 0.95 + Math.sin(local * 0.15) * 0.05;
      return { opacity: Math.max(baseOpacity, 0.85), transform: `scale(${pulse})` };
    }
    default:
      return { opacity: baseOpacity, transform: 'none' };
  }
}

/** 훅: 현재 프레임 + 타이밍 → 스타일 */
export function useAnimationPreset(
  timing: ZoneTiming,
  preset: AnimationPresetId,
  loopComposition = false,
): AnimationStyle {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return computeAnimationStyle({ frame, fps, timing, preset, loopComposition });
}
