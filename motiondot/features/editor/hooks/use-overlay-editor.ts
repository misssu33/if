'use client';

import { useCallback, useEffect, useMemo } from 'react';
import type { MotionTemplateDefinition } from '@/types/motion-template';
import { useOverlayEditorStore } from '../stores/use-overlay-editor-store';
import type { OverlayLayerId, OverlayLayerStyle } from '../types/overlay-editor';
import {
  defaultOverlayFromTemplate,
  layerEnabledInTemplate,
} from '../utils/default-overlay-from-template';

/** 오버레이 편집 상태 ↔ 미리보기 렌더 분리 브리지 */
export function useOverlayEditor(template: MotionTemplateDefinition | undefined) {
  const layers = useOverlayEditorStore((s) => s.layers);
  const panelOpen = useOverlayEditorStore((s) => s.panelOpen);
  const hydrateFromTemplate = useOverlayEditorStore((s) => s.hydrateFromTemplate);
  const setLayerText = useOverlayEditorStore((s) => s.setLayerText);
  const setLayerStyle = useOverlayEditorStore((s) => s.setLayerStyle);
  const resetLayerToTemplate = useOverlayEditorStore((s) => s.resetLayerToTemplate);
  const setPanelOpen = useOverlayEditorStore((s) => s.setPanelOpen);

  useEffect(() => {
    if (template) hydrateFromTemplate(template);
  }, [template, hydrateFromTemplate]);

  const previewText = useMemo(() => {
    if (!layers) {
      return {
        headline: template?.layout.headline.defaultText ?? '',
        subline: template?.layout.subline?.defaultText ?? '',
        ctaText: template?.layout.cta?.defaultText ?? '',
        badgeText: template?.layout.badge?.defaultText ?? '',
      };
    }
    return {
      headline: layers.headline.text,
      subline: layers.subline.text,
      ctaText: layers.cta.text,
      badgeText: layers.badge.text,
    };
  }, [layers, template]);

  const overlayStyles = useMemo(() => {
    if (!layers) return undefined;
    return {
      headline: layers.headline.style,
      subline: layers.subline.style,
      cta: layers.cta.style,
      badge: layers.badge.style,
    };
  }, [layers]);

  const isLayerEnabled = useCallback(
    (layer: OverlayLayerId) =>
      template ? layerEnabledInTemplate(template, layer) : layer === 'headline',
    [template],
  );

  const resetAllToTemplate = useCallback(() => {
    if (!template) return;
    useOverlayEditorStore.setState({
      layers: defaultOverlayFromTemplate(template),
      templateId: template.id,
    });
  }, [template]);

  return {
    layers,
    panelOpen,
    setPanelOpen,
    setLayerText,
    setLayerStyle: (layer: OverlayLayerId, patch: Partial<OverlayLayerStyle>) =>
      setLayerStyle(layer, patch),
    resetLayerToTemplate: (layer: OverlayLayerId) => {
      if (template) resetLayerToTemplate(layer, template);
    },
    resetAllToTemplate,
    isLayerEnabled,
    previewText,
    overlayStyles,
  };
}
