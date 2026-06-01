'use client';

import { AbsoluteFill } from 'remotion';
import type { MotionCompositionProps } from '@/types/motion-template';
import { MotionDotWatermark } from '@/components/watermark';
import {
  AnimatedBadge,
  AnimatedCTA,
  AnimatedMedia,
  AnimatedText,
} from '../components';

/** JSON 레이아웃 → Remotion 레이어 조합 */
export function AdTemplateLayout(props: MotionCompositionProps) {
  const { template, loop } = props;
  const { layout, theme, typography } = template;

  const bgSrc = props.backgroundSrc;
  const productSrc = props.productSrc ?? props.backgroundSrc;
  const logoSrc = props.logoSrc;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {layout.background.kind !== 'none' && bgSrc && (
        <AnimatedMedia
          config={layout.background}
          src={bgSrc}
          loopComposition={loop}
          fill
        />
      )}

      {layout.background.kind === 'none' && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
          }}
        />
      )}

      {theme.overlay && (
        <AbsoluteFill style={{ background: theme.overlay }} />
      )}

      {layout.product && productSrc && (
        <AnimatedMedia
          config={layout.product}
          src={productSrc}
          loopComposition={loop}
        />
      )}

      {layout.logo && logoSrc && (
        <AnimatedMedia config={layout.logo} src={logoSrc} loopComposition={loop} />
      )}

      <AnimatedText
        config={layout.headline}
        text={props.headline}
        theme={theme}
        typography={typography}
        variant="headline"
        loopComposition={loop}
      />

      {layout.subline && (
        <AnimatedText
          config={layout.subline}
          text={props.subline}
          theme={theme}
          typography={typography}
          variant="subline"
          loopComposition={loop}
        />
      )}

      {layout.cta && (
        <AnimatedCTA
          config={layout.cta}
          text={props.ctaText}
          theme={theme}
          typography={typography}
          loopComposition={loop}
        />
      )}

      {layout.badge && (
        <AnimatedBadge
          config={layout.badge}
          text={props.badgeText}
          theme={theme}
          typography={typography}
          loopComposition={loop}
        />
      )}

      {props.watermark?.enabled && (
        <MotionDotWatermark
          watermark={props.watermark}
          width={props.width}
          height={props.height}
        />
      )}

      {props.formatLabel && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(124,58,237,0.9)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            zIndex: 3,
            maxWidth: '40%',
            wordBreak: 'break-word',
          }}
        >
          {props.formatLabel}
        </div>
      )}

      {props.showSafeZone && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
          }}
        >
          Safe zone · {template.aspectRatio}
        </div>
      )}
    </AbsoluteFill>
  );
}
