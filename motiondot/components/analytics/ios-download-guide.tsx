'use client';
import type { ReactNode } from 'react';

import { useState } from 'react';
import type { OutputFormat } from '@/types';
import { isIosDevice } from '@/lib/analytics/device';
import { useAnalytics } from '@/hooks/useAnalytics';

type IosDownloadGuideProps = {
  exportFormat: OutputFormat;
  templateId?: string;
  presetUsed?: string;
  onProceed: () => void;
  children: (props: { onDownloadClick: () => void }) => ReactNode;
};

/** iOS Safari — 다운로드 전 안내 + analytics */
export function IosDownloadGuide({
  exportFormat,
  templateId,
  presetUsed,
  onProceed,
  children,
}: IosDownloadGuideProps) {
  const analytics = useAnalytics();
  const [showGuide, setShowGuide] = useState(false);

  const handleDownloadClick = () => {
    if (!isIosDevice()) {
      onProceed();
      return;
    }

    analytics.iosDownloadGuideShown({
      export_format: exportFormat,
      template_id: templateId,
      preset_used: presetUsed,
    });
    setShowGuide(true);
  };

  const confirmDownload = () => {
    analytics.iosDownloadClicked({
      export_format: exportFormat,
      template_id: templateId,
      preset_used: presetUsed,
    });
    setShowGuide(false);
    onProceed();
  };

  return (
    <>
      {children({ onDownloadClick: handleDownloadClick })}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-labelledby="ios-download-title"
        >
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <h3
              id="ios-download-title"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
            >
              iOS에서 파일 받기
            </h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              Safari에서는 «공유» → «파일에 저장» 또는 «다운로드»를 눌러
              {exportFormat.toUpperCase()} 파일을 저장하세요. 새 탭이 열리면
              길게 눌러 저장할 수 있습니다.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-xs dark:border-zinc-600"
                onClick={() => setShowGuide(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white"
                onClick={confirmDownload}
              >
                열기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
