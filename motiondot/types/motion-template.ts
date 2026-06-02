/** 모션 광고 템플릿 JSON 스키마 */
export type AnimationPresetId =
  | 'fade'
  | 'slide-up'
  | 'zoom'
  | 'pop'
  | 'glow'
  | 'shake'
  | 'loop-pulse';

export type TemplateLayerId =
  | 'background'
  | 'product'
  | 'logo'
  | 'headline'
  | 'subline'
  | 'cta'
  | 'badge';

export type MediaKind = 'image' | 'video' | 'none';

export interface ZoneTiming {
  startFrame: number;
  durationFrames: number;
}

export interface ZonePosition {
  x: string;
  y: string;
  width?: string;
  height?: string;
}

export interface TypographyStyle {
  fontSize: number;
  fontWeight: number;
  lineHeight?: number;
  letterSpacing?: number;
}

export interface TextZoneConfig {
  defaultText: string;
  animation: AnimationPresetId;
  timing: ZoneTiming;
  position: ZonePosition;
}

export interface CtaZoneConfig {
  defaultText: string;
  animation: AnimationPresetId;
  timing: ZoneTiming;
  position: ZonePosition;
  borderRadius?: number;
}

export interface MediaZoneConfig {
  kind: MediaKind;
  animation: AnimationPresetId;
  timing: ZoneTiming;
  position: ZonePosition;
  objectFit?: 'cover' | 'contain';
}

export interface BadgeZoneConfig {
  defaultText: string;
  animation: AnimationPresetId;
  timing: ZoneTiming;
  position: ZonePosition;
}

export interface TemplateLayout {
  background: MediaZoneConfig;
  product?: MediaZoneConfig;
  logo?: MediaZoneConfig;
  headline: TextZoneConfig;
  subline?: TextZoneConfig;
  cta?: CtaZoneConfig;
  badge?: BadgeZoneConfig;
}

export interface TemplateTheme {
  primary: string;
  secondary: string;
  text: string;
  ctaBackground: string;
  ctaText: string;
  overlay?: string;
}

export interface TemplateTypography {
  headline: TypographyStyle;
  subline?: TypographyStyle;
  cta?: TypographyStyle;
  badge?: TypographyStyle;
}

/** 타임라인 트랙 (확장용) */
export interface TimelineTrack {
  id: string;
  layer: TemplateLayerId;
  startFrame: number;
  durationFrames: number;
  animation: AnimationPresetId;
}

export type TemplateTargetPlatform =
  | 'tiktok'
  | 'instagram'
  | 'coupang'
  | 'reels'
  | 'affiliate'
  | 'multi';

/** TikTok 제휴 숏폼 카테고리 (셀렉터 정렬용) */
export type TikTokAffiliateCategory =
  | '꿀템 추천'
  | '후기 폭발'
  | '돈 버는 법'
  | '모르면 손해'
  | '오늘의 발견'
  | '문제 해결템'
  | '구매 전 확인';

export type TemplateMarketTier = 'primary' | 'secondary';

export interface MotionTemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: 'product' | 'promo' | 'story' | 'comparison' | 'lifestyle';
  /** 주 타깃 플랫폼 (셀렉터·가이드용) */
  targetPlatform?: TemplateTargetPlatform;
  /** TikTok 제휴 숏폼 카테고리 */
  affiliateCategory?: TikTokAffiliateCategory;
  /** primary = TikTok 제휴 우선 · secondary = 쿠팡 등 보조 */
  marketTier?: TemplateMarketTier;
  /** 권장 SNS export 프리셋 ID (presets/*.json) */
  recommendedPresetId?: string;
  durationSec: number;
  fps: number;
  width: number;
  height: number;
  aspectRatio: string;
  loop: boolean;
  layout: TemplateLayout;
  timeline: TimelineTrack[];
  theme: TemplateTheme;
  typography: TemplateTypography;
}

/** Remotion composition 런타임 입력 */
export interface MotionCompositionProps {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  loop: boolean;
  template: MotionTemplateDefinition;
  headline: string;
  subline: string;
  ctaText: string;
  badgeText: string;
  backgroundSrc?: string;
  productSrc?: string;
  logoSrc?: string;
  formatLabel?: string;
  showSafeZone?: boolean;
}
