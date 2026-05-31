'use client';

import { useEffect } from 'react';
import { PageShell } from '@/components/ui';
import { AppHeader } from '@/components/layout';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { LandingDashboard } from './landing-dashboard';
import { GuidedWorkspace } from './guided-workspace';

/** 랜딩 ↔ 3단계 가이드 전환 */
export function OnboardingShell() {
  const showLanding = useOnboardingStore((s) => s.showLanding);
  const hydrate = useOnboardingStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (showLanding) {
    return (
      <PageShell className="min-h-screen">
        <AppHeader />
        <LandingDashboard />
      </PageShell>
    );
  }

  return <GuidedWorkspace />;
}
