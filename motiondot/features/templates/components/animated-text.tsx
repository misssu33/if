'use client';

import type {
  OverlayTextStyle,
  TextZoneConfig,
  TemplateTheme,
  TemplateTypography,
} from '@/types/motion-template';
import { mergeOverlayTextStyle } from '../utils/merge-overlay-style';
import { useAnimationPreset } from '../animation';
import { useOverlaySpacing } from '../layouts/overlay-stack-context';
import { AnimatedSequenceSlot } from './animated-sequence-slot';
import { MotionContainer } from './motion-container';

type AnimatedTextProps = {
  config: TextZoneConfig;
  text: string;
  theme: TemplateTheme;
  typography: TemplateTypography;
  variant: 'headline' | 'subline';
  loopComposition?: boolean;
  /** true: 하단 스택 (겹침 방지) */
  stackLayout?: boolean;
  customStyle?: OverlayTextStyle;
};

/** 애니메이션 텍스트 */
export function AnimatedText({
  config,
  text,
  theme,
  typography,
  variant,
  loopComposition,
  stackLayout = false,
  customStyle,
}: AnimatedTextProps) {
  const style = useAnimationPreset(config.timing, config.animation, loopComposition);
  const typo = variant === 'headline' ? typography.headline : typography.subline!;
  const spacing = useOverlaySpacing();

  const maxWidthPct =
    variant === 'headline'
      ? spacing.headlineMaxWidthPct
      : spacing.sublineMaxWidthPct;

  const merged = mergeOverlayTextStyle({
    typo,
    themeColor: theme.text,
    custom: customStyle,
    animOpacity: style.opacity ?? 1,
  });

  const textStyle = {
    margin: 0,
    color: merged.color,
    fontSize: merged.fontSize,
    fontWeight: merged.fontWeight,
    lineHeight: merged.lineHeight,
    letterSpacing: merged.letterSpacing,
    opacity: merged.opacity,
    transform: style.transform,
    filter: style.filter,
    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
    maxWidth: `${maxWidthPct}%`,
    width: '100%',
    textAlign: merged.textAlign,
    alignSelf:
      merged.textAlign === 'center'
        ? 'center'
        : merged.textAlign === 'right'
          ? 'flex-end'
          : 'flex-start',
    wordBreak: 'break-word' as const,
    overflowWrap: 'anywhere' as const,
    boxSizing: 'border-box' as const,
  };

  const content = <p style={textStyle}>{text}</p>;

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
