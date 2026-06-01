import type { SellerSegment } from '@/lib/analytics';

export type SellerDestinationOption = {
  segment: SellerSegment;
  label: string;
};

/** Export 완료 후 선택지 */
export const SELLER_DESTINATION_OPTIONS: SellerDestinationOption[] = [
  { segment: 'coupang_detail', label: '쿠팡 상세페이지' },
  { segment: 'smartstore', label: '스마트스토어' },
  { segment: 'tiktok_reels', label: '틱톡 / 릴스' },
  { segment: 'client_delivery', label: '클라이언트 납품' },
  { segment: 'personal_sns', label: '개인 SNS' },
  { segment: 'other', label: '기타' },
];
