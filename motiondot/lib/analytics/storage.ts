/** 익명 localStorage — 온보딩 키와 분리 */

const KEY = 'motiondot:analytics';

export type SellerSegment =
  | 'marketplace_seller'
  | 'brand_dtc'
  | 'creator'
  | 'agency'
  | 'other';

export type SellerSegmentSource = 'self_report' | 'inferred';

type AnalyticsStorage = {
  visitCount?: number;
  lastVisitAt?: string;
  lastTemplateId?: string;
  lastPresetId?: string;
  sellerSegment?: SellerSegment;
  sellerSegmentSource?: 'self_report' | 'inferred';
  selectedDestination?: string;
};

function read(): AnalyticsStorage {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AnalyticsStorage) : {};
  } catch {
    return {};
  }
}

function write(patch: AnalyticsStorage): void {
  if (typeof window === 'undefined') return;
  const next = { ...read(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function recordVisit(): {
  visitCount: number;
  daysSinceLast: number | null;
  isReturning: boolean;
} {
  const prev = read();
  const prevCount = prev.visitCount ?? 0;
  const visitCount = prevCount + 1;
  const now = new Date();
  let daysSinceLast: number | null = null;
  if (prev.lastVisitAt) {
    const last = new Date(prev.lastVisitAt);
    daysSinceLast = Math.floor(
      (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
  }
  write({ visitCount, lastVisitAt: now.toISOString() });
  return {
    visitCount,
    daysSinceLast,
    isReturning: prevCount > 0,
  };
}

export function getSellerSegment(): SellerSegment | undefined {
  return read().sellerSegment;
}

export function getSellerSegmentSource(): 'self_report' | 'inferred' | undefined {
  return read().sellerSegmentSource;
}

export function getSelectedDestination(): string | undefined {
  return read().selectedDestination;
}

export function setSellerSegment(
  segment: SellerSegment,
  source: 'self_report' | 'inferred',
  selectedDestination?: string,
): void {
  write({
    sellerSegment: segment,
    sellerSegmentSource: source,
    ...(selectedDestination !== undefined
      ? { selectedDestination }
      : {}),
  });
}

export function setSelectedDestination(destination: string): void {
  write({ selectedDestination: destination });
}

export function setLastTemplateUsed(templateId: string): void {
  write({ lastTemplateId: templateId });
}

export function setLastPresetUsed(presetId: string): void {
  write({ lastPresetId: presetId });
}

export function getLastTemplateUsed(): string | undefined {
  return read().lastTemplateId;
}

export function getLastPresetUsed(): string | undefined {
  return read().lastPresetId;
}
