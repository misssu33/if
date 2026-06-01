import type { OverlayTextStyle, TypographyStyle } from '@/types/motion-template';

type MergeInput = {
  typo: TypographyStyle;
  themeColor: string;
  custom?: OverlayTextStyle;
  animOpacity: number;
};

/** 템플릿 타이포 + 편집기 스타일 병합 */
export function mergeOverlayTextStyle(input: MergeInput) {
  const { typo, themeColor, custom, animOpacity } = input;
  const opacity = (custom?.opacity ?? 1) * animOpacity;
  return {
    fontSize: custom?.fontSize ?? typo.fontSize,
    fontWeight: custom?.fontWeight ?? typo.fontWeight,
    color: custom?.color ?? themeColor,
    textAlign: custom?.textAlign ?? ('left' as const),
    lineHeight: typo.lineHeight ?? 1.2,
    letterSpacing: typo.letterSpacing,
    opacity,
  };
}
