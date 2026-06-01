import { create } from 'zustand';
import type { GuidedStep, UploadIntent } from '../types';
import { readOnboardingStorage, writeOnboardingStorage } from '../utils/storage';
import { readDismissedTooltips } from '../utils/init-onboarding-storage';

interface OnboardingState {
  showLanding: boolean;
  currentStep: GuidedStep;
  uploadIntent: UploadIntent | null;
  dismissedTooltips: Set<string>;
  /** 클라이언트 스토리지 초기화 완료 */
  bootstrapped: boolean;
  bootstrapFromStorage: () => void;
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
  bootstrapped: false,

  /** 앱 부팅 1회 — showLanding은 여기서만 스토리지와 동기화 */
  bootstrapFromStorage: () => {
    if (get().bootstrapped) return;
    const stored = readOnboardingStorage();
    set({
      bootstrapped: true,
      showLanding: !stored.hasCompletedTour,
      dismissedTooltips: readDismissedTooltips(),
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

  openLanding: () =>
    set({
      showLanding: true,
      currentStep: 1,
    }),

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
