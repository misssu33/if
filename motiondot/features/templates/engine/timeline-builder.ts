import type { MotionTemplateDefinition, TimelineTrack } from '@/types/motion-template';

/** JSON 타임라인 정규화 (확장용) */
export function buildTimeline(
  template: MotionTemplateDefinition,
): TimelineTrack[] {
  if (template.timeline.length > 0) return template.timeline;

  const tracks: TimelineTrack[] = [];
  const { layout } = template;
  const push = (
    id: string,
    layer: TimelineTrack['layer'],
    timing: { startFrame: number; durationFrames: number },
    animation: TimelineTrack['animation'],
  ) => {
    tracks.push({
      id,
      layer,
      startFrame: timing.startFrame,
      durationFrames: timing.durationFrames,
      animation,
    });
  };

  push('background', 'background', layout.background.timing, layout.background.animation);
  if (layout.headline) {
    push('headline', 'headline', layout.headline.timing, layout.headline.animation);
  }
  if (layout.cta) {
    push('cta', 'cta', layout.cta.timing, layout.cta.animation);
  }

  return tracks;
}

/** 트랙별 로컬 프레임 오프셋 */
export function getTrackLocalFrame(
  globalFrame: number,
  track: TimelineTrack,
): number {
  return globalFrame - track.startFrame;
}
