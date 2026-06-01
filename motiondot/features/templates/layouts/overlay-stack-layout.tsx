'use client';

import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { useOverlaySpacing } from './overlay-stack-context';

type OverlayStackLayoutProps = {
  top?: ReactNode;
  bottom?: ReactNode;
  watermark?: ReactNode;
};

/**
 * 모바일 우선 세로 오버레이 스택
 * top: 뱃지·로고 | center: 미디어(뒤) | bottom: 헤드라인·서브·CTA
 */
export function OverlayStackLayout({
  top,
  bottom,
  watermark,
}: OverlayStackLayoutProps) {
  const spacing = useOverlaySpacing();

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: spacing.topPaddingPx,
        paddingBottom: spacing.bottomPaddingPx + spacing.bottomSafeExtraPx,
        paddingLeft: spacing.horizontalPaddingPx,
        paddingRight: spacing.horizontalPaddingPx,
        boxSizing: 'border-box',
      }}
    >
      {/* 하단 가독용 스크림 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '48%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: spacing.topRowGapPx,
          width: '100%',
          maxWidth: '100%',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: spacing.topRowGapPx,
            minWidth: 0,
            flex: 1,
          }}
        >
          {top}
        </div>
        {watermark ? (
          <div style={{ flexShrink: 0, alignSelf: 'flex-start' }}>{watermark}</div>
        ) : null}
      </div>

      <div style={{ flex: 1, minHeight: 0 }} aria-hidden />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: spacing.stackGapPx,
          width: '100%',
          maxWidth: '100%',
          flexShrink: 0,
        }}
      >
        {bottom}
      </div>
    </AbsoluteFill>
  );
}
