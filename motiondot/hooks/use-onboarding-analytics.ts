'use client';

import { useEffect } from 'react';
import {
  recordVisit,
  getLastPresetUsed,
  getLastTemplateUsed,
} from '@/lib/analytics/storage';
import { trackAppOpened, trackReturningVisit } from '@/lib/analytics/events';
import { markOnce } from '@/lib/analytics/session';

/** 앱 오픈·재방문 — 세션당 1회 */
export function useOnboardingAnalytics() {
  useEffect(() => {
    if (!markOnce('session:init_analytics')) return;

    trackAppOpened();
    const { visitCount, daysSinceLast, isReturning } = recordVisit();

    if (isReturning) {
      trackReturningVisit({
        visit_count: visitCount,
        days_since_last: daysSinceLast,
        last_template_used: getLastTemplateUsed(),
        last_preset_used: getLastPresetUsed(),
      });
    }
  }, []);
}
