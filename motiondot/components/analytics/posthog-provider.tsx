'use client';

import { useEffect, type ReactNode } from 'react';
import { initPostHog } from '@/lib/analytics/posthog';
import { useOnboardingAnalytics } from '@/hooks/use-onboarding-analytics';
import { useExportAnalytics } from '@/hooks/use-export-analytics';

function AnalyticsListeners() {
  useOnboardingAnalytics();
  useExportAnalytics();
  return null;
}

type PostHogProviderProps = {
  children: ReactNode;
};

/** PostHog 초기화 + Priority A 리스너 (키 없으면 no-op) */
export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      <AnalyticsListeners />
      {children}
    </>
  );
}
