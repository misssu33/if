'use client';

import { AppShell } from '@/components/layout/app-shell';
import { PageShell } from '@/components/ui';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { StepUpload } from './step-upload';
import { StepPresetTemplate } from './step-preset-template';
import { StepPreviewExport } from './step-preview-export';

export function GuidedWorkspace() {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const openLanding = useOnboardingStore((s) => s.openLanding);

  return (
    <PageShell className="min-h-screen overflow-x-hidden">
      <AppShell currentStep={currentStep} onHome={openLanding}>
        <div className="flex min-w-0 flex-col gap-6">
          {currentStep === 1 && <StepUpload />}
          {currentStep === 2 && <StepPresetTemplate />}
          {currentStep === 3 && <StepPreviewExport />}
        </div>
      </AppShell>
    </PageShell>
  );
}
