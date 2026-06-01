import {
  ANALYTICS_SESSION_KEYS,
  ANALYTICS_STORAGE_KEYS,
} from './storage-keys';
import {
  incrementStorage,
  readNumber,
  readSession,
  readStorage,
  writeSession,
  writeStorage,
} from './local-store';

function createAnonId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `md_${crypto.randomUUID()}`;
  }
  return `md_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function getAnonId(): string {
  const existing = readStorage(ANALYTICS_STORAGE_KEYS.anonId);
  if (existing) return existing;
  const id = createAnonId();
  writeStorage(ANALYTICS_STORAGE_KEYS.anonId, id);
  return id;
}

export function getVisitCount(): number {
  return readNumber(ANALYTICS_STORAGE_KEYS.visitCount, 0);
}

export function getExportCount(): number {
  return readNumber(ANALYTICS_STORAGE_KEYS.exportCount, 0);
}

export function incrementExportCount(): number {
  return incrementStorage(ANALYTICS_STORAGE_KEYS.exportCount);
}

export function getFirstVisitTs(): number | null {
  const raw = readStorage(ANALYTICS_STORAGE_KEYS.firstVisitTs);
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export function getStoredSegment(): string | null {
  return readStorage(ANALYTICS_STORAGE_KEYS.segment);
}

export function setStoredSegment(segment: string): void {
  writeStorage(ANALYTICS_STORAGE_KEYS.segment, segment);
}

export function setLastTemplateId(templateId: string): void {
  writeStorage(ANALYTICS_STORAGE_KEYS.lastTemplate, templateId);
}

export function setLastPresetId(presetId: string): void {
  writeStorage(ANALYTICS_STORAGE_KEYS.lastPreset, presetId);
}

/** 앱 로드 시 1회 — anon_id·방문 수·첫 방문 시각 */
export function initAnalyticsIdentity(): {
  anonId: string;
  visitCount: number;
  isReturning: boolean;
} {
  getAnonId();

  const firstTs = readStorage(ANALYTICS_STORAGE_KEYS.firstVisitTs);
  if (!firstTs) {
    writeStorage(ANALYTICS_STORAGE_KEYS.firstVisitTs, String(Date.now()));
  }

  let visitCount = getVisitCount();
  const recorded = readSession(ANALYTICS_SESSION_KEYS.visitRecorded);
  if (!recorded) {
    visitCount = incrementStorage(ANALYTICS_STORAGE_KEYS.visitCount);
    writeSession(ANALYTICS_SESSION_KEYS.visitRecorded, '1');
  }

  return {
    anonId: getAnonId(),
    visitCount,
    isReturning: visitCount > 1,
  };
}
