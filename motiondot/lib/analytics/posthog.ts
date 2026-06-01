import { getAnonId } from './identity';
import type { AnalyticsEventName } from './events';

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify?: (distinctId: string, properties?: Record<string, unknown>) => void;
    };
  }
}

function posthogHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
}

/** PostHog 키 없으면 no-op */
export function isPostHogConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

/** 스니펫이 주입된 posthog-js 또는 HTTP capture */
export function sendToPostHog(
  event: AnalyticsEventName,
  properties: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;

  const distinctId = getAnonId();
  const payload = {
    ...properties,
    distinct_id: distinctId,
    $lib: 'motiondot-analytics',
  };

  if (window.posthog?.capture) {
    window.posthog.capture(event, payload);
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return;

  const body = {
    api_key: apiKey,
    event,
    properties: payload,
    timestamp: new Date().toISOString(),
  };

  void fetch(`${posthogHost()}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    /* 네트워크·광고차단 — 앱 동작 유지 */
  });
}
