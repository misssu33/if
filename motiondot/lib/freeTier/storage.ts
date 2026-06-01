import {
  DEFAULT_WATERMARK_OPACITY,
  FREE_TIER_STORAGE_KEYS,
} from './config';
import type {
  FreeTierPreferences,
  FreeTierUsage,
  PlanTier,
} from './types';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeSessionJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(key, JSON.stringify(value));
}

function writeLocalJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function readPlanTier(): PlanTier {
  if (typeof window === 'undefined') return 'free';
  const raw = localStorage.getItem(FREE_TIER_STORAGE_KEYS.plan);
  return raw === 'pro' ? 'pro' : 'free';
}

export function readFreeTierUsage(): FreeTierUsage {
  const sessionId =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('motiondot:session-id') ??
        (() => {
          const id = crypto.randomUUID();
          sessionStorage.setItem('motiondot:session-id', id);
          return id;
        })()
      : 'ssr';

  return readJson<FreeTierUsage>(FREE_TIER_STORAGE_KEYS.usage, {
    exportCount: 0,
    sessionId,
  });
}

export function writeFreeTierUsage(usage: FreeTierUsage): void {
  writeSessionJson(FREE_TIER_STORAGE_KEYS.usage, usage);
}

export function readFreeTierPreferences(): FreeTierPreferences {
  return readJson<FreeTierPreferences>(FREE_TIER_STORAGE_KEYS.prefs, {
    watermarkOpacity: DEFAULT_WATERMARK_OPACITY,
  });
}

export function writeFreeTierPreferences(prefs: FreeTierPreferences): void {
  writeLocalJson(FREE_TIER_STORAGE_KEYS.prefs, prefs);
}
