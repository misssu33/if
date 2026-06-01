'use client';

import { usePreviewStore } from '../stores/use-preview-store';
import type { TextOverlayLayerId } from '../types/text-overlay-layer';
import {
  overlayTextInputActiveClass,
  overlayTextInputClass,
} from '../constants/overlay-input-classes';

function fieldClass(layerId: TextOverlayLayerId, active: TextOverlayLayerId | null) {
  return [overlayTextInputClass, active === layerId ? overlayTextInputActiveClass : '']
    .filter(Boolean)
    .join(' ');
}

/** 헤드라인·서브·CTA·뱃지 폼 (미리보기 히트 레이어와 data-overlay-input 연동) */
export function OverlayTextFields() {
  const headline = usePreviewStore((s) => s.headline);
  const setHeadline = usePreviewStore((s) => s.setHeadline);
  const subline = usePreviewStore((s) => s.subline);
  const setSubline = usePreviewStore((s) => s.setSubline);
  const ctaText = usePreviewStore((s) => s.ctaText);
  const setCtaText = usePreviewStore((s) => s.setCtaText);
  const badgeText = usePreviewStore((s) => s.badgeText);
  const setBadgeText = usePreviewStore((s) => s.setBadgeText);
  const activeTextLayer = usePreviewStore((s) => s.activeTextLayer);
  const setActiveTextLayer = usePreviewStore((s) => s.setActiveTextLayer);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <label className="text-xs">
        <span className="text-zinc-500">헤드라인</span>
        <input
          data-overlay-input="headline"
          className={fieldClass('headline', activeTextLayer)}
          value={headline}
          onFocus={() => setActiveTextLayer('headline')}
          onBlur={(e) => {
            const next = e.relatedTarget as HTMLElement | null;
            if (next?.dataset.overlayInput) return;
            setActiveTextLayer(null);
          }}
          onChange={(e) => setHeadline(e.target.value)}
        />
      </label>
      <label className="text-xs">
        <span className="text-zinc-500">서브카피</span>
        <input
          data-overlay-input="subline"
          className={fieldClass('subline', activeTextLayer)}
          value={subline}
          onFocus={() => setActiveTextLayer('subline')}
          onBlur={(e) => {
            const next = e.relatedTarget as HTMLElement | null;
            if (next?.dataset.overlayInput) return;
            setActiveTextLayer(null);
          }}
          onChange={(e) => setSubline(e.target.value)}
        />
      </label>
      <label className="text-xs sm:col-span-2">
        <span className="text-zinc-500">CTA</span>
        <input
          data-overlay-input="cta"
          className={fieldClass('cta', activeTextLayer)}
          value={ctaText}
          onFocus={() => setActiveTextLayer('cta')}
          onBlur={(e) => {
            const next = e.relatedTarget as HTMLElement | null;
            if (next?.dataset.overlayInput) return;
            setActiveTextLayer(null);
          }}
          onChange={(e) => setCtaText(e.target.value)}
        />
      </label>
      <label className="text-xs sm:col-span-2">
        <span className="text-zinc-500">뱃지</span>
        <input
          data-overlay-input="badge"
          className={fieldClass('badge', activeTextLayer)}
          value={badgeText}
          onFocus={() => setActiveTextLayer('badge')}
          onBlur={(e) => {
            const next = e.relatedTarget as HTMLElement | null;
            if (next?.dataset.overlayInput) return;
            setActiveTextLayer(null);
          }}
          onChange={(e) => setBadgeText(e.target.value)}
        />
      </label>
    </div>
  );
}
