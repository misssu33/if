'use client';

import type {
  OverlayTextStyle,
  CtaZoneConfig,
  TemplateTheme,
  TemplateTypography,
} from '@/types/motion-template';
import { mergeOverlayTextStyle } from '../utils/merge-overlay-style';
import { useAnimationPreset } from '../animation';
import { useOverlaySpacing } from '../layouts/overlay-stack-context';
import { AnimatedSequenceSlot } from './animated-sequence-slot';
import { MotionContainer } from './motion-container';

type AnimatedCTAProps = {
  config: CtaZoneConfig;
  text: string;
  theme: TemplateTheme;
  typography: TemplateTypography;
  loopComposition?: boolean;
  stackLayout?: boolean;
  customStyle?: OverlayTextStyle;
};

/** CTA 버튼 오버레이 */
export function AnimatedCTA({
  config,
  text,
  theme,
  typography,
  loopComposition,
  stackLayout = false,
  customStyle,
}: AnimatedCTAProps) {
  const style = useAnimationPreset(config.timing, config.animation, loopComposition);
  const typo = typography.cta ?? { fontSize: 18, fontWeight: 700 };
  const spacing = useOverlaySpacing();

  const merged = mergeOverlayTextStyle({
    typo,
    themeColor: theme.ctaText,
    custom: customStyle,
    animOpacity: style.opacity ?? 1,
  });

  const buttonStyle = {
    border: 'none',
    cursor: 'default',
    padding: '14px 28px',
    borderRadius: config.borderRadius ?? 12,
    backgroundColor: theme.ctaBackground,
    color: merged.color,
    fontSize: merged.fontSize,
    fontWeight: merged.fontWeight,
    opacity: merged.opacity,
    transform: style.transform,
    filter: style.filter,
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    maxWidth: `${spacing.ctaMaxWidthPct}%`,
    width: 'fit-content',
    alignSelf:
      merged.textAlign === 'center'
        ? 'center'
        : merged.textAlign === 'right'
          ? 'flex-end'
          : 'flex-start',
    textAlign: merged.textAlign,
    wordBreak: 'break-word' as const,
    overflowWrap: 'anywhere' as const,
    boxSizing: 'border-box' as const,
  };

  const content = (
    <button type="button" style={buttonStyle}>
      {text}
    </button>
  );

  if (stackLayout) {
    return (
      <AnimatedSequenceSlot timing={config.timing}>{content}</AnimatedSequenceSlot>
    );
  }

  return (
    <MotionContainer timing={config.timing} position={config.position}>
      {content}
    </MotionContainer>
  );
}
