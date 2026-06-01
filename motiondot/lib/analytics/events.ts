import type { OutputFormat } from '@/types';
import { captureEvent } from './posthog';
import { deviceContext } from './device';
import {
  getLastPresetUsed,
  getLastTemplateUsed,
  getSelectedDestination,
  getSellerSegment,
  type SellerSegment,
} from './storage';
import {
  getCtaEdited,
  getEditTimeSec,
  markOnce,
} from './session';


function baseDeviceProps() {
  const { device_type, browser, is_ios } = deviceContext();
  return { device_type, browser, is_ios };
}

export function trackAppOpened(): void {
  if (!markOnce('app_opened')) return;
  captureEvent('app_opened', baseDeviceProps());
}

export function trackReturningVisit(payload: {
  visit_count: number;
  days_since_last: number | null;
  last_template_used?: string;
  last_preset_used?: string;
}): void {
  if (!markOnce('returning_visit')) return;
  captureEvent('returning_visit', {
    ...baseDeviceProps(),
    visit_count: payload.visit_count,
    days_since_last: payload.days_since_last ?? -1,
    last_template_used: payload.last_template_used,
    last_preset_used: payload.last_preset_used,
  });
}

export function trackTemplateViewed(payload: {
  template_id: string;
  template_name?: string;
}): void {
  const key = `template_viewed:${payload.template_id}`;
  if (!markOnce(key)) return;
  captureEvent('template_viewed', {
    ...baseDeviceProps(),
    template_id: payload.template_id,
    template_name: payload.template_name,
  });
}

export function trackTemplateSelected(payload: {
  template_id: string;
  template_name?: string;
}): void {
  const key = `template_selected:${payload.template_id}`;
  if (!markOnce(key)) return;
  captureEvent('template_selected', {
    ...baseDeviceProps(),
    template_id: payload.template_id,
    template_name: payload.template_name,
  });
}

export function trackTemplateAbandoned(payload: {
  template_id: string;
  template_name?: string;
  step?: number;
}): void {
  const key = `template_abandoned:${payload.template_id}:${payload.step ?? 0}`;
  if (!markOnce(key)) return;
  captureEvent('template_abandoned', {
    ...baseDeviceProps(),
    template_id: payload.template_id,
    template_name: payload.template_name,
    step: payload.step,
  });
}

export function trackPresetApplied(payload: {
  preset_id: string;
  preset_name?: string;
  platform?: string;
}): void {
  captureEvent('preset_applied', {
    ...baseDeviceProps(),
    preset_id: payload.preset_id,
    preset_name: payload.preset_name,
    platform: payload.platform,
  });
}

export function trackExportDestinationSelected(payload: {
  destination: string;
  preset_id?: string;
}): void {
  captureEvent('export_destination_selected', {
    ...baseDeviceProps(),
    destination: payload.destination,
    preset_id: payload.preset_id,
  });
}

export function trackSellerSegmentIdentified(payload: {
  segment: SellerSegment;
  source: 'self_report' | 'inferred';
  selected_destination?: string;
}): void {
  const key = `seller_segment:${payload.segment}:${payload.source}`;
  if (!markOnce(key)) return;
  captureEvent('seller_segment_identified', {
    ...baseDeviceProps(),
    segment: payload.segment,
    source: payload.source,
    selected_destination: payload.selected_destination,
  });
}

export function trackExportStarted(payload: {
  export_format: OutputFormat;
  template_id?: string;
  preset_used?: string;
  job_count?: number;
}): void {
  captureEvent('export_started', {
    ...baseDeviceProps(),
    export_format: payload.export_format,
    template_id: payload.template_id,
    preset_used: payload.preset_used,
    job_count: payload.job_count,
  });
}

export function trackExportCompleted(payload: {
  export_format: OutputFormat;
  template_id?: string;
  preset_used?: string;
  job_id?: string;
}): void {
  const key = `export_completed:${payload.job_id ?? payload.export_format}`;
  if (payload.job_id && !markOnce(key)) return;
  captureEvent('export_completed', {
    ...baseDeviceProps(),
    export_format: payload.export_format,
    template_id: payload.template_id,
    preset_used: payload.preset_used,
    job_id: payload.job_id,
  });
}

export function trackExportFailed(payload: {
  error_type: string;
  error_message?: string;
  export_format: OutputFormat;
  template_id?: string;
  preset_used?: string;
}): void {
  const { device_type, browser, is_ios } = deviceContext();
  captureEvent('export_failed', {
    error_type: payload.error_type,
    error_message: payload.error_message?.slice(0, 200),
    export_format: payload.export_format,
    template_id: payload.template_id,
    preset_used: payload.preset_used,
    device_type,
    browser,
    is_ios,
  });
}

export function trackTemplateExported(payload: {
  template_id: string;
  template_name?: string;
  preset_used?: string;
  export_format: OutputFormat;
  aspect_ratio?: string;
  cta_edited: boolean;
  edit_time_sec: number;
  watermarked?: boolean;
  char_count?: number;
}): void {
  const key = `template_exported:${payload.template_id}:${payload.export_format}:${payload.preset_used ?? ''}`;
  if (!markOnce(key)) return;

  const segment = getSellerSegment();
  const { device_type, browser } = deviceContext();

  captureEvent('template_exported', {
    template_id: payload.template_id,
    template_name: payload.template_name,
    preset_used: payload.preset_used,
    export_format: payload.export_format,
    aspect_ratio: payload.aspect_ratio,
    cta_edited: payload.cta_edited,
    edit_time_sec: payload.edit_time_sec,
    watermarked: payload.watermarked ?? false,
    device_type,
    browser,
    seller_segment: segment,
    char_count: payload.char_count,
  });
}

export function trackIosDownloadGuideShown(payload: {
  export_format: OutputFormat;
  template_id?: string;
  preset_used?: string;
}): void {
  const key = `ios_guide:${payload.export_format}:${payload.template_id ?? ''}`;
  if (!markOnce(key)) return;
  captureEvent('ios_download_guide_shown', {
    export_format: payload.export_format,
    template_id: payload.template_id,
    preset_used: payload.preset_used,
    browser: deviceContext().browser,
  });
}

export function trackIosDownloadClicked(payload: {
  export_format: OutputFormat;
  template_id?: string;
  preset_used?: string;
}): void {
  captureEvent('ios_download_clicked', {
    export_format: payload.export_format,
    template_id: payload.template_id,
    preset_used: payload.preset_used,
    browser: deviceContext().browser,
  });
}

/** 프리셋 플랫폼 → 추정 세그먼트 (명시 선택 없을 때 1회) */
export function inferSegmentFromPlatform(
  platform: string,
): SellerSegment | null {
  switch (platform) {
    case 'coupang':
    case 'naver':
      return 'marketplace_seller';
    case 'tiktok':
    case 'instagram':
    case 'threads':
      return 'creator';
    case 'kakaotalk':
      return 'brand_dtc';
    default:
      return null;
  }
}

export function analyticsContextForExport() {
  return {
    lastTemplate: getLastTemplateUsed(),
    lastPreset: getLastPresetUsed(),
    destination: getSelectedDestination(),
    ctaEdited: getCtaEdited(),
    editTimeSec: getEditTimeSec(),
  };
}
