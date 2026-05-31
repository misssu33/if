export { AdMotionComposition } from './remotion/ad-motion-composition';
export { REMOTION_AD_COMPOSITION_ID } from './remotion/root';
export { AdTemplateLayout } from './layouts';
export {
  AnimatedText,
  AnimatedCTA,
  AnimatedMedia,
  AnimatedBadge,
  MotionContainer,
} from './components';
export { ANIMATION_PRESETS, useAnimationPreset } from './animation';
export {
  buildCompositionProps,
  resolveTemplateContent,
  buildTimeline,
} from './engine';
export type { BuildCompositionInput, TemplateContentOverrides } from './engine';
export { loadMotionTemplate, listMotionTemplates } from './server';
