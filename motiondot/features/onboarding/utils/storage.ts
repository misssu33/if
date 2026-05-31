const KEY = 'motiondot:onboarding';

type Stored = {
  hasCompletedTour?: boolean;
  dismissedTooltips?: string[];
};

export function readOnboardingStorage(): Stored {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

export function writeOnboardingStorage(patch: Stored): void {
  if (typeof window === 'undefined') return;
  const next = { ...readOnboardingStorage(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
}
