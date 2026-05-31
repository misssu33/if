import type { AnimationPresetId, MotionTemplateDefinition } from '@/types/motion-template';
import { ANIMATION_PRESETS } from '../animation/presets';

const PRESET_SET = new Set<string>(ANIMATION_PRESETS);

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** JSON 스키마 최소 검증 */
export function validateMotionTemplate(data: unknown): data is MotionTemplateDefinition {
  if (!isObject(data)) return false;
  if (typeof data.id !== 'string' || typeof data.name !== 'string') return false;
  if (!isObject(data.layout) || !isObject(data.theme) || !isObject(data.typography)) {
    return false;
  }
  if (!Array.isArray(data.timeline)) return false;

  const layout = data.layout as Record<string, unknown>;
  if (!isObject(layout.background) || !isObject(layout.headline)) return false;

  const checkAnim = (zone: unknown) => {
    if (!isObject(zone)) return false;
    const anim = zone.animation;
    return typeof anim === 'string' && PRESET_SET.has(anim);
  };

  if (!checkAnim(layout.background) || !checkAnim(layout.headline)) return false;

  for (const track of data.timeline) {
    if (!isObject(track)) return false;
    const anim = track.animation as AnimationPresetId;
    if (!PRESET_SET.has(anim)) return false;
  }

  return (
    typeof data.durationSec === 'number' &&
    typeof data.fps === 'number' &&
    typeof data.width === 'number' &&
    typeof data.height === 'number'
  );
}
