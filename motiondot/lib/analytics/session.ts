/** 세션 메모리 — 중복 이벤트 방지·편집 시간 추적 */

const firedOnce = new Set<string>();
let templateEditStartedAt: number | null = null;
let defaultCtaSnapshot: string | null = null;
let ctaEdited = false;
let templateSelectedThisSession = false;
let exportCompletedThisSession = false;

export function markOnce(key: string): boolean {
  if (firedOnce.has(key)) return false;
  firedOnce.add(key);
  return true;
}

export function startTemplateEditSession(defaultCta?: string): void {
  if (templateEditStartedAt === null) {
    templateEditStartedAt = Date.now();
  }
  if (defaultCta !== undefined && defaultCtaSnapshot === null) {
    defaultCtaSnapshot = defaultCta;
  }
}

export function noteCtaChange(currentCta: string): void {
  if (defaultCtaSnapshot !== null && currentCta !== defaultCtaSnapshot) {
    ctaEdited = true;
  }
}

export function getCtaEdited(): boolean {
  return ctaEdited;
}

export function getEditTimeSec(): number {
  if (templateEditStartedAt === null) return 0;
  return Math.round((Date.now() - templateEditStartedAt) / 1000);
}

export function markTemplateSelected(): void {
  templateSelectedThisSession = true;
  startTemplateEditSession();
}

export function wasTemplateSelectedThisSession(): boolean {
  return templateSelectedThisSession;
}

export function markExportCompleted(): void {
  exportCompletedThisSession = true;
}

export function hadExportThisSession(): boolean {
  return exportCompletedThisSession;
}

export function resetTemplateEditTimer(): void {
  templateEditStartedAt = Date.now();
}

let activeTemplateId: string | undefined;
let activeTemplateName: string | undefined;

export function setActiveTemplateMeta(id: string, name?: string): void {
  activeTemplateId = id;
  activeTemplateName = name;
}

export function getActiveTemplateMeta(): {
  id?: string;
  name?: string;
} {
  return { id: activeTemplateId, name: activeTemplateName };
}
