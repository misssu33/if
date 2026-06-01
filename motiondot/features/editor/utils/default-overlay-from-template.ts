import type { MotionTemplateDefinition } from '@/types/motion-template';
import type {
  OverlayEditorState,
  OverlayLayerId,
  OverlayLayerStyle,
} from '../types/overlay-editor';

function styleFromTypography(
  typo: { fontSize: number; fontWeight: number },
  color: string,
): OverlayLayerStyle {
  return {
    fontSize: typo.fontSize,
    fontWeight: typo.fontWeight,
    color,
    textAlign: 'left',
    opacity: 1,
  };
}

/** 템플릿 JSON 기본 문구·타이포 → 오버레이 편집 초기값 */
export function defaultOverlayFromTemplate(
  template: MotionTemplateDefinition,
): OverlayEditorState {
  const { layout, theme, typography } = template;

  const layers: Partial<OverlayEditorState> = {
    headline: {
      text: layout.headline.defaultText,
      style: styleFromTypography(typography.headline, theme.text),
    },
  };

  if (layout.subline && typography.subline) {
    layers.subline = {
      text: layout.subline.defaultText,
      style: styleFromTypography(typography.subline, theme.text),
    };
  } else {
    layers.subline = {
      text: '',
      style: styleFromTypography(
        typography.subline ?? { fontSize: 22, fontWeight: 500 },
        theme.text,
      ),
    };
  }

  if (layout.cta) {
    layers.cta = {
      text: layout.cta.defaultText,
      style: styleFromTypography(
        typography.cta ?? { fontSize: 18, fontWeight: 700 },
        theme.ctaText,
      ),
    };
  } else {
    layers.cta = {
      text: '',
      style: styleFromTypography(
        typography.cta ?? { fontSize: 18, fontWeight: 700 },
        theme.ctaText,
      ),
    };
  }

  if (layout.badge) {
    layers.badge = {
      text: layout.badge.defaultText,
      style: styleFromTypography(
        typography.badge ?? { fontSize: 14, fontWeight: 700 },
        theme.ctaText,
      ),
    };
  } else {
    layers.badge = {
      text: '',
      style: styleFromTypography(
        typography.badge ?? { fontSize: 14, fontWeight: 700 },
        theme.ctaText,
      ),
    };
  }

  return layers as OverlayEditorState;
}

/** 레이어 표시 여부 (템플릿 layout 기준) */
export function layerEnabledInTemplate(
  template: MotionTemplateDefinition,
  layer: OverlayLayerId,
): boolean {
  const { layout } = template;
  if (layer === 'headline') return true;
  if (layer === 'subline') return !!layout.subline;
  if (layer === 'cta') return !!layout.cta;
  if (layer === 'badge') return !!layout.badge;
  return false;
}
