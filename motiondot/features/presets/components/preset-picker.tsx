'use client';

import type { MotionDotPreset } from '@/types';
import { PresetPlatformGrid } from './preset-platform-grid';

type PresetPickerProps = {
  presets: MotionDotPreset[];
  loading?: boolean;
};

/** SNS export 프리셋 선택 UI */
export function PresetPicker({ presets, loading }: PresetPickerProps) {
  return <PresetPlatformGrid presets={presets} loading={loading} />;
}
