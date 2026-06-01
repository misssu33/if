'use client';

import { useCallback, useMemo } from 'react';
import type { OutputFormat } from '@/types';
import {
  trackAppOpened,
  trackExportCompleted,
  trackExportDestinationSelected,
  trackExportFailed,
  trackExportStarted,
  trackIosDownloadClicked,
  trackIosDownloadGuideShown,
  trackPresetApplied,
  trackReturningVisit,
  trackSellerSegmentIdentified,
  trackTemplateAbandoned,
  trackTemplateExported,
  trackTemplateSelected,
  trackTemplateViewed,
  inferSegmentFromPlatform,
} from '@/lib/analytics';
import { getCtaEdited, getEditTimeSec } from '@/lib/analytics/session';
import type { SellerSegment, SellerSegmentSource } from '@/lib/analytics/storage';

/** 중앙 analytics API — 컴포넌트에서 posthog 직접 호출 금지 */
export function useAnalytics() {
  const trackTemplateExportedWithMeta = useCallback(
    (payload: {
      template_id: string;
      template_name?: string;
      preset_used?: string;
      export_format: OutputFormat;
      aspect_ratio?: string;
      watermarked?: boolean;
      char_count?: number;
    }) => {
      trackTemplateExported({
        ...payload,
        cta_edited: getCtaEdited(),
        edit_time_sec: getEditTimeSec(),
      });
    },
    [],
  );

  return useMemo(
    () => ({
      appOpened: trackAppOpened,
      returningVisit: trackReturningVisit,
      templateViewed: trackTemplateViewed,
      templateSelected: trackTemplateSelected,
      templateAbandoned: trackTemplateAbandoned,
      templateExported: trackTemplateExportedWithMeta,
      presetApplied: trackPresetApplied,
      exportDestinationSelected: trackExportDestinationSelected,
      sellerSegmentIdentified: trackSellerSegmentIdentified,
      exportStarted: trackExportStarted,
      exportCompleted: trackExportCompleted,
      exportFailed: trackExportFailed,
      iosDownloadGuideShown: trackIosDownloadGuideShown,
      iosDownloadClicked: trackIosDownloadClicked,
      inferSegmentFromPlatform,
    }),
    [trackTemplateExportedWithMeta],
  );
}

export type { SellerSegment, SellerSegmentSource };
