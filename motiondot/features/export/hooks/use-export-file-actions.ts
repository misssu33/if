'use client';

import { useCallback, useState } from 'react';
import type { OutputFormat } from '@/types';
import { canShareFiles, canUseWebShare } from '@/lib/utils/device';
import { buildExportDownloadUrl } from '../utils/build-export-download-url';

export type ExportFileTarget = {
  fileName: string;
  outputPath: string;
  format: OutputFormat;
};

function mimeForFormat(format: OutputFormat): string {
  if (format === 'gif') return 'image/gif';
  if (format === 'webp') return 'image/webp';
  return 'video/mp4';
}

/** Export 파일 열기 · 다운로드 · 공유 (iOS·데스크톱 공통 URL) */
export function useExportFileActions() {
  const [shareError, setShareError] = useState<string | null>(null);

  const getUrl = useCallback(
    (target: ExportFileTarget) =>
      buildExportDownloadUrl(target.outputPath, target.format),
    [],
  );

  const openFile = useCallback((target: ExportFileTarget) => {
    setShareError(null);
    window.open(getUrl(target), '_blank', 'noopener,noreferrer');
  }, [getUrl]);

  /** 데스크톱·Android: attachment 다운로드 / iOS: 새 탭 열기 */
  const downloadFile = useCallback(
    (target: ExportFileTarget, options?: { preferAttachment?: boolean }) => {
      setShareError(null);
      const url = getUrl(target);
      const preferAttachment = options?.preferAttachment ?? true;

      if (preferAttachment && typeof document !== 'undefined') {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = target.fileName.includes('.')
          ? target.fileName
          : `${target.fileName}.${target.format}`;
        anchor.rel = 'noopener noreferrer';
        anchor.click();
        return;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [getUrl],
  );

  const shareFile = useCallback(
    async (target: ExportFileTarget) => {
      if (!canUseWebShare()) {
        setShareError('이 브라우저에서는 공유를 지원하지 않습니다.');
        return;
      }

      setShareError(null);
      const url = getUrl(target);
      const fileName = target.fileName.includes('.')
        ? target.fileName
        : `${target.fileName}.${target.format}`;

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('파일을 불러오지 못했습니다.');
        }
        const blob = await res.blob();
        const file = new File([blob], fileName, {
          type: blob.type || mimeForFormat(target.format),
        });

        if (canShareFiles() && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: fileName,
          });
          return;
        }

        await navigator.share({
          title: fileName,
          url: window.location.origin + url,
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setShareError(
          err instanceof Error
            ? err.message
            : '공유에 실패했습니다. 파일 열기를 시도해 주세요.',
        );
      }
    },
    [getUrl],
  );

  return {
    getUrl,
    openFile,
    downloadFile,
    shareFile,
    shareError,
    canShare: canUseWebShare(),
    clearShareError: () => setShareError(null),
  };
}
