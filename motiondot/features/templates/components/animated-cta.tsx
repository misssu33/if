'use client';

import type { CtaZoneConfig, TemplateTheme, TemplateTypography } from '@/types/motion-template';
import { useAnimationPreset } from '../animation';
import { MotionContainer } from './motion-container';

type AnimatedCTAProps = {
  config: CtaZoneConfig;
  text: string;
  theme: TemplateTheme;
  typography: TemplateTypography;
  loopComposition?: boolean;
};

/** CTA 버튼 오버레이 */
export function AnimatedCTA({
  config,
  text,
  theme,
  typography,
  loopComposition,
}: AnimatedCTAProps) {
  const style = useAnimationPreset(config.timing, config.animation, loopComposition);
  const typo = typography.cta ?? { fontSize: 18, fontWeight: 700 };

  return (
    <MotionContainer timing={config.timing} position={config.position}>
      <button
        type="button"
        style={{
          border: 'none',
          cursor: 'default',
          padding: '14px 28px',
          borderRadius: config.borderRadius ?? 12,
          backgroundColor: theme.ctaBackground,
          color: theme.ctaText,
          fontSize: typo.fontSize,
          fontWeight: typo.fontWeight,
          opacity: style.opacity,
          transform: style.transform,
          filter: style.filter,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}
      >
        {text}
      </button>
    </MotionContainer>
  );
}
