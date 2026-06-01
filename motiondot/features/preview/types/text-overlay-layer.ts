/** 미리보기에서 탭·포커스 가능한 텍스트 오버레이 레이어 */
export type TextOverlayLayerId = 'headline' | 'subline' | 'cta' | 'badge';

export const TEXT_OVERLAY_LAYER_ORDER: TextOverlayLayerId[] = [
  'headline',
  'subline',
  'cta',
  'badge',
];

export const TEXT_OVERLAY_LAYER_LABELS: Record<TextOverlayLayerId, string> = {
  headline: '헤드라인',
  subline: '서브카피',
  cta: 'CTA',
  badge: '뱃지',
};
