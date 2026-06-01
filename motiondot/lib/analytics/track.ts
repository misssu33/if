import { getDeviceType } from './device';
import {
  getAnonId,
  getExportCount,
  getVisitCount,
  incrementExportCount,
  setLastPresetId,
  setLastTemplateId,
} from './identity';
import type {
  AnalyticsEventName,
  AnalyticsEventPayload,
  SellerSegment,
  TemplateExportedPayload,
} from './events';
import { ANALYTICS_EVENTS } from './events';
import { sendToPostHog } from './posthog';
import type { MotionTemplateDefinition } from '@/types/motion-template';
import type { MotionDotPreset } from '@/types';
import {
  clearExportAttempt,
  getEditMetrics,
  markExportAttempt,
  noteTemplateContext,
  touchTextEdit,
  wasExportAttempted,
} from './session-context';
import { readStorage, writeStorage } from './local-store';
import { ANALYTICS_STORAGE_KEYS } from './storage-keys';

function baseProperties(): Record<string, unknown> {
  return {
    anon_id: getAnonId(),
    visit_count: getVisitCount(),
    export_count: getExportCount(),
    device_type: getDeviceType(),
  };
}

function emit(event: AnalyticsEventName, properties?: AnalyticsEventPayload): void {
  const merged = { ...baseProperties(), ...properties };
  sendToPostHog(event, merged);
  if (process.env.NODE_ENV === 'development') {
    console.debug('[motiondot analytics]', event, merged);
  }
}

export function trackReturningVisit(): void {
  emit(ANALYTICS_EVENTS.returningVisit, {
    visit_count: getVisitCount(),
  });
}

export function trackTemplateViewed(template: MotionTemplateDefinition): void {
  emit(ANALYTICS_EVENTS.templateViewed, {
    template_id: template.id,
    template_name: template.name,
    aspect_ratio: template.aspectRatio,
    target_platform: template.targetPlatform,
  });
}

export function trackTemplateSelected(template: MotionTemplateDefinition): void {
  noteTemplateContext(template);
  setLastTemplateId(template.id);
  emit(ANALYTICS_EVENTS.templateSelected, {
    template_id: template.id,
    template_name: template.name,
    aspect_ratio: template.aspectRatio,
    target_platform: template.targetPlatform,
    recommended_preset_id: template.recommendedPresetId,
  });
}

export function trackPresetApplied(preset: MotionDotPreset): void {
  setLastPresetId(preset.id);
  emit(ANALYTICS_EVENTS.presetApplied, {
    preset_id: preset.id,
    preset_name: preset.name,
    platform: preset.platform,
    aspect_ratio: preset.aspectRatio,
    output_format: preset.outputFormat,
  });
}

export function trackTextOverlayEdited(): void {
  touchTextEdit();
}

export function trackExportStarted(): void {
  markExportAttempt();
}

export function trackTemplateExported(
  input: Omit<TemplateExportedPayload, 'device_type' | 'watermarked'> & {
    watermarked?: boolean;
  },
): void {
  clearExportAttempt();
  incrementExportCount();
  setLastTemplateId(input.template_id);

  emit(ANALYTICS_EVENTS.templateExported, {
    ...input,
    watermarked: input.watermarked ?? resolveWatermarkedDefault(),
    device_type: getDeviceType(),
    export_count: getExportCount(),
  });
}

export function trackTemplateAbandoned(reason: string): void {
  if (!wasExportAttempted()) return;
  clearExportAttempt();

  const templateId = readStorage(ANALYTICS_STORAGE_KEYS.lastTemplate);
  const presetId = readStorage(ANALYTICS_STORAGE_KEYS.lastPreset);

  emit(ANALYTICS_EVENTS.templateAbandoned, {
    template_id: templateId,
    preset_id: presetId,
    reason,
  });
}

export function trackExportDestinationSelected(
  segment: SellerSegment,
  label: string,
): void {
  writeStorage(ANALYTICS_STORAGE_KEYS.segment, segment);
  writeStorage(ANALYTICS_STORAGE_KEYS.destinationPromptSeen, '1');

  emit(ANALYTICS_EVENTS.exportDestinationSelected, {
    segment,
    label,
  });
  emit(ANALYTICS_EVENTS.sellerSegmentIdentified, {
    segment,
    label,
    source: 'post_export_prompt',
  });
}

export function buildTemplateExportedPayload(input: {
  template: MotionTemplateDefinition;
  exportFormat: string;
  presetId: string;
  headline: string;
  subline: string;
  ctaText: string;
  badgeText: string;
}): TemplateExportedPayload {
  const { cta_edited, edit_time_sec } = getEditMetrics({
    headline: input.headline,
    subline: input.subline,
    ctaText: input.ctaText,
    badgeText: input.badgeText,
  });

  return {
    template_id: input.template.id,
    template_name: input.template.name,
    export_format: input.exportFormat,
    preset_used: input.presetId,
    aspect_ratio: input.template.aspectRatio,
    cta_edited,
    edit_time_sec,
    watermarked: resolveWatermarkedDefault(),
    device_type: getDeviceType(),
  };
}

function resolveWatermarkedDefault(): boolean {
  const tier = process.env.NEXT_PUBLIC_MOTIONDOT_TIER ?? 'free';
  return tier !== 'pro';
}

export { ANALYTICS_EVENTS };
export type { SellerSegment, TemplateExportedPayload };
