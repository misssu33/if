'use client';

import { useState } from 'react';
import type { OutputFormat } from '@/types';
import { Button } from '@/components/ui';
import { useIsIOS } from '../hooks/use-is-ios';
import {
  useExportFileActions,
  type ExportFileTarget,
} from '../hooks/use-export-file-actions';

type IOSDownloadGuideProps = {
  fileName: string;
  outputPath: string;
  format: OutputFormat;
  /** 여러 파일일 때 안내 문구 보강 */
  compact?: boolean;
};

function formatTips(format: OutputFormat): string[] {
  const isVideo = format === 'mp4';
  const media = isVideo ? '동영상' : '이미지';

  return [
    `파일이 새 탭에서 열리거나 Files(파일) 앱에 저장될 수 있습니다.`,
    `Photos(사진) 앱에 넣으려면: 공유 버튼 → 「${isVideo ? '비디오 저장' : '이미지 저장'}」 또는 Files에서 파일을 길게 눌러 저장하세요.`,
    `TikTok 업로드: TikTok 앱 → 「+」 → 업로드 → 「기기에서 선택」 → Files 또는 다운로드한 ${media}를 선택하세요.`,
    `브라우저가 자동 다운로드를 막으면 「파일 열기」 또는 「공유」를 사용하세요.`,
  ];
}

/** iPhone·iPad Safari 등 iOS 다운로드 안내 */
export function IOSDownloadGuide({
  fileName,
  outputPath,
  format,
  compact = false,
}: IOSDownloadGuideProps) {
  const isIOS = useIsIOS();
  const [helpOpen, setHelpOpen] = useState(!compact);
  const {
    openFile,
    downloadFile,
    shareFile,
    shareError,
    canShare,
    clearShareError,
  } = useExportFileActions();

  if (!isIOS || !outputPath) return null;

  const target: ExportFileTarget = { fileName, outputPath, format };
  const tips = formatTips(format);

  return (
    <div
      className="rounded-lg border border-sky-200 bg-sky-50/90 p-3 text-sm dark:border-sky-900 dark:bg-sky-950/40"
      role="region"
      aria-label="iPhone 저장 안내"
    >
      <p className="font-medium text-sky-950 dark:text-sky-100">
        iPhone에서 저장하기
      </p>
      <p className="mt-1 truncate text-xs text-sky-800 dark:text-sky-300">
        {fileName} · {format.toUpperCase()}
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={() => {
            clearShareError();
            openFile(target);
          }}
        >
          파일 열기
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => {
            clearShareError();
            downloadFile(target, { preferAttachment: false });
          }}
        >
          다운로드
        </Button>
        {canShare && (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => void shareFile(target)}
          >
            공유
          </Button>
        )}
      </div>

      {shareError && (
        <p className="mt-2 text-xs text-amber-800 dark:text-amber-300" role="alert">
          {shareError}
        </p>
      )}

      <button
        type="button"
        className="mt-3 text-xs font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
        aria-expanded={helpOpen}
        onClick={() => setHelpOpen((v) => !v)}
      >
        {helpOpen ? 'iPhone 저장 방법 숨기기' : 'iPhone에 저장하는 방법'}
      </button>

      {helpOpen && (
        <ul className="mt-2 list-disc space-y-2 pl-4 text-xs leading-relaxed text-sky-900 dark:text-sky-200">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
