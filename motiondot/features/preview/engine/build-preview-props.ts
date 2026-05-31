import type { MotionDotPreset, OutputFormat, UploadFileMeta } from '@/types';
import type { MotionTemplateDefinition } from '@/types/motion-template';
import { buildCompositionProps } from '@/features/templates/engine/build-composition-props';

type BuildInput = {
  template: MotionTemplateDefinition;
  preset?: MotionDotPreset;
  file?: UploadFileMeta;
  format: OutputFormat;
  mediaSrc?: string;
  durationSec?: number;
  headline?: string;
  subline?: string;
  ctaText?: string;
  badgeText?: string;
};

/** 프리셋·템플릿·업로드 → Remotion composition props */
export function buildPreviewProps(input: BuildInput) {
  const durationSec = input.durationSec ?? input.template.durationSec;

  return buildCompositionProps({
    template: input.template,
    format: input.format,
    showSafeZone: true,
    overrides: {
      headline: input.headline ?? input.file?.originalName ?? input.template.layout.headline.defaultText,
      subline: input.subline ?? input.template.layout.subline?.defaultText,
      ctaText: input.ctaText ?? input.template.layout.cta?.defaultText,
      badgeText: input.badgeText ?? input.template.layout.badge?.defaultText,
      backgroundSrc: input.mediaSrc,
      productSrc: input.mediaSrc,
      durationSec,
    },
  });
}
