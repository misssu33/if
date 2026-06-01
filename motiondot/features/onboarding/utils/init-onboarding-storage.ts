import { readOnboardingStorage } from './storage';

/** 최초 클라이언트 마운트 시 랜딩 표시 여부 */
export function shouldShowLandingOnBoot(): boolean {
  const stored = readOnboardingStorage();
  return !stored.hasCompletedTour;
}

/** 툴팁 dismiss 목록 */
export function readDismissedTooltips(): Set<string> {
  const stored = readOnboardingStorage();
  return new Set(stored.dismissedTooltips ?? []);
}
