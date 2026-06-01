import type { AnalyticsDeviceType } from './device';

export const ANALYTICS_EVENTS = {
  templateViewed: 'template_viewed',
  templateSelected: 'template_selected',
  templateExported: 'template_exported',
  templateAbandoned: 'template_abandoned',
  presetApplied: 'preset_applied',
  sellerSegmentIdentified: 'seller_segment_identified',
  exportDestinationSelected: 'export_destination_selected',
  returningVisit: 'returning_visit',
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type SellerSegment =
  | 'coupang_detail'
  | 'smartstore'
  | 'tiktok_reels'
  | 'client_delivery'
  | 'personal_sns'
  | 'other';

export type TemplateExportedPayload = {
  template_id: string;
  template_name: string;
  export_format: string;
  preset_used: string;
  aspect_ratio: string;
  cta_edited: boolean;
  edit_time_sec: number;
  watermarked: boolean;
  device_type: AnalyticsDeviceType;
};

export type AnalyticsEventPayload = Record<string, unknown>;
