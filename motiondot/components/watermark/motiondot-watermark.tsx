'use client';

import type { WatermarkConfig } from '@/lib/freeTier';

type MotionDotWatermarkProps = {
  watermark: WatermarkConfig;
  /** composition 너비 (safe zone 비율 계산) */
  width: number;
  height: number;
};

/**
 * MotionDot 브랜드 워터마크 — 상단 safe zone (뱃지·하단 CTA/헤드라인과 분리)
 */
export function MotionDotWatermark({
  watermark,
  width,
  height,
}: MotionDotWatermarkProps) {
  if (!watermark.enabled) return null;

  const padX = Math.round(width * 0.06);
  const top = Math.round(height * 0.1);
  const fontSize = Math.max(11, Math.round(width * 0.028));

  return (
    <div
      style={{
        position: 'absolute',
        top,
        right: padX,
        zIndex: 4,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        maxWidth: `${Math.round(width * 0.42)}px`,
        opacity: watermark.opacity,
      }}
      aria-hidden
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: fontSize + 8,
          height: fontSize + 8,
          borderRadius: 6,
          background: 'rgba(124,58,237,0.85)',
          color: '#fff',
          fontSize: fontSize * 0.65,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        M
      </span>
      <span
        style={{
          color: '#fff',
          fontSize,
          fontWeight: 700,
          letterSpacing: 0.02,
          textShadow: '0 1px 8px rgba(0,0,0,0.65)',
          wordBreak: 'break-word',
          lineHeight: 1.2,
        }}
      >
        MotionDot
      </span>
    </div>
  );
}
