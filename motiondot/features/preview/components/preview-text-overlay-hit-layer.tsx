'use client';

import type { TemplateLayout } from '@/types/motion-template';
import type { ZonePosition } from '@/types/motion-template';
import {
  TEXT_OVERLAY_LAYER_LABELS,
  TEXT_OVERLAY_LAYER_ORDER,
  type TextOverlayLayerId,
} from '../types/text-overlay-layer';
import { zonePositionToHitStyle } from '../utils/zone-hit-style';

type LayerHitConfig = {
  id: TextOverlayLayerId;
  position: ZonePosition;
};

function collectTextLayers(layout: TemplateLayout): LayerHitConfig[] {
  const byId: Partial<Record<TextOverlayLayerId, LayerHitConfig>> = {
    headline: { id: 'headline', position: layout.headline.position },
  };
  if (layout.subline) {
    byId.subline = { id: 'subline', position: layout.subline.position };
  }
  if (layout.cta) {
    byId.cta = { id: 'cta', position: layout.cta.position };
  }
  if (layout.badge) {
    byId.badge = { id: 'badge', position: layout.badge.position };
  }
  return TEXT_OVERLAY_LAYER_ORDER.flatMap((id) => {
    const layer = byId[id];
    return layer ? [layer] : [];
  });
}

type PreviewTextOverlayHitLayerProps = {
  layout: TemplateLayout;
  activeLayer: TextOverlayLayerId | null;
  onSelectLayer: (id: TextOverlayLayerId) => void;
  onClearLayer: () => void;
};

/**
 * 모바일 전용: Remotion 미리보기 위 투명 터치 히트 영역.
 * 데스크톱(md+)에서는 렌더하지 않아 기존 폼 편집 UX 유지.
 */
export function PreviewTextOverlayHitLayer({
  layout,
  activeLayer,
  onSelectLayer,
  onClearLayer,
}: PreviewTextOverlayHitLayerProps) {
  const layers = collectTextLayers(layout);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 max-md:pointer-events-auto md:hidden"
      aria-hidden={false}
    >
      {activeLayer !== null && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="텍스트 편집 닫기"
          className="absolute inset-0 z-[5] border-0 bg-transparent p-0 touch-manipulation"
          onClick={onClearLayer}
        />
      )}

      {layers.map(({ id, position }) => {
        const isActive = activeLayer === id;
        const hitStyle = zonePositionToHitStyle(position, id);

        return (
          <button
            key={id}
            type="button"
            aria-label={`${TEXT_OVERLAY_LAYER_LABELS[id]} 편집`}
            aria-pressed={isActive}
            className={[
              'absolute z-10 border-0 bg-transparent p-0 touch-manipulation',
              'max-md:min-h-11 max-md:min-w-11',
              'max-md:before:pointer-events-auto max-md:before:absolute max-md:before:left-1/2 max-md:before:top-1/2',
              'max-md:before:h-full max-md:before:w-full max-md:before:min-h-11 max-md:before:min-w-11',
              'max-md:before:-translate-x-1/2 max-md:before:-translate-y-1/2',
              'max-md:before:content-[""]',
              isActive
                ? 'max-md:rounded-lg max-md:ring-2 max-md:ring-violet-500/45'
                : '',
            ].join(' ')}
            style={hitStyle}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLayer(id);
            }}
          >
            <span className="sr-only">{TEXT_OVERLAY_LAYER_LABELS[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
