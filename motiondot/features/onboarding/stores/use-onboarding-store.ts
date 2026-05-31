import { create } from 'zustand';
import type { GuidedStep, UploadIntent } from '../types';
import { readOnboardingStorage, writeOnboardingStorage } from '../utils/storage';

interface OnboardingState {
  showLanding: boolean;
  currentStep: GuidedStep;
  uploadIntent: UploadIntent | null;
  dismissedTooltips: Set<string>;
  hydrate: () => void;
  startFlow: (intent?: UploadIntent) => void;
  openLanding: () => void;
  setStep: (step: GuidedStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  dismissTooltip: (id: string) => void;
  isTooltipDismissed: (id: string) => boolean;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  showLanding: true,
  currentStep: 1,
  uploadIntent: null,
  dismissedTooltips: new Set(),

  hydrate: () => {
    const stored = readOnboardingStorage();
    const dismissed = new Set(stored.dismissedTooltips ?? []);
    set({
      showLanding: !stored.hasCompletedTour,
      dismissedTooltips: dismissed,
    });
  },

  startFlow: (intent) => {
    writeOnboardingStorage({ hasCompletedTour: true });
    set({
      showLanding: false,
      currentStep: intent === 'template' ? 2 : 1,
      uploadIntent: intent ?? 'video',
    });
  },

  openLanding: () => set({ showLanding: true }),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(3, s.currentStep + 1) as GuidedStep,
    })),

  prevStep: () =>
    set((s) => ({
      currentStep: Math.max(1, s.currentStep - 1) as GuidedStep,
    })),

  dismissTooltip: (id) => {
    const next = new Set(get().dismissedTooltips);
    next.add(id);
    writeOnboardingStorage({ dismissedTooltips: [...next] });
    set({ dismissedTooltips: next });
  },

  isTooltipDismissed: (id) => get().dismissedTooltips.has(id),
}));
