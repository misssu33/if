'use client';

import type {
  OverlayTextStyle,
  BadgeZoneConfig,
  TemplateTheme,
  TemplateTypography,
} from '@/types/motion-template';
import { mergeOverlayTextStyle } from '../utils/merge-overlay-style';
import { useAnimationPreset } from '../animation';
import { AnimatedSequenceSlot } from './animated-sequence-slot';
import { MotionContainer } from './motion-container';

type AnimatedBadgeProps = {
  config: BadgeZoneConfig;
  text: string;
  theme: TemplateTheme;
  typography: TemplateTypography;
  loopComposition?: boolean;
  stackLayout?: boolean;
  customStyle?: OverlayTextStyle;
};

/** 프로모 뱃지 */
export function AnimatedBadge({
  config,
  text,
  theme,
  typography,
  loopComposition,
  stackLayout = false,
  customStyle,
}: AnimatedBadgeProps) {
  const style = useAnimationPreset(config.timing, config.animation, loopComposition);
  const typo = typography.badge ?? { fontSize: 14, fontWeight: 700 };

  const merged = mergeOverlayTextStyle({
    typo,
    themeColor: theme.ctaText,
    custom: customStyle,
    animOpacity: style.opacity ?? 1,
  });

  const content = (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: 8,
        backgroundColor: theme.primary,
        color: merged.color,
        fontSize: merged.fontSize,
        fontWeight: merged.fontWeight,
        opacity: merged.opacity,
        transform: style.transform,
        filter: style.filter,
        maxWidth: '100%',
        textAlign: merged.textAlign,
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        boxSizing: 'border-box',
      }}
    >
      {text}
    </span>
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
