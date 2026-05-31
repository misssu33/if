'use client';

import type { TextZoneConfig, TemplateTheme, TemplateTypography } from '@/types/motion-template';
import { useAnimationPreset } from '../animation';
import { MotionContainer } from './motion-container';

type AnimatedTextProps = {
  config: TextZoneConfig;
  text: string;
  theme: TemplateTheme;
  typography: TemplateTypography;
  variant: 'headline' | 'subline';
  loopComposition?: boolean;
};

/** 애니메이션 텍스트 */
export function AnimatedText({
  config,
  text,
  theme,
  typography,
  variant,
  loopComposition,
}: AnimatedTextProps) {
  const style = useAnimationPreset(config.timing, config.animation, loopComposition);
  const typo = variant === 'headline' ? typography.headline : typography.subline!;

  return (
    <MotionContainer timing={config.timing} position={config.position}>
      <p
        style={{
          margin: 0,
          color: theme.text,
          fontSize: typo.fontSize,
          fontWeight: typo.fontWeight,
          lineHeight: typo.lineHeight ?? 1.2,
          letterSpacing: typo.letterSpacing,
          opacity: style.opacity,
          transform: style.transform,
          filter: style.filter,
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        {text}
      </p>
    </MotionContainer>
  );
}
