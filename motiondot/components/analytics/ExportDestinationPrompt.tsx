'use client';

import { useState } from 'react';
import {
  ANALYTICS_STORAGE_KEYS,
  readStorage,
  writeStorage,
} from '@/lib/analytics';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SELLER_DESTINATION_OPTIONS } from './seller-destination-options';

type ExportDestinationPromptProps = {
  /** export 성공 후에만 true */
  visible: boolean;
};

/** Export 성공 후 선택적 판매 채널 질문 — 다운로드 차단 없음 */
export function ExportDestinationPrompt({ visible }: ExportDestinationPromptProps) {
  const { trackDestination } = useAnalytics();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return true;
    return readStorage(ANALYTICS_STORAGE_KEYS.destinationPromptSeen) === '1';
  });

  if (!visible || dismissed) return null;

  const dismiss = () => {
    writeStorage(ANALYTICS_STORAGE_KEYS.destinationPromptSeen, '1');
    setDismissed(true);
  };

  const onSelect = (segment: (typeof SELLER_DESTINATION_OPTIONS)[number]) => {
    trackDestination(segment.segment, segment.label);
    dismiss();
  };

  return (
    <div
      className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900"
      role="dialog"
      aria-label="업로드 예정 채널"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
          주로 어디에 올리실 예정인가요?
        </p>
        <button
          type="button"
          className="min-h-9 shrink-0 rounded-lg px-2 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="닫기"
          onClick={dismiss}
        >
          닫기
        </button>
      </div>
      <ul className="flex flex-col gap-1.5">
        {SELLER_DESTINATION_OPTIONS.map((opt) => (
          <li key={opt.segment}>
            <button
              type="button"
              className="min-h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-800 hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-violet-600 dark:hover:bg-violet-950/30"
              onClick={() => onSelect(opt)}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
