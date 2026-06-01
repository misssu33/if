'use client';

import { AbsoluteFill } from 'remotion';
import type { MotionCompositionProps } from '@/types/motion-template';
import {
  AnimatedBadge,
  AnimatedCTA,
  AnimatedMedia,
  AnimatedText,
} from '../components';
import { OverlayStackLayout } from './overlay-stack-layout';
import { OverlayStackProvider } from './overlay-stack-context';

/** JSON 레이아웃 → Remotion 레이어 조합 (텍스트는 세로 스택 오버레이) */
export function AdTemplateLayout(props: MotionCompositionProps) {
  const { template, loop } = props;
  const { layout, theme, typography } = template;

  const bgSrc = props.backgroundSrc;
  const productSrc = props.productSrc ?? props.backgroundSrc;
  const logoSrc = props.logoSrc;

  const watermark = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        maxWidth: '100%',
      }}
    >
      {props.formatLabel && (
        <div
          style={{
            background: 'rgba(124,58,237,0.9)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            maxWidth: '100%',
            wordBreak: 'break-word',
          }}
        >
          {props.formatLabel}
        </div>
      )}
      {layout.logo && logoSrc && (
        <AnimatedMedia
          config={layout.logo}
          src={logoSrc}
          loopComposition={loop}
          stackLayout
        />
      )}
    </div>
  );

  return (
    <OverlayStackProvider
      aspectRatio={template.aspectRatio}
      width={props.width}
      height={props.height}
    >
      <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
        {layout.background.kind !== 'none' && bgSrc && (
          <AnimatedMedia
            config={layout.background}
            src={bgSrc}
            loopComposition={loop}
            fill
          />
        )}

        {(layout.background.kind === 'none' || !bgSrc) && (
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

        <OverlayStackLayout
          top={
            layout.badge ? (
              <AnimatedBadge
                config={layout.badge}
                text={props.badgeText}
                theme={theme}
                typography={typography}
                loopComposition={loop}
                stackLayout
                customStyle={props.overlayStyles?.badge}
              />
            ) : null
          }
          watermark={watermark}
          bottom={
            <>
              <AnimatedText
                config={layout.headline}
                text={props.headline}
                theme={theme}
                typography={typography}
                variant="headline"
                loopComposition={loop}
                stackLayout
                customStyle={props.overlayStyles?.headline}
              />
              {layout.subline && (
                <AnimatedText
                  config={layout.subline}
                  text={props.subline}
                  theme={theme}
                  typography={typography}
                  variant="subline"
                  loopComposition={loop}
                  stackLayout
                  customStyle={props.overlayStyles?.subline}
                />
              )}
              {layout.cta && (
                <AnimatedCTA
                  config={layout.cta}
                  text={props.ctaText}
                  theme={theme}
                  typography={typography}
                  loopComposition={loop}
                  stackLayout
                  customStyle={props.overlayStyles?.cta}
                />
              )}
            </>
          }
        />

        {props.showSafeZone && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              zIndex: 3,
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              pointerEvents: 'none',
            }}
          >
            Safe zone · {template.aspectRatio}
          </div>
        )}
      </AbsoluteFill>
    </OverlayStackProvider>
  );
}
