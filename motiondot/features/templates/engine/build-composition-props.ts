import type {
  MotionCompositionProps,
  MotionTemplateDefinition,
  OverlayStylesMap,
} from '@/types/motion-template';
import type { OutputFormat } from '@/types';
import { resolveTemplateContent, resolveTemplateDefinition } from './resolve-template';

const FORMAT_LABEL: Record<OutputFormat, string> = {
  gif: 'GIF',
  mp4: 'MP4',
  webp: 'WEBP',
};

export type BuildCompositionInput = {
  template: MotionTemplateDefinition;
  format?: OutputFormat;
  overrides?: {
    headline?: string;
    subline?: string;
    ctaText?: string;
    badgeText?: string;
    backgroundSrc?: string;
    productSrc?: string;
    logoSrc?: string;
    durationSec?: number;
    overlayStyles?: OverlayStylesMap;
  };
  showSafeZone?: boolean;
};

/** 템플릿 JSON → Remotion inputProps (UI/FFmpeg와 분리) */
export function buildCompositionProps(
  input: BuildCompositionInput,
): MotionCompositionProps {
  const template = resolveTemplateDefinition(input.template);
  const durationSec = input.overrides?.durationSec ?? template.durationSec;
  const durationInFrames = Math.max(
    template.fps * 2,
    Math.floor(durationSec * template.fps),
  );

  const content = resolveTemplateContent(template, {
    headline: input.overrides?.headline,
    subline: input.overrides?.subline,
    ctaText: input.overrides?.ctaText,
    badgeText: input.overrides?.badgeText,
    backgroundSrc: input.overrides?.backgroundSrc,
    productSrc: input.overrides?.productSrc,
    logoSrc: input.overrides?.logoSrc,
  });

  return {
    width: template.width,
    height: template.height,
    fps: template.fps,
    durationInFrames,
    loop: template.loop,
    template,
    ...content,
    overlayStyles: input.overrides?.overlayStyles,
    formatLabel: input.format ? FORMAT_LABEL[input.format] : undefined,
    showSafeZone: input.showSafeZone ?? false,
  };
}
