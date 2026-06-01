'use client';

import { useEffect, useState } from 'react';
import type { SellerSegment } from '@/lib/analytics/storage';
import { getSellerSegment, setSellerSegment } from '@/lib/analytics/storage';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';

const OPTIONS: { value: SellerSegment; label: string }[] = [
  { value: 'marketplace_seller', label: '마켓플레이스 셀러' },
  { value: 'brand_dtc', label: '브랜드 / DTC' },
  { value: 'creator', label: '크리에이터' },
  { value: 'agency', label: '대행사' },
  { value: 'other', label: '기타' },
];

/** 셀러 세그먼트 self-report (익명 localStorage) */
export function SellerSegmentPicker() {
  const analytics = useAnalytics();
  const preset = useExportSettingsStore((s) => s.preset);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(getSellerSegment() ?? '');
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        판매 유형 (선택 · 측정용)
      </p>
      <p className="text-[10px] text-zinc-500">
        개인 정보는 수집하지 않습니다. 템플릿·export 개선에만 사용됩니다.
      </p>
      <select
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        value={value}
        onChange={(e) => {
          const segment = e.target.value as SellerSegment | '';
          setValue(segment);
          if (!segment) return;
          const destination = preset?.platform;
          setSellerSegment(segment, 'self_report', destination);
          analytics.sellerSegmentIdentified({
            segment,
            source: 'self_report',
            selected_destination: destination,
          });
        }}
      >
        <option value="">선택하세요 (선택 사항)</option>
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
