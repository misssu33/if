import posthog from 'posthog-js';

let initialized = false;

export function getPostHogHost(): string {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ||
    'https://app.posthog.com'
  );
}

export function isPostHogConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  return Boolean(key);
}

/** 공개 키가 있을 때만 초기화 — 실패해도 앱 동작 유지 */
export function initPostHog(): void {
  if (typeof window === 'undefined' || initialized) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return;

  try {
    posthog.init(key, {
      api_host: getPostHogHost(),
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: false,
      persistence: 'localStorage',
      autocapture: false,
      disable_session_recording: true,
    });
    initialized = true;
  } catch {
    // analytics 실패는 무시
  }
}

export function captureEvent(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
): void {
  if (!isPostHogConfigured() || typeof window === 'undefined') return;

  try {
    if (!initialized) initPostHog();
    if (!initialized) return;

    const cleaned: Record<string, string | number | boolean> = {};
    if (properties) {
      for (const [k, v] of Object.entries(properties)) {
        if (v !== undefined && v !== null) {
          cleaned[k] = v as string | number | boolean;
        }
      }
    }
    posthog.capture(event, cleaned);
  } catch {
    // GIF/export 등 핵심 기능은 차단하지 않음
  }
}
