'use client';

import type { BadgeZoneConfig, TemplateTheme, TemplateTypography } from '@/types/motion-template';
import { useAnimationPreset } from '../animation';
import { MotionContainer } from './motion-container';

type AnimatedBadgeProps = {
  config: BadgeZoneConfig;
  text: string;
  theme: TemplateTheme;
  typography: TemplateTypography;
  loopComposition?: boolean;
};

/** 프로모 뱃지 */
export function AnimatedBadge({
  config,
  text,
  theme,
  typography,
  loopComposition,
}: AnimatedBadgeProps) {
  const style = useAnimationPreset(config.timing, config.animation, loopComposition);
  const typo = typography.badge ?? { fontSize: 14, fontWeight: 700 };

  return (
    <MotionContainer timing={config.timing} position={config.position}>
      <span
        style={{
          display: 'inline-block',
          padding: '6px 12px',
          borderRadius: 8,
          backgroundColor: theme.primary,
          color: theme.ctaText,
          fontSize: typo.fontSize,
          fontWeight: typo.fontWeight,
          opacity: style.opacity,
          transform: style.transform,
          filter: style.filter,
        }}
      >
        {text}
      </span>
    </MotionContainer>
  );
}
