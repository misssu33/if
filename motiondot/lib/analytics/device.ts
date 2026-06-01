export type AnalyticsDeviceType = 'mobile' | 'tablet' | 'desktop';

/** UA·뷰포트 기반 기기 분류 */
export function getDeviceType(): AnalyticsDeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent;
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) return 'tablet';

  const narrow =
    window.matchMedia('(max-width: 768px)').matches ||
    /iPhone|iPod|Android.*Mobile|webOS|BlackBerry/i.test(ua);

  return narrow ? 'mobile' : 'desktop';
}
