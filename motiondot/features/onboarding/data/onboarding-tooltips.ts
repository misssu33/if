import type { TooltipId } from '../types';

export const ONBOARDING_TOOLTIPS: Record<
  TooltipId,
  { title: string; body: string }
> = {
  'batch-conversion': {
    title: '배치 변환',
    body: '제품 영상·이미지를 한 번에 업로드하고 TikTok 9:16 프리셋으로 GIF·MP4·WebP를 빠르게 반복 export 할 수 있습니다.',
  },
  'sns-presets': {
    title: 'TikTok Affiliate Export',
    body: '기본 TikTok 9:16 프리셋이 적용됩니다. Reels·Threads·쿠팡 보조 프리셋도 선택할 수 있습니다.',
  },
  'motion-templates': {
    title: '제휴 숏폼 템플릿',
    body: '꿀템 추천·후기 폭발·훅 등 TikTok 제휴 9:16 템플릿으로 Photoshop 없이 광고를 만듭니다.',
  },
  'export-formats': {
    title: 'Export 포맷',
    body: 'GIF(피드), MP4(릴스), WebP(경량 루프) 중 복수 선택 후 한 번에 export 할 수 있습니다.',
  },
};
