import { ANALYTICS_STORAGE_KEYS } from './storage-keys';

function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

export function readStorage(key: string): string | null {
  if (!canUseStorage()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* quota / private mode */
  }
}

export function readSession(key: string): string | null {
  if (!canUseStorage()) return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string): void {
  if (!canUseStorage()) return;
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function readNumber(key: string, fallback = 0): number {
  const raw = readStorage(key);
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function incrementStorage(key: string): number {
  const next = readNumber(key, 0) + 1;
  writeStorage(key, String(next));
  return next;
}

