'use client';

import { useCallback, useMemo } from 'react';
import type { MotionTemplateDefinition } from '@/types/motion-template';
import type { MotionDotPreset } from '@/types';
import type { SellerSegment } from '@/lib/analytics';
import {
  trackExportDestinationSelected,
  trackExportStarted,
  trackPresetApplied,
  trackTemplateAbandoned,
  trackTemplateExported,
  trackTemplateSelected,
  trackTemplateViewed,
  trackTextOverlayEdited,
  buildTemplateExportedPayload,
} from '@/lib/analytics';

/** 클라이언트 분석 이벤트 훅 */
export function useAnalytics() {
  const trackViewed = useCallback((template: MotionTemplateDefinition) => {
    trackTemplateViewed(template);
  }, []);

  const trackSelected = useCallback((template: MotionTemplateDefinition) => {
    trackTemplateSelected(template);
  }, []);

  const trackPreset = useCallback((preset: MotionDotPreset) => {
    trackPresetApplied(preset);
  }, []);

  const trackTextEdit = useCallback(() => {
    trackTextOverlayEdited();
  }, []);

  const trackExportStart = useCallback(() => {
    trackExportStarted();
  }, []);

  const trackExported = useCallback(
    (input: {
      template: MotionTemplateDefinition;
      exportFormat: string;
      presetId: string;
      headline: string;
      subline: string;
      ctaText: string;
      badgeText: string;
    }) => {
      const payload = buildTemplateExportedPayload(input);
      trackTemplateExported(payload);
    },
    [],
  );

  const trackAbandoned = useCallback((reason: string) => {
    trackTemplateAbandoned(reason);
  }, []);

  const trackDestination = useCallback(
    (segment: SellerSegment, label: string) => {
      trackExportDestinationSelected(segment, label);
    },
    [],
  );

  return useMemo(
    () => ({
      trackViewed,
      trackSelected,
      trackPreset,
      trackTextEdit,
      trackExportStart,
      trackExported,
      trackAbandoned,
      trackDestination,
    }),
    [
      trackViewed,
      trackSelected,
      trackPreset,
      trackTextEdit,
      trackExportStart,
      trackExported,
      trackAbandoned,
      trackDestination,
    ],
  );
}
