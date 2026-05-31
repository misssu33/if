export type PresetPlatform = 'instagram-reels' | 'youtube-shorts' | 'tiktok';

export interface VideoPreset {
  id: string;
  name: string;
  platform: PresetPlatform;
  width: number;
  height: number;
  fps: number;
  maxDurationSec: number;
}
