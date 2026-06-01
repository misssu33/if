/** 오버레이 텍스트 레이어 ID */
export type OverlayLayerId = 'headline' | 'subline' | 'cta' | 'badge';

export type TextAlign = 'left' | 'center' | 'right';

/** 레이어별 타이포·스타일 (템플릿 기본값 + 사용자 덮어쓰기) */
export type OverlayLayerStyle = {
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: TextAlign;
  opacity: number;
};

export type OverlayLayerContent = {
  text: string;
  style: OverlayLayerStyle;
};

export type OverlayEditorState = Record<OverlayLayerId, OverlayLayerContent>;

export const OVERLAY_LAYER_LABELS: Record<OverlayLayerId, string> = {
  headline: '헤드라인',
  subline: '서브카피',
  cta: 'CTA',
  badge: '뱃지',
};
