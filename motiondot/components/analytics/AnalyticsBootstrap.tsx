'use client';

import { useEffect, useRef } from 'react';
import { initAnalyticsIdentity, trackReturningVisit } from '@/lib/analytics';

/** 익명 ID·방문 수 초기화 + 재방문 이벤트 */
export function AnalyticsBootstrap() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const { isReturning } = initAnalyticsIdentity();
    if (isReturning) {
      trackReturningVisit();
    }
  }, []);

  return null;
}
