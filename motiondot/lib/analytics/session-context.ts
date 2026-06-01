import type { MotionTemplateDefinition } from '@/types/motion-template';
import { writeSession } from './local-store';
import { ANALYTICS_SESSION_KEYS } from './storage-keys';

type CopyBaseline = {
  headline: string;
  subline: string;
  ctaText: string;
  badgeText: string;
};

let editStartedAt: number | null = null;
let copyBaseline: CopyBaseline | null = null;
let exportAttemptActive = false;

export function noteTemplateContext(template: MotionTemplateDefinition): void {
  editStartedAt = Date.now();
  const { layout } = template;
  copyBaseline = {
    headline: layout.headline.defaultText,
    subline: layout.subline?.defaultText ?? '',
    ctaText: layout.cta?.defaultText ?? '',
    badgeText: layout.badge?.defaultText ?? '',
  };
}

export function touchTextEdit(): void {
  if (editStartedAt === null) {
    editStartedAt = Date.now();
  }
}

export function markExportAttempt(): void {
  exportAttemptActive = true;
  writeSession(ANALYTICS_SESSION_KEYS.exportAttempt, '1');
}

export function clearExportAttempt(): void {
  exportAttemptActive = false;
  writeSession(ANALYTICS_SESSION_KEYS.exportAttempt, '');
}

export function wasExportAttempted(): boolean {
  return exportAttemptActive;
}

export function getEditMetrics(current: CopyBaseline): {
  cta_edited: boolean;
  edit_time_sec: number;
} {
  const baseline = copyBaseline ?? current;
  const cta_edited =
    current.headline !== baseline.headline ||
    current.subline !== baseline.subline ||
    current.ctaText !== baseline.ctaText ||
    current.badgeText !== baseline.badgeText;

  const edit_time_sec =
    editStartedAt !== null
      ? Math.max(0, Math.round((Date.now() - editStartedAt) / 1000))
      : 0;

  return { cta_edited, edit_time_sec };
}
