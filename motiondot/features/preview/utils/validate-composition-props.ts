import type { MotionCompositionProps } from '@/types/motion-template';

/** Remotion Player에 넘기기 전 최소 검증 */
export function isValidCompositionProps(
  props: MotionCompositionProps | null | undefined,
): props is MotionCompositionProps {
  if (!props) return false;
  return (
    props.width > 0 &&
    props.height > 0 &&
    props.fps > 0 &&
    props.durationInFrames > 0 &&
    Number.isFinite(props.durationInFrames) &&
    Number.isFinite(props.width) &&
    Number.isFinite(props.height)
  );
}
