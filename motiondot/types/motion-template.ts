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

export interface MotionTemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: 'product' | 'promo' | 'story' | 'comparison' | 'lifestyle';
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

/** Remotion 워터마크 (무료 플랜 미리보기) */
export type CompositionWatermark = {
  enabled: boolean;
  opacity: number;
};

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
  /** 무료 플랜 MotionDot 워터마크 */
  watermark?: CompositionWatermark;
}
