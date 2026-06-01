'use client';

import { Button } from '@/components/ui';
import { IosDownloadGuide } from '@/components/analytics/ios-download-guide';
import { useExportSessionStore } from '../stores/use-export-session-store';
import { useExportHistory } from '../hooks/use-export-history';
import { useDownloadManager } from '../hooks/use-download-manager';
import { usePreviewStore } from '@/features/preview/stores/use-preview-store';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import type { OutputFormat } from '@/types';

/** 개별 · 전체 · ZIP 다운로드 */
export function BatchDownloadPanel() {
  const lastBatchId = useExportSessionStore((s) => s.lastBatchId);
  const { records, loading } = useExportHistory(lastBatchId);
  const { downloadOne, downloadAll, downloadZip } = useDownloadManager();
  const templateId = usePreviewStore((s) => s.templateId);
  const presetId = useExportSettingsStore((s) => s.resolved?.presetId);

  const completed = records.filter(
    (r) => r.status === 'completed' && r.outputPath,
  );

  if (!lastBatchId) {
    return (
      <p className="text-xs text-zinc-500">
        배치 export 후 다운로드할 수 있습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <DownloadAction
          label="전체 다운로드"
          disabled={loading || completed.length === 0}
          exportFormat={completed[0]?.format ?? 'gif'}
          templateId={templateId}
          presetUsed={presetId}
          onProceed={() => downloadAll(records)}
        />
        <DownloadAction
          label="ZIP 배치"
          disabled={loading || completed.length === 0}
          exportFormat="gif"
          templateId={templateId}
          presetUsed={presetId}
          onProceed={() => downloadZip(lastBatchId)}
        />
      </div>
      <ul className="max-h-40 overflow-y-auto text-xs">
        {records.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-2 border-b border-zinc-100 py-2 dark:border-zinc-800"
          >
            <span className="truncate">
              {r.fileName} · {r.format.toUpperCase()} · {r.status}
            </span>
            {r.status === 'completed' && r.outputPath && (
              <DownloadAction
                label="받기"
                asLink
                exportFormat={r.format}
                templateId={templateId}
                presetUsed={presetId}
                onProceed={() => downloadOne(r)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DownloadAction({
  label,
  disabled,
  exportFormat,
  templateId,
  presetUsed,
  onProceed,
  asLink,
}: {
  label: string;
  disabled?: boolean;
  exportFormat: OutputFormat;
  templateId: string;
  presetUsed?: string;
  onProceed: () => void;
  asLink?: boolean;
}) {
  return (
    <IosDownloadGuide
      exportFormat={exportFormat}
      templateId={templateId}
      presetUsed={presetUsed}
      onProceed={onProceed}
    >
      {({ onDownloadClick }) =>
        asLink ? (
          <button
            type="button"
            className="shrink-0 text-violet-600 hover:underline disabled:opacity-50"
            disabled={disabled}
            onClick={onDownloadClick}
          >
            {label}
          </button>
        ) : (
          <Button
            type="button"
            disabled={disabled}
            onClick={onDownloadClick}
          >
            {label}
          </Button>
        )
      }
    </IosDownloadGuide>
  );
}
