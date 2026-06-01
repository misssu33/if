export { ANALYTICS_EVENTS, type AnalyticsEventName, type SellerSegment } from './events';
export { ANALYTICS_STORAGE_KEYS, ANALYTICS_SESSION_KEYS } from './storage-keys';
export { readStorage, writeStorage } from './local-store';
export { initAnalyticsIdentity, getAnonId, getVisitCount, getExportCount } from './identity';
export { isPostHogConfigured } from './posthog';
export {
  trackReturningVisit,
  trackTemplateViewed,
  trackTemplateSelected,
  trackPresetApplied,
  trackTextOverlayEdited,
  trackExportStarted,
  trackTemplateExported,
  trackTemplateAbandoned,
  trackExportDestinationSelected,
  buildTemplateExportedPayload,
} from './track';
