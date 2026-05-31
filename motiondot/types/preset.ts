/** SNS 플랫폼 식별자 — presets/*.json과 동기화 */
export type PresetPlatform =
  | 'tiktok'
  | 'instagram-reels'
  | 'threads'
  | 'coupang-product';

/** presets/ JSON 스키마 */
export interface VideoPreset {
  id: string;
  name: string;
  platform: PresetPlatform;
  width: number;
  height: number;
  fps: number;
  maxDurationSec: number;
  description?: string;
}
