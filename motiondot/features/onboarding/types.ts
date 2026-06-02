/** 온보딩 3단계 */
export type GuidedStep = 1 | 2 | 3;

export type UploadIntent = 'video' | 'image' | 'template';

export type SampleProjectId =
  | 'tiktok-product-gif'
  | 'tiktok-review-gif'
  | 'tiktok-recommend-gif'
  | 'instagram-story-loop'
  | 'coupang-detail-gif';

export type SampleProject = {
  id: SampleProjectId;
  title: string;
  description: string;
  presetId: string;
  templateId: string;
  formats: ('gif' | 'mp4' | 'webp')[];
  accent: string;
};

export type TooltipId =
  | 'batch-conversion'
  | 'sns-presets'
  | 'motion-templates'
  | 'export-formats';
