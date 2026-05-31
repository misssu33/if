import type { TooltipId } from '../types';

export const ONBOARDING_TOOLTIPS: Record<
  TooltipId,
  { title: string; body: string }
> = {
  'batch-conversion': {
    title: '배치 변환',
    body: '여러 영상을 한 번에 업로드하고, 동일 프리셋으로 GIF·MP4·WebP를 일괄 생성할 수 있습니다.',
  },
  'sns-presets': {
    title: 'SNS 프리셋',
    body: 'TikTok, Instagram, Coupang 등 플랫폼별 해상도·FPS·용량 제한이 미리 설정되어 있습니다.',
  },
  'motion-templates': {
    title: '모션 템플릿',
    body: '텍스트 모션, CTA, 제품 영역이 포함된 광고 템플릿으로 Photoshop 없이 광고를 만듭니다.',
  },
  'export-formats': {
    title: 'Export 포맷',
    body: 'GIF(피드), MP4(릴스), WebP(경량 루프) 중 복수 선택 후 한 번에 export 할 수 있습니다.',
  },
};
